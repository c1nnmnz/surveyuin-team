import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind CSS classes with clsx
 * @param  {...any} inputs - Classes to merge
 * @returns {string} - Merged classes
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date using options
 * @param {Date|string|number} date - Date to format
 * @param {object} options - Format options
 * @returns {string} - Formatted date
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  return new Date(date).toLocaleDateString("id-ID", mergedOptions);
}

/**
 * Format a date as a relative time from now with simplified periods
 * @param {Date|string|number} date - Date to format
 * @returns {string} - Simplified relative time string
 * 
 * Formats:
 * - Less than 30 seconds: "Baru saja"
 * - Less than 5 minutes: "Beberapa menit yang lalu"
 * - Less than an hour: "Beberapa menit yang lalu" 
 * - Less than a day: "Beberapa jam yang lalu"
 * - Less than a week: "Beberapa hari yang lalu"
 * - Less than a month: "Beberapa minggu yang lalu"
 * - More than a month: "Beberapa bulan yang lalu"
 */
export function getRelativeTime(date) {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMilliseconds = now - targetDate;
  
  // Convert to seconds
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  
  // Less than 30 seconds
  if (diffInSeconds < 30) {
    return "Baru saja";
  }
  
  // Less than 5 minutes
  if (diffInSeconds < 300) {
    return "Beberapa menit yang lalu";
  }
  
  // Less than an hour
  if (diffInSeconds < 3600) {
    return "Beberapa menit yang lalu";
  }
  
  // Less than a day
  if (diffInSeconds < 86400) {
    return "Beberapa jam yang lalu";
  }
  
  // Less than a week
  if (diffInSeconds < 604800) {
    return "Beberapa hari yang lalu";
  }
  
  // Less than a month (30 days)
  if (diffInSeconds < 2592000) {
    return "Beberapa minggu yang lalu";
  }
  
  // Default - more than a month
  return "Beberapa bulan yang lalu";
}

/**
 * Generate a consistent color based on a string
 * @param {string} str - Input string
 * @returns {object} - Color object with primary, accent, soft, and veryLight colors
 */
export function generateColorFromString(str) {
  if (!str) return {
    primary: '#6366f1',
    accent: '#4f46e5',
    soft: '#f0f4ff',
    veryLight: '#fafbff'
  };
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Get a consistent hue between 0-360
  const hue = Math.abs(hash % 360);
  
  // Generate HSL colors with different saturation/lightness
  return {
    primary: `hsl(${hue}, 85%, 60%)`,
    accent: `hsl(${hue}, 85%, 50%)`,
    soft: `hsl(${hue}, 85%, 96%)`,
    veryLight: `hsl(${hue}, 60%, 98%)`
  };
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated text
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Format a number for display
 * @param {number} num - Number to format
 * @param {object} options - Format options
 * @returns {string} - Formatted number
 */
export function formatNumber(num, options = {}) {
  if (num === null || num === undefined) return '';
  
  const defaultOptions = {
    compact: false,
    decimals: 0,
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  if (mergedOptions.compact) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
  }
  
  return num.toLocaleString('id-ID', {
    minimumFractionDigits: mergedOptions.decimals,
    maximumFractionDigits: mergedOptions.decimals,
  });
}
