export interface ExceptionResponse {
  message: string;
  errors?: Record<string, unknown> | Array<unknown>;
}

export interface ExceptionResponseDetail extends ExceptionResponse {
  statusCode: string;
  title: string;
  data?: Record<string, unknown> | Array<unknown>;
}

export interface WsExceptionResponse<T> extends ExceptionResponse {
  statusCode: string;
  title: string;
  data: T;
}
