import { useEffect, useRef } from 'react'
import type { FieldPath, FieldValues, UseFormSetValue } from 'react-hook-form'

/**
 * Configuration for cascading field relationships
 */
export interface CascadingFieldConfig<T extends FieldValues> {
  /** Parent field name */
  parent: FieldPath<T>
  /** Child fields that should be reset when parent changes */
  children: FieldPath<T>[]
}

/**
 * Hook for handling cascading field resets in forms.
 * When a parent field changes, automatically resets its dependent children.
 * 
 * @param control React Hook Form control
 * @param setValue React Hook Form setValue function
 * @param watchedValues Current form values (from useWatch)
 * @param cascadingFields Array of parent-child field relationships
 * 
 * @example
 * ```ts
 * const watchedValues = useWatchBatch(control, ['UniversityPK', 'FacultyPK', 'CoursePK'])
 * useCascadingFields(setValue, watchedValues, [
 *   { parent: 'UniversityPK', children: ['FacultyPK', 'CoursePK'] },
 *   { parent: 'FacultyPK', children: ['CoursePK'] }
 * ])
 * ```
 */
export const useCascadingFields = <T extends FieldValues>(
  setValue: UseFormSetValue<T>,
  watchedValues: Record<string, unknown>,
  cascadingFields: CascadingFieldConfig<T>[]
): void => {
  // Store previous values to detect changes
  const previousValuesRef = useRef<Record<string, unknown>>({})

  useEffect(() => {
    const currentValues = watchedValues
    const previousValues = previousValuesRef.current

    // Process each cascading relationship
    for (const { parent, children } of cascadingFields) {
      const parentValue = currentValues[parent]
      const previousParentValue = previousValues[parent]

      // If parent field changed and had a previous value, reset children
      if (parentValue !== previousParentValue && previousParentValue !== undefined) {
        children.forEach(child => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setValue(child, null as any) // Type assertion needed for React Hook Form's setValue
        })
      }
    }

    // Update previous values
    previousValuesRef.current = { ...currentValues }
  }, [setValue, watchedValues, cascadingFields])
}