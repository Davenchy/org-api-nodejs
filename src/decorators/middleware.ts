import type { NextFunction, Request, RequestHandler, Response } from "express"

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type RequestHandlerWithArgs<A extends any[]> = (...args: A) => RequestHandler

export const MiddlewareWithArgs =
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    <A extends any[]>(middleware: RequestHandlerWithArgs<A>) =>
    (...args: A) =>
    (_target: object, _key: string, desc: PropertyDescriptor) => {
      const original = desc.value
      desc.value = (req: Request, res: Response, next: NextFunction) =>
        middleware(...args)(req, res, (err) => {
          if (err) return next(err)
          original(req, res, next)
        })
    }

export const Middleware = (middleware: RequestHandler) =>
  MiddlewareWithArgs(() => middleware)
