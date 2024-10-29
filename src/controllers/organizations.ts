import type { Request, Response } from "express"
import { Controller, DELETE, GET, POST, PUT } from "../decorators/router"
import { Validate } from "../decorators/validate"
import { AuthGuard } from "../middlewares/auth_guard"
import { OrgGuard } from "../middlewares/org_guard"
import { OrgInviteSchema, OrgPayloadSchema } from "../types/organizations"

@Controller("/organization")
export default class OrganizationsController {
  @GET()
  getAll(_req: Request, res: Response) {
    res.json({ message: "all organizations" })
  }

  @GET("/:organization_id")
  @AuthGuard()
  @OrgGuard()
  getOne() {}

  @POST()
  @AuthGuard()
  @Validate(OrgPayloadSchema)
  create() {}

  @PUT("/:organization_id")
  @AuthGuard()
  @OrgGuard("admin")
  @Validate(OrgPayloadSchema)
  update() {}

  @DELETE("/:organization_id")
  @AuthGuard()
  @OrgGuard("admin")
  delete() {}

  @POST("/:organization_id/invite")
  @AuthGuard()
  @OrgGuard("admin")
  @Validate(OrgInviteSchema)
  invite() {}
}
