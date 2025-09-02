/**
 * Date formatting utilities
 */

/**
 * Format a date string to a human-readable date format
 * @param dateString - ISO date string or any valid date string
 * @returns Formatted date string (e.g., "January 15, 2023")
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Format a date string to a human-readable date and time format
 * @param dateString - ISO date string or any valid date string
 * @returns Formatted date and time string (e.g., "January 15, 2023 at 02:30 PM")
 */
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Convert a date string to a Date object for form inputs
 * @param dateString - ISO date string or any valid date string
 * @returns Date object or null if invalid
 */
export const formatDateForInput = (dateString: string): Date | null => {
  if (!dateString) return null
  try {
    return new Date(dateString)
  } catch {
    return null
  }
}

/**
 * Convert a Date object to ISO string for API submission
 * @param date - Date object to convert
 * @returns ISO string or empty string if null
 */
export const formatDateForSubmission = (date: Date | null): string => {
  if (!date) return ''
  return date.toISOString()
}