export class ApiError extends Error {
  public statusCode: number;
  public success: boolean;
  public errors?: any;

  constructor(
    statusCode = 500,
    message: string,
    errors?: any
  ) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}