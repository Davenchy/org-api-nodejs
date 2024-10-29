import { JsonWebTokenError, sign, verify } from "jsonwebtoken"
import {
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_SECRET,
} from "../config"
import User from "../models/user"
import type { IUserDocument } from "../models/user"
import { logger } from "./logger"

const registery: Map<string, string> = new Map()

export type TokenPayload = { userId: string }

export const generateTokens = (user: IUserDocument) => {
  const userId = user._id.toHexString()

  logger.debug("generating tokens", { email: user.email })

  // generate tokens
  const refreshToken = sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  })
  const token = sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })

  // register the refresh token as a session
  registery.set(userId, refreshToken)

  return { token, refresh_token: refreshToken }
}

/**
 *  If token is valid, returns user id object
 */
export const validateToken = async (
  token: string,
): Promise<IUserDocument | null> => {
  try {
    logger.debug("validating token", { token })

    // verify token
    const { userId }: TokenPayload = verify(token, JWT_SECRET) as never

    // make sure session is registered
    if (!registery.has(userId)) return null

    // return user id
    return User.findByHexId(userId)
  } catch (err) {
    if (err instanceof JsonWebTokenError) logger.error(err)
    return null
  }
}

export const validateRefreshToken = async (
  refreshToken: string,
): Promise<IUserDocument | null> => {
  try {
    logger.debug("validating refresh token", { refreshToken })

    // validate token
    const { userId }: TokenPayload = verify(
      refreshToken,
      JWT_REFRESH_SECRET,
    ) as never

    // make sure registered
    if (!registery.has(userId)) return null

    return User.findByHexId(userId)
  } catch (err) {
    if (err instanceof JsonWebTokenError) logger.error(err)
    return null
  }
}
