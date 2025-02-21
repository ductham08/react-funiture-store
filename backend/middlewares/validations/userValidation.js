const {query,param,body}=require("express-validator");

exports.updateValidation=[]
exports.deleteValidation=[
    param("id").isMongoId().withMessage('Invalid ObjectId'),
]

exports.idValidation=[
    param("id").isMongoId().withMessage('Invalid ObjectId'),
]
exports.searchValidation=[
    query("search").isString().withMessage("search must be string"),
]




