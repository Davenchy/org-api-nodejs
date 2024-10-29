export class CustomError extends Error {
  constructor(
    message: string,
    public code: number,
  ) {
    super(message)
  }
}

export const ConflictError = (message?: string) =>
  new CustomError(message || "conflict", 409)

export const UnauthorizedError = (message?: string) =>
  new CustomError(message || "unauthorized", 401)

export const ForbiddenError = (message?: string) =>
  new CustomError(message || "forbidden", 403)

export const InvalidArgumentError = (message?: string) =>
  new CustomError(message || "invalid argument", 400)

export const NotFoundError = (message?: string) =>
  new CustomError(message || "not found", 404)
