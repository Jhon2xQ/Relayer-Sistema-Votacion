/**
 * Formato estandarizado de respuesta de la API
 */
export interface ApiResponse<T = any> {
  /** Indica si la operación fue exitosa */
  success: boolean;
  /** Mensaje descriptivo de la operación */
  message: string;
  /** Datos de la respuesta (null en caso de error) */
  data: T | null;
  /** Timestamp en milisegundos de cuando se generó la respuesta */
  timestamp: number;
}

/**
 * Respuesta exitosa de la API
 */
export interface ApiSuccessResponse<T = any> extends ApiResponse<T> {
  success: true;
  data: T;
}

/**
 * Respuesta de error de la API
 */
export interface ApiErrorResponse extends ApiResponse<null> {
  success: false;
  data: null;
}
