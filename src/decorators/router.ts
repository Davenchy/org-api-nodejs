import "reflect-metadata"
import { join } from "node:path"
import type { Express, RequestHandler } from "express"

const baseRouteSymbol = Symbol()
const routeHandlersSymbol = Symbol()

type RouteHandlers = Map<string, Map<keyof Express, RequestHandler[]>>

export const Controller = (path = "") => {
  // biome-ignore lint/complexity/noBannedTypes:
  return (target: Function) => {
    Reflect.defineMetadata(baseRouteSymbol, path, target)
    Reflect.defineMetadata(routeHandlersSymbol, new Map(), target)
  }
}

export const Route = (
  method: keyof Express | (keyof Express)[],
  path = "",
  ...middlewares: RequestHandler[]
) => {
  return (target: object, _key: string, _desc: PropertyDescriptor) => {
    const handlers: RouteHandlers =
      Reflect.getOwnMetadata(routeHandlersSymbol, target) || new Map()

    const pathHandlers = handlers.get(path) || new Map()

    const methods: (keyof Express)[] = Array.isArray(method) ? method : [method]

    for (const method of methods) {
      middlewares.push(_desc.value)
      pathHandlers.set(method, middlewares)
    }

    handlers.set(path, pathHandlers)

    Reflect.defineMetadata(routeHandlersSymbol, handlers, target)
  }
}

export const GET = (path = "", ...middlewares: RequestHandler[]) =>
  Route("get", path, ...middlewares)
export const POST = (path = "", ...middlewares: RequestHandler[]) =>
  Route("post", path, ...middlewares)
export const PUT = (path = "", ...middlewares: RequestHandler[]) =>
  Route("put", path, ...middlewares)
export const DELETE = (path = "", ...middlewares: RequestHandler[]) =>
  Route("delete", path, ...middlewares)

// biome-ignore lint/suspicious/noExplicitAny:
export const useController = (controller: any, app: Express) => {
  if (!Reflect.hasOwnMetadata(baseRouteSymbol, controller)) {
    throw new Error("Controller must be a class decorated with @Controller()")
  }

  const base = Reflect.getOwnMetadata(baseRouteSymbol, controller) || ""
  const handlers: RouteHandlers =
    Reflect.getOwnMetadata(routeHandlersSymbol, controller.prototype) ||
    new Map()

  for (const path of handlers.keys()) {
    const pathHandlers: Map<keyof Express, RequestHandler[]> =
      handlers.get(path) || new Map()

    for (const method of pathHandlers.keys()) {
      const handlers = pathHandlers.get(method as keyof Express) || []
      app[method](join("/", base, path), ...handlers)
    }
  }
}
