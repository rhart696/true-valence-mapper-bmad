/**
 * Input sanitization utilities for True Valence Mapper
 * Prevents XSS and ensures data integrity
 */

/**
 * Sanitize user input by removing dangerous characters and limiting length
 * @param input - Raw user input string
 * @param maxLength - Maximum allowed length (default: 100)
 * @returns Sanitized string safe for storage and rendering
 */
export function sanitizeInput(input: string, maxLength = 100): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets (prevents HTML injection)
    .replace(/["']/g, '') // Remove quotes (prevents attribute injection)
    .slice(0, maxLength)
}

/**
 * Sanitize notes/textarea content with higher length limit
 * @param notes - Raw notes content
 * @param maxLength - Maximum allowed length (default: 5000)
 * @returns Sanitized notes string
 */
export function sanitizeNotes(notes: string | undefined, maxLength = 5000): string {
  if (!notes || typeof notes !== 'string') {
    return ''
  }

  return notes
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, maxLength)
}

/**
 * Clamp a number to a specified range
 * @param value - Number to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}
