import { Injectable, Logger } from '@nestjs/common';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private memoryCache = new Map<string, CacheEntry<any>>();

  // Upstash Redis REST Config
  private readonly redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  private readonly redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  constructor() {
    if (this.redisUrl && this.redisToken) {
      this.logger.log('🚀 L2 Upstash Redis caching enabled.');
    } else {
      this.logger.log('⚡ L1 In-Memory caching active (add UPSTASH_REDIS_REST_URL for persistent L2).');
    }

    // Periodic sweep of expired in-memory items every 5 minutes
    setInterval(() => this.sweepExpired(), 5 * 60 * 1000).unref();
  }

  private sweepExpired() {
    const now = Date.now();
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.expiresAt <= now) {
        this.memoryCache.delete(key);
      }
    }
  }

  /**
   * Get item from L1 (Memory) then L2 (Upstash Redis)
   */
  async get<T = any>(key: string): Promise<T | null> {
    const now = Date.now();

    // 1. Check L1 Memory
    const l1Entry = this.memoryCache.get(key);
    if (l1Entry) {
      if (l1Entry.expiresAt > now) {
        return l1Entry.value as T;
      }
      this.memoryCache.delete(key);
    }

    // 2. Check L2 Upstash Redis if configured
    if (this.redisUrl && this.redisToken) {
      try {
        const res = await fetch(`${this.redisUrl}/get/${encodeURIComponent(key)}`, {
          headers: { Authorization: `Bearer ${this.redisToken}` },
        });
        if (res.ok) {
          const json = await res.json();
          if (json?.result !== null && json?.result !== undefined) {
            const parsed = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
            // Populate L1 cache for subsequent instant hits
            this.memoryCache.set(key, { value: parsed, expiresAt: now + 60 * 1000 });
            return parsed as T;
          }
        }
      } catch (err: any) {
        this.logger.warn(`Redis GET failed for key "${key}": ${err?.message}`);
      }
    }

    return null;
  }

  /**
   * Set item in L1 (Memory) and L2 (Upstash Redis)
   */
  async set(key: string, value: any, ttlSeconds = 600): Promise<void> {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.memoryCache.set(key, { value, expiresAt });

    if (this.redisUrl && this.redisToken) {
      try {
        const serialized = JSON.stringify(value);
        await fetch(`${this.redisUrl}/set/${encodeURIComponent(key)}?ex=${ttlSeconds}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.redisToken}`,
            'Content-Type': 'application/json',
          },
          body: serialized,
        });
      } catch (err: any) {
        this.logger.warn(`Redis SET failed for key "${key}": ${err?.message}`);
      }
    }
  }

  /**
   * Delete item from both L1 and L2
   */
  async del(key: string): Promise<void> {
    this.memoryCache.delete(key);

    if (this.redisUrl && this.redisToken) {
      try {
        await fetch(`${this.redisUrl}/del/${encodeURIComponent(key)}`, {
          headers: { Authorization: `Bearer ${this.redisToken}` },
        });
      } catch (err: any) {
        this.logger.warn(`Redis DEL failed for key "${key}": ${err?.message}`);
      }
    }
  }

  /**
   * Invalidate all keys matching a prefix (e.g. "course:python-internship")
   */
  async delPrefix(prefix: string): Promise<void> {
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        this.memoryCache.delete(key);
      }
    }

    if (this.redisUrl && this.redisToken) {
      try {
        const keysRes = await fetch(`${this.redisUrl}/keys/${encodeURIComponent(prefix)}*`, {
          headers: { Authorization: `Bearer ${this.redisToken}` },
        });
        if (keysRes.ok) {
          const json = await keysRes.json();
          const matchedKeys: string[] = json?.result || [];
          if (matchedKeys.length > 0) {
            await Promise.all(
              matchedKeys.map((k) =>
                fetch(`${this.redisUrl}/del/${encodeURIComponent(k)}`, {
                  headers: { Authorization: `Bearer ${this.redisToken}` },
                }),
              ),
            );
          }
        }
      } catch (err: any) {
        this.logger.warn(`Redis delPrefix failed for prefix "${prefix}": ${err?.message}`);
      }
    }
  }
}
