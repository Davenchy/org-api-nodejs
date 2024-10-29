/**
 * Responses with a status code and a json body that have the message
 */
export class CustomError extends Error {
  constructor(
    message: string,
    public code: number,
  ) {
    super(message)
  }
}

/**
 * Response with status 409 and a message
 */
export const ConflictError = (message?: string) =>
  new CustomError(message || "conflict", 409)

/**
 * Response with status 401 and a message
 */
export const UnauthorizedError = (message?: string) =>
  new CustomError(message || "unauthorized", 401)

/**
 * Response with status 403 and a message
 */
export const ForbiddenError = (message?: string) =>
  new CustomError(message || "forbidden", 403)

/**
 * Response with status 400 and a message
 */
export const InvalidArgumentError = (message?: string) =>
  new CustomError(message || "invalid argument", 400)

/**
 * Response with status 404 and a message
 */
export const NotFoundError = (message?: string) =>
  new CustomError(message || "not found", 404)
