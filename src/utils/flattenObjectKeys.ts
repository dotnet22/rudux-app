/**
 * Checks if a value is a nested object (not null and not an array).
 *
 * @param obj - The value to check
 * @returns True if the value is a nested object
 *
 * @internal
 */
const isNested = (obj: any) => typeof obj === "object" && obj !== null;

/**
 * Checks if a value is an array.
 *
 * @param obj - The value to check
 * @returns True if the value is an array
 *
 * @internal
 */
const isArray = (obj: any) => Array.isArray(obj);

/**
 * Recursively flattens an object into a flat structure with dot-notation keys.
 *
 * This utility function takes a nested object and converts it into a flat object
 * where nested properties are represented using dot notation. It handles both
 * nested objects and arrays, preserving all levels of the original structure
 * as separate keys in the result.
 *
 * @example
 * Basic object flattening:
 * ```tsx
 * const nested = {
 *   user: {
 *     name: 'John',
 *     address: {
 *       city: 'New York',
 *       zip: '10001'
 *     }
 *   }
 * };
 *
 * const flattened = flattenObjectKeys(nested);
 * // Result:
 * // {
 * //   'user': { name: 'John', address: { city: 'New York', zip: '10001' } },
 * //   'user.name': 'John',
 * //   'user.address': { city: 'New York', zip: '10001' },
 * //   'user.address.city': 'New York',
 * //   'user.address.zip': '10001'
 * // }
 * ```
 *
 * @example
 * Array handling:
 * ```tsx
 * const withArrays = {
 *   items: [
 *     { id: 1, name: 'Item 1' },
 *     { id: 2, name: 'Item 2' }
 *   ]
 * };
 *
 * const flattened = flattenObjectKeys(withArrays);
 * // Result includes:
 * // {
 * //   'items': [...],
 * //   'items.0': { id: 1, name: 'Item 1' },
 * //   'items.0.id': 1,
 * //   'items.0.name': 'Item 1',
 * //   'items.1': { id: 2, name: 'Item 2' },
 * //   'items.1.id': 2,
 * //   'items.1.name': 'Item 2'
 * // }
 * ```
 *
 * @param obj - The object to flatten
 * @param prefix - Internal parameter for building key paths (used in recursion)
 * @returns A flat object with dot-notation keys representing the original structure
 *
 * @public
 */
export const flattenObjectKeys = (obj: any, prefix = "") => {
  if (!isNested(obj)) {
    return {
      [prefix]: obj,
    };
  }

  return Object.keys(obj).reduce((acc, key) => {
    const currentPrefix = prefix.length ? `${prefix}.` : "";

    if (isNested(obj[key]) && Object.keys(obj[key]).length) {
      if (isArray(obj[key]) && obj[key].length) {
        obj[key].forEach((item: unknown[], index: number) => {
          Object.assign(
            acc,
            flattenObjectKeys(item, `${currentPrefix + key}.${index}`)
          );
        });
      } else {
        Object.assign(acc, flattenObjectKeys(obj[key], currentPrefix + key));
      }

      // Even if it's a nested object, it should be treated as a key as well
      acc[currentPrefix + key] = obj[key];
    } else {
      acc[currentPrefix + key] = obj[key];
    }

    return acc;
  }, {} as Record<string, unknown>);
};
