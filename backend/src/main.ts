import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // Cookies
  app.use(cookieParser());

  // CORS
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        frontendUrl,
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://dev-ascent-academy.vercel.app',
        'https://www.devascentacademy.me',
        'https://devascentacademy.me',
      ];

      // Secure strict matching: official domains and development origins only
      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin === 'https://devascentacademy.me' ||
        /^https:\/\/([a-zA-Z0-9-]+\.)?devascentacademy\.me$/.test(origin) ||
        (process.env.NODE_ENV !== 'production' &&
          (origin.startsWith('http://localhost:') ||
            origin.startsWith('http://127.0.0.1:') ||
            origin.startsWith('http://192.168.') ||
            origin.startsWith('http://10.')));

      if (isAllowed) {
        return callback(null, true);
      }

      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-razorpay-signature'],
  });

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Global Pipes & Interceptors
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Health check endpoint with database keep-alive ping
  const httpAdapter = app.getHttpAdapter();
  const prisma = app.get(PrismaService);
  httpAdapter.get('/api/v1/health', async (req: any, res: any) => {
    try {
      const start = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      const latencyMs = Date.now() - start;
      res.json({
        success: true,
        data: {
          status: 'ok',
          database: 'connected',
          latencyMs,
          timestamp: new Date().toISOString(),
          uptimeSeconds: Math.round(process.uptime()),
        },
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        data: {
          status: 'degraded',
          database: 'disconnected',
          error: err?.message || 'Database ping failed',
          timestamp: new Date().toISOString(),
        },
      });
    }
  });

  const port = parseInt(process.env.PORT || '3001', 10);
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 DevAscent Backend API is running on port ${port}/api/v1`);
}

bootstrap();
