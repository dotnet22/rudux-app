/**
 * Enhanced TypeScript utilities for React Hook Form's useWatch
 *
 * This module provides a comprehensive set of type-safe watch functions
 * with better ergonomics and additional functionality.
 *
 * @example
 * ```typescript
 * import { useWatchField, useWatchBoolean, typedWatch } from 'src/utils/watch';
 *
 * // Direct usage (inside React components)
 * const email = useWatchField(control, 'user.email');
 * const isAdmin = useWatchBoolean(control, 'user.isAdmin');
 *
 * // Object-based usage (inside React components)
 * const email = typedWatch.field(control, 'user.email');
 * const isAdmin = typedWatch.boolean(control, 'user.isAdmin');
 * ```
 */

// Core functions
export { useWatchField, useWatchFields, useWatchForm } from './core';

// Utility functions
export {
  useWatchBatch, useWatchBoolean, useWatchConditional, useWatchDebounced, useWatchDefault, useWatchSelector,
  useWatchTransform
} from './utilities';

export type { PathArray } from './core';

// Import all functions for default export
import { useWatchField, useWatchFields, useWatchForm } from './core';
import {
  useWatchBatch,
  useWatchBoolean,
  useWatchConditional,
  useWatchDebounced,
  useWatchDefault,
  useWatchSelector,
  useWatchTransform,
} from './utilities';

/**
 * Organized utilities by use case
 * Provides a convenient object-based API for all watch functions
 */
export const typedWatch = {
  // === CORE FUNCTIONS ===
  /** Watch entire form */
  form: useWatchForm,
  /** Watch single field */
  field: useWatchField,
  /** Watch multiple fields */
  fields: useWatchFields,

  // === UTILITY FUNCTIONS ===
  /** Watch with transformation */
  transform: useWatchTransform,
  /** Watch with default value */
  withDefault: useWatchDefault,
  /** Watch as boolean */
  boolean: useWatchBoolean,
  /** Watch multiple with custom keys */
  batch: useWatchBatch,
  /** Watch conditionally */
  conditional: useWatchConditional,
  /** Watch with debouncing */
  debounced: useWatchDebounced,
  /** Watch with selector */
  selector: useWatchSelector,
} as const;
