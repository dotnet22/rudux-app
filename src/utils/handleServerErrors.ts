import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { flattenObjectKeys } from "./flattenObjectKeys";
import type { ValidationErrors } from "../types/ValidationErrors";



/**
 * Configuration options for the handleServerErrors function.
 *
 * @template TFieldValues - The form values type
 *
 * @public
 */
interface HandleServerErrorsType<TFieldValues extends FieldValues = FieldValues> {
  /**
   * Server validation errors object containing field-specific error messages
   * @example { email: 'Email is already taken', password: ['Too short', 'Must contain numbers'] }
   */
  errors?: ValidationErrors;
  /**
   * The setError function from react-hook-form for setting field errors
   */
  setError: UseFormSetError<TFieldValues>;
}

/**
 * Processes server validation errors and applies them to react-hook-form fields.
 *
 * This utility function takes validation errors from a server response and automatically
 * applies them to the corresponding form fields using react-hook-form's setError function.
 * It supports various error formats including strings, arrays of strings, and boolean flags.
 *
 * The function uses object flattening to handle nested error structures and ensures
 * that only valid field paths are processed.
 *
 * @example
 * Basic usage with server response:
 * ```tsx
 * const { setError } = useForm();
 *
 * try {
 *   await submitForm(data);
 * } catch (error) {
 *   handleServerErrors({
 *     errors: error.response.data.errors,
 *     setError
 *   });
 * }
 * ```
 *
 * @example
 * With different error formats:
 * ```tsx
 * const serverErrors = {
 *   email: 'Email is already taken',
 *   password: ['Too short', 'Must contain numbers'],
 *   terms: true // Boolean flag indicating invalid
 * };
 *
 * handleServerErrors({ errors: serverErrors, setError });
 * // Results in:
 * // - email field shows: "Email is already taken"
 * // - password field shows: "Too short Must contain numbers"
 * // - terms field shows: "Field is not valid."
 * ```
 *
 * @template TFieldValues - The form values type
 *
 * @param args - Configuration object containing errors and setError function
 *
 * @public
 */
export const handleServerErrors = function handleServerErrors<
  TFieldValues extends FieldValues = FieldValues
>(args: HandleServerErrorsType<TFieldValues>) {
  const { errors, setError } = args;

  for (const key in errors) {
    const isKeyInVariables = Object.keys(flattenObjectKeys(errors)).includes(
      key
    );

    if (!isKeyInVariables) {
      continue;
    }

    const fieldError = errors[key];

    let errorMessage = "";

    if (Array.isArray(fieldError)) {
      errorMessage = fieldError.join(" ");
    }

    if (typeof fieldError === "string") {
      errorMessage = fieldError;
    }

    if (typeof fieldError === "boolean" && fieldError) {
      errorMessage = "Field is not valid.";
    }

    setError(key as Path<TFieldValues>, {
      message: errorMessage,
    });
  }
};
