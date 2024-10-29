import { CustomError } from "../helpers/errors"

export default () => {
  throw new CustomError("Route not found", 404)
}
