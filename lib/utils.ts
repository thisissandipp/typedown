import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLastUpdatedTimestamp(utcTimestamp: string | Date): string {
  const date = new Date(utcTimestamp);
  const now = new Date();

  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);

  if (seconds < 60) {
    return 'Updated now';
  } else if (minutes < 60) {
    return `Updated ${minutes}m ago`;
  } else if (hours < 24) {
    return `Updated ${hours}h ago`;
  } else {
    return `Updated on ${date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })}`;
  }
}
