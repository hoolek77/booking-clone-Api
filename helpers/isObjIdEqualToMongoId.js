const mongoose = require('mongoose')

exports.isObjIdEqualToMongoId = (objId, mongoId) => {
    return objId.equals(mongoose.Types.ObjectId(mongoId))
}