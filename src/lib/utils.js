import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

/**
 * Combine multiple class names with clsx and tailwind-merge
 * This helps prevent duplicate tailwind classes
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string into a human-readable format
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type ('relative', 'full', 'date', 'time')
 */
export function formatDate(date, format = 'relative') {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Check for invalid date
  if (isNaN(d.getTime())) {
    console.warn('Invalid date provided to formatDate:', date);
    return '';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - d) / 1000);
  
  // For relative time formatting
  if (format === 'relative') {
    if (diffInSeconds < 60) {
      return 'Baru saja';
    } else if (diffInSeconds < 3600) {
      return 'Beberapa menit yang lalu';
    } else if (diffInSeconds < 86400) {
      return 'Beberapa jam yang lalu';
    } else if (diffInSeconds < 604800) {
      return 'Beberapa hari yang lalu';
    } else if (diffInSeconds < 2592000) {
      return 'Beberapa minggu yang lalu';
    } else {
      // Format as date for older posts
      return formatDate(d, 'date');
    }
  }
  
  // For full date time
  if (format === 'full') {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return d.toLocaleDateString('id-ID', options);
  }
  
  // For date only
  if (format === 'date') {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return d.toLocaleDateString('id-ID', options);
  }
  
  // For time only
  if (format === 'time') {
    const options = { 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return d.toLocaleTimeString('id-ID', options);
  }
  
  return '';
}

/**
 * Get avatar fallback text (initials) from a name
 * @param {string} name - Full name
 * @returns {string} - Initials (1-2 characters)
 */
export function getAvatarFallback(name) {
  if (!name) return '';
  
  const parts = name.trim().split(' ');
  
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

/**
 * Get profile image path based on gender
 * @param {string} gender - 'male' or 'female'
 * @returns {string} - Path to the appropriate avatar image
 */
export function getProfileImagePath(gender = 'male') {
  if (gender.toLowerCase() === 'female') {
    return '/images/avatar-female.png';
  }
  return '/images/avatar-male.png';
}

/**
 * Sanitize HTML to prevent XSS attacks
 * @param {string} html - HTML string to sanitize
 * @returns {string} - Sanitized HTML
 */
export function sanitizeHtml(html) {
  if (!html) return '';
  
  // Simple sanitization, replace all tags
  return html.replace(/<[^>]*>?/gm, '');
}

/**
 * Truncate text to a specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated text
 */
export function truncateText(text, length = 100) {
  if (!text) return '';
  
  if (text.length <= length) {
    return text;
  }
  
  return text.substring(0, length).trim() + '...';
}

/**
 * Format a number with thousands separator
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
export function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Get a color based on a rating value
 * @param {number} rating - Rating value (1-5)
 * @returns {string} - CSS color class
 */
export function getRatingColor(rating) {
  if (!rating) return 'text-gray-400';
  
  rating = Number(rating);
  
  if (rating >= 4.5) return 'text-green-500';
  if (rating >= 3.5) return 'text-green-400';
  if (rating >= 2.5) return 'text-yellow-500';
  if (rating >= 1.5) return 'text-orange-500';
  return 'text-red-500';
}

/**
 * Generate a random ID
 * @returns {string} - Random ID
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Get sentiment based on rating
 * @param {number} rating - Rating value (1-5)
 * @returns {string} - Sentiment category
 */
export function getSentiment(rating) {
  if (!rating) return 'neutral';
  
  rating = Number(rating);
  
  if (rating >= 4) return 'positive';
  if (rating <= 2) return 'negative';
  return 'neutral';
}

/**
 * Get sentiment color based on sentiment value
 * @param {string} sentiment - Sentiment value ('positive', 'neutral', 'negative')
 * @returns {string} - CSS color class
 */
export function getSentimentColor(sentiment) {
  switch (sentiment?.toLowerCase()) {
    case 'positive':
      return 'text-green-500';
    case 'negative':
      return 'text-red-500';
    case 'neutral':
    default:
      return 'text-yellow-500';
  }
}
