import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function openWhatsApp(phoneNumber: string, message: string) {
  try {
    let cleanedNumber = phoneNumber.trim().replace(/\D/g, '');
    if (cleanedNumber.startsWith('0')) {
      cleanedNumber = '254' + cleanedNumber.substring(1);
    }
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${cleanedNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  } catch (error) {
    console.error('Failed to open WhatsApp:', error);
  }
}
