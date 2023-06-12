const ObjectId = require('mongoose').Types.ObjectId;
//checks if id is a valid mongoose object id
exports.isValidObjectId = (id)=>{
    if(ObjectId.isValid(id)){
        if((String)(new ObjectId(id)===id)){
            return true
        }
        return false
    }
    return false
}