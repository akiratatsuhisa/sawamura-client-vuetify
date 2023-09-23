export interface IExceptionResponse {
  message: string;
  params?: Record<string, unknown> | Array<unknown>;
  errors?: Record<string, unknown> | Array<unknown>;
}

export interface IExceptionResponseDetail extends IExceptionResponse {
  statusCode: string;
  title: string;
  data?: Record<string, unknown> | Array<unknown>;
}

export interface IWsExceptionResponse<T> extends IExceptionResponse {
  statusCode: string;
  title: string;
  data: T;
}
