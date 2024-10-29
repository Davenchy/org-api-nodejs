import type { NextFunction, Request, Response } from "express"
import { Middleware } from "../decorators/middleware"
import { UnauthorizedError } from "../helpers/errors"
import { validateToken } from "../helpers/tokens"
import type { IUserDocument } from "../models/user"

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument
    }
  }
}

export const AuthGuardMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authValue = req.header("Authorization")

  if (!authValue || !authValue.startsWith("Bearer"))
    return next(UnauthorizedError())

  try {
    const [_, token] = authValue.split(" ")
    const user = await validateToken(token)
    if (!user) return next(UnauthorizedError("invalid token"))

    req.user = user
  } catch (err) {
    return next(err)
  }

  next()
}

export const AuthGuard = Middleware(AuthGuardMiddleware)
