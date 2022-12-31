const mongoose = require("mongoose");


const ChatStructureSchema = new mongoose.Schema(
  {
 
   
    chatsWith: {
      type: [{
        userId:mongoose.Schema.ObjectId,
        name:String,
      }]
    },
    blockedContacts: {
      type: [String]
    },
    groupsIn: {
      type: [{
        groupId:mongoose.Schema.ObjectId,
        groupName:String,
      }]
    },
  
    createdAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
     
    },
  },

);



module.exports = mongoose.model("ChatStructure", ChatStructureSchema);
