import type { NextFunction, Request, Response } from "express"
import { ZodError } from "zod"
import { CustomError } from "../helpers/errors"
import { logger } from "../helpers/logger"

export const ErrorHandlerMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error(err)

  if (err instanceof ZodError) {
    res.status(400).json({ message: err.errors[0].message })
  } else if (err instanceof CustomError) {
    res.status(err.code).json({ message: err.message })
  } else {
    res.status(500).json({ message: "Internal Server Error" })
  }
}
