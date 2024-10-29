import type { NextFunction, Request, Response } from "express"
import type { ZodSchema } from "zod"

export const validate =
  (schema: ZodSchema, key = "payload") =>
  (req: Request, _: Response, next: NextFunction) => {
    const payload = schema.parse(req.body)
    // @ts-ignore
    req[key as string] = payload
    next()
  }
