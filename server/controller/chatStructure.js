const path = require("path");
const ChatStructure = require("../models/ChatStructure");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncMiddleware");


exports.blockContact = asyncHandler(async (req, res, next) => {

const filter ={user:req.user.id};
  const chatStructure = await ChatStructure.updateOne(filter,
    {"$push" : {"blockedContacts":req.params.id}}
    )

  
  res.status(200).json({
    success: true,
    data: chatStructure
  });

});
exports.unBlockContact = asyncHandler(async (req, res, next) => {

const filter ={user:req.user.id};
  const chatStructure = await ChatStructure
  .updateOne(filter,
    {"$pull" : {"blockedContacts":req.params.id}})

  
  res.status(200).json({
    success: true,
    data: chatStructure
  });

});


