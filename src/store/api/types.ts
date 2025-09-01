export interface ApiResponse<TModel> {
  /**
   * The type or category of the response/error
   * @example "validation_error" | "server_error" | "success"
   */
  type?: string;
  /**
   * Human-readable title or summary of the response
   * @example "Validation Failed" | "User Created Successfully"
   */
  title?: string;
  /**
   * HTTP status code of the response
   * @example 200 | 400 | 500
   */
  status?: number;
  /**
   * Unique identifier for tracing/debugging the request
   * @example "abc123-def456-ghi789"
   */
  traceId?: string;
  /**
   * Field-specific validation errors
   */
  errors?: ValidationErrors;
  /**
   * Flag indicating if there are model validation errors
   */
  modelErrors?: boolean;
  /**
   * The actual response data/payload
   */
  apiData?: TModel;
}

export interface ValidationErrors {
  [field: string]:
  | string
  | string[]
  | boolean
  | { key: string; message: string };
}

export interface OperationResponse {
  id?: number;
  rowsAffected: number;
}