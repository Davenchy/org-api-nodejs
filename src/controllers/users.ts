import type { NextFunction, Response } from "express"
import { Controller, POST } from "../decorators/router"
import type { PRequest } from "../decorators/validate"
import { Validate } from "../decorators/validate"
import { ConflictError, UnauthorizedError } from "../helpers/errors"
import { logger } from "../helpers/logger"
import { generateTokens, validateRefreshToken } from "../helpers/tokens"
import User from "../models/user"
import type { IRefreshToken, ISignin, ISignup } from "../types/users"
import { RefreshTokenSchema, SigninSchema, SignupSchema } from "../types/users"

@Controller()
export default class UsersController {
  @POST("/signup")
  @Validate(SignupSchema)
  async signup(req: PRequest<ISignup>, res: Response, next: NextFunction) {
    const { payload } = req

    // is email taken
    if (await User.isEmailTaken(payload.email))
      return next(ConflictError("email already exists"))

    // create a new user
    const user = new User(req.payload)
    try {
      await user.save()
    } catch (err) {
      logger.error(err)
      return next(err)
    }

    logger.info(`new user registered: ${user.email}`)
    res.status(201).json({ message: "user created" })
  }

  @POST("/signin")
  @Validate(SigninSchema)
  async signin(req: PRequest<ISignin>, res: Response, next: NextFunction) {
    const { email, password } = req.payload

    // is user exists?
    const user = await User.findOne({ email })
    if (!user) return next(UnauthorizedError("Invalid credentials"))

    // is password valid/correct?
    if (!(await user.validatePassword(password)))
      return next(UnauthorizedError("Invalid credentials"))

    // generate tokens
    const tokens = generateTokens(user)

    res.json({ message: "signed in", ...tokens })
  }

  @POST("/refresh-token")
  @Validate(RefreshTokenSchema)
  async refreshToken(
    req: PRequest<IRefreshToken>,
    res: Response,
    next: NextFunction,
  ) {
    const { refresh_token } = req.payload

    // validate refresh token
    const user = await validateRefreshToken(refresh_token)
    if (!user) return next(UnauthorizedError("Invalid refresh token"))

    // generate new tokens
    const tokens = generateTokens(user)

    res.json({ message: "token refreshed", ...tokens })
  }
}
