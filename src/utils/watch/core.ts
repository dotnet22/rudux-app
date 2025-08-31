import type {
  Control,
  DeepPartialSkipArrayKey,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import { useWatch } from "react-hook-form";

/**
 * Core watch functions for React Hook Form
 * These are the primary building blocks for form watching
 */

/**
 * Utility type to ensure array elements are all Path<T>
 */
export type PathArray<T extends FieldValues> = ReadonlyArray<Path<T>>;

/**
 * Hook to watch entire form - returns all form values
 */
export const useWatchForm = <TFieldValues extends FieldValues>(
  control: Control<TFieldValues>
): DeepPartialSkipArrayKey<TFieldValues> => useWatch({ control });

/**
 * Hook to watch single field by path - supports any nested path
 */
export const useWatchField = <
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
>(
  control: Control<TFieldValues>,
  name: TName
): PathValue<TFieldValues, TName> => useWatch({ control, name });

/**
 * Hook to watch multiple fields by paths - returns array of values
 */
export const useWatchFields = <
  TFieldValues extends FieldValues,
  TNames extends ReadonlyArray<Path<TFieldValues>>
>(
  control: Control<TFieldValues>,
  names: TNames
): Array<PathValue<TFieldValues, TNames[number]>> => useWatch({ control, name: names }) as Array<PathValue<TFieldValues, TNames[number]>>;
