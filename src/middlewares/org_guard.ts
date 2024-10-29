import type { NextFunction, Request, RequestHandler, Response } from "express"
import { MiddlewareWithArgs } from "../decorators/middleware"
import { ForbiddenError, NotFoundError } from "../helpers/errors"
import { toObjectId } from "../helpers/object_id"
import Org from "../models/organization"
import type { IOrgDocument } from "../models/organization"
import type { IOrgMember, MemberAccessLevel } from "../types/organizations"

declare global {
  namespace Express {
    interface Request {
      org?: IOrgDocument
    }
  }
}

export const OrgGuardMiddleware =
  (accessLevel?: MemberAccessLevel) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user
    if (!user) throw new Error("Add OrgGuard after AuthGuard middleware")

    const { organization_id } = req.params

    const objectId = toObjectId(organization_id)
    if (!objectId) return next(NotFoundError("organization is not found"))

    const org = await Org.findById(objectId)
    if (!org) return next(NotFoundError("organization is not found"))

    const member = org.organization_members.find(
      (m: IOrgMember) => m.email === user.email,
    )
    if (!member) return next(NotFoundError("organization is not found"))

    if (accessLevel && member.access_level !== accessLevel)
      return next(ForbiddenError("no access"))

    req.org = org

    next()
  }

export const OrgGuard = MiddlewareWithArgs(OrgGuardMiddleware)
