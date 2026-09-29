import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function isDirectVideoUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const clean = url.split('?')[0].toLowerCase();
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.ogg') ||
    clean.endsWith('.mov') ||
    clean.includes('res.cloudinary.com') ||
    clean.includes('/video/upload/')
  );
}

export function getEmbedUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Already an embed URL
  if (trimmed.includes('youtube.com/embed/')) {
    return trimmed;
  }

  // Check for YouTube standard, shortened, or shorts URLs
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([^&?#/]+)/);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    const timeMatch = trimmed.match(/[?&]t=(\d+)/);
    const startParam = timeMatch ? `?start=${timeMatch[1]}` : '';
    return `https://www.youtube.com/embed/${videoId}${startParam}`;
  }

  // Pass-through for generic video or custom hostings (e.g., Cloudinary, Loom, Vimeo)
  return trimmed;
}
