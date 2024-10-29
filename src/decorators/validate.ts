import type { NextFunction, Request, RequestHandler, Response } from "express"
import type { ZodSchema } from "zod"
import { validate } from "../middlewares/validate"

export type PRequest<P> = Request & { payload: P }

export const Validate =
  (schema: ZodSchema, payloadKey = "payload") =>
  (_target: object, _key: string, desc: PropertyDescriptor) => {
    const handler: RequestHandler = desc.value
    desc.value = (req: Request, res: Response, next: NextFunction) => {
      validate(schema, payloadKey)(req, res, () => handler(req, res, next))
    }
  }
