import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStringDate(date: Date): string {
  return date.toISOString();
}

export function getInitials(name: string): string {
  if (!name) return "X";

  const prepositions = ["de", "da", "do", "dos", "das", "e"];

  const parts = name
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(
      part => part && !prepositions.includes(part)
    );

  if (parts.length === 0) return "";

  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  const firstInitial = parts[0][0];
  const lastInitial = parts[parts.length - 1][0];

  return (firstInitial + lastInitial).toUpperCase();
}

