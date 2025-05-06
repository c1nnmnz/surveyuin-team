/**
 * Utility functions for date handling and formatting across the application
 */

/**
 * Format a date as a readable string
 * @param {string|Date} date - Date to format
 * @param {Object} options - Formatting options
 * @param {string} options.locale - Locale to use (default: 'id-ID')
 * @param {boolean} options.includeTime - Whether to include the time (default: false)
 * @param {boolean} options.useRelative - Whether to use relative formatting (default: false)
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, { 
  locale = 'id-ID', 
  includeTime = false,
  useRelative = false
} = {}) => {
  // Handle null or undefined dates
  if (!date) return 'Tanggal tidak tersedia';
  
  // Parse the date
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return 'Tanggal tidak valid';
  
  // If using relative formatting
  if (useRelative) {
    return formatRelativeDate(dateObj);
  }
  
  const dateOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  };
  
  // Add time if requested
  if (includeTime) {
    dateOptions.hour = '2-digit';
    dateOptions.minute = '2-digit';
  }
  
  return dateObj.toLocaleDateString(locale, dateOptions);
};

/**
 * Format a date in a short format (e.g., "7 Mei 2023")
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale to use (default: 'id-ID')
 * @returns {string} - Formatted date string
 */
export const formatShortDate = (date, locale = 'id-ID') => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '-';
  
  return dateObj.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short'
  });
};

/**
 * Format a date as a relative time
 * @param {string|Date} date - Date to format
 * @returns {string} - Relative date string
 */
export const formatRelativeDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  const now = new Date();
  const diffMs = now - dateObj;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffMonth / 12);
  
  // Within the last minute
  if (diffSec < 60) {
    return 'Baru saja';
  }
  
  // Within the last hour
  if (diffMin < 60) {
    return `${diffMin} menit yang lalu`;
  }
  
  // Within the last day
  if (diffHour < 24) {
    return `${diffHour} jam yang lalu`;
  }
  
  // Within the last month
  if (diffDay < 30) {
    return `${diffDay} hari yang lalu`;
  }
  
  // Within the last year
  if (diffMonth < 12) {
    return `${diffMonth} bulan yang lalu`;
  }
  
  // Over a year ago
  return `${diffYear} tahun yang lalu`;
};

/**
 * Format a time range between two dates
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date 
 * @param {string} locale - Locale to use (default: 'id-ID')
 * @returns {string} - Formatted time range
 */
export const formatTimeRange = (startDate, endDate, locale = 'id-ID') => {
  if (!startDate || !endDate) return 'Rentang waktu tidak tersedia';
  
  const startObj = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const endObj = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  if (isNaN(startObj.getTime()) || isNaN(endObj.getTime())) {
    return 'Rentang waktu tidak valid';
  }
  
  // If dates are on the same day
  const sameDay = startObj.toDateString() === endObj.toDateString();
  
  if (sameDay) {
    const dateStr = startObj.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    const startTimeStr = startObj.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const endTimeStr = endObj.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `${dateStr}, ${startTimeStr} - ${endTimeStr}`;
  } else {
    // Different days
    const startStr = formatDate(startObj, { locale, includeTime: true });
    const endStr = formatDate(endObj, { locale, includeTime: true });
    
    return `${startStr} - ${endStr}`;
  }
};

/**
 * Get the start and end dates for a time period
 * @param {string} period - Time period ('day', 'week', 'month', 'year')
 * @param {Date} referenceDate - Reference date (default: current date)
 * @returns {Object} - Object with start and end dates
 */
export const getDateRange = (period, referenceDate = new Date()) => {
  const now = new Date(referenceDate);
  let start = new Date(now);
  let end = new Date(now);
  
  switch (period) {
    case 'day':
      // Just use the current date
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
      
    case 'week':
      // Start from previous Sunday (or Monday if using Monday as first day)
      const day = start.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
      start = new Date(start.setDate(diff));
      start.setHours(0, 0, 0, 0);
      
      // End on Sunday
      end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
      
    case 'month':
      // Start from first day of month
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      
      // End on last day of month
      end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
      
    case 'year':
      // Start from first day of year
      start = new Date(start.getFullYear(), 0, 1);
      start.setHours(0, 0, 0, 0);
      
      // End on last day of year
      end = new Date(start.getFullYear(), 11, 31);
      end.setHours(23, 59, 59, 999);
      break;
      
    default:
      throw new Error(`Invalid period: ${period}`);
  }
  
  return { start, end };
};

/**
 * Get a list of months for display in dropdowns
 * @param {string} locale - Locale to use (default: 'id-ID')
 * @returns {Array} - Array of month objects with id and name properties
 */
export const getMonthsList = (locale = 'id-ID') => {
  const months = [];
  const baseDate = new Date(2000, 0, 1); // Use a fixed year to get month names
  
  for (let i = 0; i < 12; i++) {
    const month = new Date(baseDate);
    month.setMonth(i);
    
    months.push({
      id: i,
      name: month.toLocaleDateString(locale, { month: 'long' })
    });
  }
  
  return months;
};

/**
 * Get list of years for range selection
 * @param {number} startYear - Start year (default: 5 years ago)
 * @param {number} endYear - End year (default: current year)
 * @returns {Array} - Array of year objects with id and name properties
 */
export const getYearsList = (startYear = new Date().getFullYear() - 5, endYear = new Date().getFullYear()) => {
  const years = [];
  
  for (let year = startYear; year <= endYear; year++) {
    years.push({
      id: year,
      name: year.toString()
    });
  }
  
  return years;
}; 