/**
 * Type definition for server validation errors structure.
 *
 * This type represents the format of validation errors returned from server APIs.
 * It supports multiple error formats for each field, allowing flexibility in how
 * validation errors are communicated and processed.
 *
 * @example
 * String error messages:
 * ```tsx
 * const errors: ValidationErrors = {
 *   email: 'Email is required',
 *   username: 'Username must be unique'
 * };
 * ```
 *
 * @example
 * Array of error messages:
 * ```tsx
 * const errors: ValidationErrors = {
 *   password: [
 *     'Password must be at least 8 characters',
 *     'Password must contain at least one number',
 *     'Password must contain at least one special character'
 *   ]
 * };
 * ```
 *
 * @example
 * Boolean flags for validation state:
 * ```tsx
 * const errors: ValidationErrors = {
 *   termsAccepted: false, // Field is invalid
 *   emailVerified: true   // Field has an error
 * };
 * ```
 *
 * @example
 * Structured error objects:
 * ```tsx
 * const errors: ValidationErrors = {
 *   dateOfBirth: {
 *     key: 'DATE_INVALID',
 *     message: 'Date of birth must be in the past'
 *   }
 * };
 * ```
 *
 * @public
 */
export interface ValidationErrors {
  [field: string]:
  | string
  | string[]
  | boolean
  | { key: string; message: string };
}
