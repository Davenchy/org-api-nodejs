import mongoose from "mongoose"

/**
 *  If `hexId` is a valid ObjectId value, returns `ObjectId` instance,
 *  otherwise `null`
 */
export const toObjectId = (hexId: string): mongoose.Types.ObjectId | null => {
  if (!mongoose.isValidObjectId(hexId)) return null
  return mongoose.mongo.ObjectId.createFromHexString(hexId)
}
