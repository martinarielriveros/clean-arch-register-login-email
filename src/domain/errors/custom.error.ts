export class CustomError extends Error {
  private constructor(
    public readonly statusCode: number,
    public readonly message: string
  ) // public readonly details?: any[]
  {
    super(message);
  }
  static badRequest(message: string): CustomError {
    return new CustomError(400, message);
  }
  static unAuthorized(message: string): CustomError {
    return new CustomError(401, message);
  }
  static forbidden(message: string): CustomError {
    return new CustomError(403, message);
  }
  static notFound(message: string): CustomError {
    return new CustomError(404, message);
  }
  static serverError(message: string): CustomError {
    return new CustomError(500, message);
  }
}
