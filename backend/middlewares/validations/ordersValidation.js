const { query, param, body } = require("express-validator");

exports.POSTValidation = [];

// ===============================================

exports.deleteValidation = [
  param("id").isMongoId().withMessage("Invalid ObjectId"),
];
exports.IdValidation = [
  param("id").isMongoId().withMessage("Invalid ObjectId"),
];

exports.searchValidation = [
  query("search").isString().withMessage("search must be string"),
];
