import { useEffect, useMemo, useState } from "react";
import type {
  Control,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import { useWatch } from "react-hook-form";

/**
 * Utility watch functions for React Hook Form
 * Enhanced functionality for specific use cases
 */

/**
 * Watch field with transformation/selector
 */
export const useWatchTransform = <
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
  TOutput
>(
  control: Control<TFieldValues>,
  name: TName,
  transform: (value: PathValue<TFieldValues, TName>) => TOutput
): TOutput => {
  const value = useWatch({ control, name });

  return useMemo(() => transform(value), [value, transform]);
};

/**
 * Watch field with default fallback value
 */
export const useWatchDefault = <
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
>(
  control: Control<TFieldValues>,
  name: TName,
  defaultValue: PathValue<TFieldValues, TName>
): PathValue<TFieldValues, TName> => {
  const value = useWatch({ control, name });

  return value ?? defaultValue;
};

/**
 * Watch field as boolean with guaranteed boolean return
 */
export const useWatchBoolean = <
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
>(
  control: Control<TFieldValues>,
  name: TName,
  defaultValue = false
): boolean => {
  const value = useWatch({ control, name });

  return Boolean(value ?? defaultValue);
};

/**
 * Watch multiple fields and return an object with field paths as keys
 */
export const useWatchBatch = <
  TFieldValues extends FieldValues,
  TFields extends ReadonlyArray<Path<TFieldValues>>
>(
  control: Control<TFieldValues>,
  fields: TFields
): { [K in TFields[number]]: PathValue<TFieldValues, K> } => {
  const values = useWatch({ control, name: fields });

  return useMemo(() => {
    const result = {} as { [K in TFields[number]]: PathValue<TFieldValues, K> };

    fields.forEach((field, index) => {
      result[field as TFields[number]] = values[index];
    });

    return result;
  }, [values, fields]);
};

/**
 * Watch field conditionally based on boolean flag
 */
export const useWatchConditional = <
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
>(
  control: Control<TFieldValues>,
  name: TName,
  shouldWatch: boolean,
  fallback?: PathValue<TFieldValues, TName>
): PathValue<TFieldValues, TName> | undefined => {
  const activeValue = useWatch({
    control,
    name,
    disabled: !shouldWatch
  });

  return shouldWatch ? activeValue : fallback;
};

/**
 * Watch field with debounced updates
 */
export const useWatchDebounced = <
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
>(
  control: Control<TFieldValues>,
  name: TName,
  delay = 300
): PathValue<TFieldValues, TName> => {
  const value = useWatch({ control, name });
  const [debouncedValue, setDebouncedValue] = useState<PathValue<TFieldValues, TName>>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Watch field with memoized selector function
 */
export const useWatchSelector = <
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
  TOutput
>(
  control: Control<TFieldValues>,
  name: TName,
  selector: (value: PathValue<TFieldValues, TName>) => TOutput,
  deps: React.DependencyList = []
): TOutput => {
  const value = useWatch({ control, name });

  return useMemo(
    () => selector(value),
    [value, selector, ...deps] // eslint-disable-line react-hooks/exhaustive-deps
  );
};
