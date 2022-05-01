const mongoose = require("mongoose");

const ChatsSchema = new mongoose.Schema({
  chatBetween: {
    type: [String],
  },
  whoShouldSee: {
    type: [String],
  },
  senderId:mongoose.Schema.Types.ObjectId,
  receiverId:mongoose.Schema.Types.ObjectId,
 
  fileName:String,
  msg:{
    type: String,
    required: [true, 'Please add some text']
  },
  receiverName:String,
  senderName:String,
  msgType:{
    type:String,
    enum:["txt","file","image","video","audio"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});


module.exports = mongoose.model("Chats", ChatsSchema);
