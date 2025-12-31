import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// This wrapper solves the "Last Class Wins" problem in Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
