const Chats = require("../models/Chats");
const User = require("../models/User");
const ChatStructure = require("../models/ChatStructure");
const path = require("path");
const asyncHandler = require("../middleware/asyncMiddleware");
const ErrorResponse = require("../utils/errorResponse");
const fs = require("fs");

exports.getChats = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.postChat = asyncHandler(async (req, res, next) => {
  const filter1 = { user: req.user.id };
  const filter2 = { user: req.body.receiverId };

  const chatStructure1 = await ChatStructure.findOne(filter1);
  const chatStructure2 = await ChatStructure.findOne(filter2);

  if (
    chatStructure1.blockedContacts.includes(req.body.receiverId) ||
    chatStructure2.blockedContacts.includes(req.user.id)
  ) {
    return next(
      new ErrorResponse(
        `User is blocked from sending or receiving any message from this receiver`,
        400
      )
    );
  }

  const isInChatWith = await ChatStructure.findOne({
    user: req.user.id,
    "chatsWith.userId": req.body.receiverId,
  });

  if (!isInChatWith) {
    const update1 = {
      userId: req.body.receiverId,
      name: req.body.receiverName,
    };
    const update2 = { userId: req.user.id, name: req.body.senderName };

    chatStructure1.chatsWith.push(update1);
    chatStructure2.chatsWith.push(update2);
    await chatStructure1.save();
    await chatStructure2.save();
  }

  const chats = await Chats.create(req.body);

  res.status(200).json({
    success: true,
    data: chats,
  });
});

exports.firstLoadWithUser = asyncHandler(async (req, res, next) => {
  const filter1 = { user: req.user.id };
  const filter2 = { user: req.params.receiverId };

  const chatStructure1 = await ChatStructure.findOne(filter1);
  const chatStructure2 = await ChatStructure.findOne(filter2);
  let msg = {
    youBlocked: false,
    receiverBlocked: false,
    isFirstMsg: true,
  };

  if (chatStructure1.blockedContacts.includes(req.params.receiverId)) {
    msg.youBlocked = true;
  }

  if (chatStructure2.blockedContacts.includes(req.user.id)) {
    msg.receiverBlocked = true;
  }

  const isInChatWith = await ChatStructure.findOne({
    user: req.user.id,
    "chatsWith.userId": req.params.receiverId,
  });

  if (isInChatWith) {
    msg.isFirstMsg = false;
  }

  //get user profile
  const user = await User.findById(req.params.receiverId);

  res.status(200).json({
    chatStructure: msg,
    ...res.advancedResults,
    userProfile: user,
  });
});

exports.deleteChat = asyncHandler(async (req, res, next) => {
  const chat = await Chats.findById(req.params.id);

  if (!chat) {
    return next(
      new ErrorResponse(`No chat with the id : ${req.params.id} found `),
      404
    );
  }
  if (chat.msgType !== "txt") {
    await fs.unlink(`src/public/uploads/${chat.fileName}`, (err) => {
      if (err) return console.log(err);
      console.log("removed");
    });
  }
  await chat.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.deleteChatForMe = asyncHandler(async (req, res, next) => {
  //delete his id from whoShouldSee  from this chat
  const doc = await Chats.findOneAndUpdate(
    { _id: req.params.id },
    { whoShouldSee: [req.body.receiverId] },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: doc,
  });
});
exports.deleteChats = asyncHandler(async (req, res, next) => {
  const chats = await Chats.deleteMany({
    senderId: req.user.id,
    receiverId: req.params.receiverId,
  });

  //delete his id from whoShouldSee  from all the chats between this two sent to him, i.e ones he is the receiver
  const clearReceivedMsgs = await Chats.updateMany(
    { chatBetween: { $eq: [req.params.receiverId, req.user.id] } },
    { whoShouldSee: [req.params.receiverId] }
  );

  res.status(200).json({
    success: true,
    data: chats,
  });
});
exports.clearChats = asyncHandler(async (req, res, next) => {
  //delete his id from whoShouldSee  from all the chats between this two sent to him, i.e ones he is the receiver
  const clearReceivedMsgs = await Chats.updateMany(
    { chatBetween: { $eq: [req.params.receiverId, req.user.id] } },
    { whoShouldSee: [req.params.receiverId] }
  );
  const clearSentMsgs = await Chats.updateMany(
    { chatBetween: { $eq: [req.user.id, req.params.receiverId] } },
    { whoShouldSee: [req.params.receiverId] }
  );

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.postNormalFileupload = asyncHandler(async (req, res, next) => {
  if (!req.files) {
    return next(new ErrorResponse(`Please select a photo to upload`, 404));
  }
  const file = req.files.chat_file;

  if (file.size > 16 * 1000 * 1000) {
    return next(
      new ErrorResponse(
        `Please you cant upload photo of more than 16mb size`,
        404
      )
    );
  }

  file.name = `file_${req.user.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(
        new ErrorResponse(`Problem uploading file, please try again later`, 500)
      );
    }
    const isInChatWith = await ChatStructure.findOne({
      user: req.user.id,
      "chatsWith.userId": req.body.receiverId,
    });

    if (!isInChatWith) {
      const filter1 = { user: req.user.id };
      const filter2 = { user: req.body.receiverId };

      const chatStructure1 = await ChatStructure.findOne(filter1);
      const chatStructure2 = await ChatStructure.findOne(filter2);

      const update1 = {
        userId: req.body.receiverId,
        name: req.body.receiverName,
      };
      const update2 = { userId: req.user.id, name: req.body.senderName };

      chatStructure1.chatsWith.push(update1);
      chatStructure2.chatsWith.push(update2);
      await chatStructure1.save();
      await chatStructure2.save();
    }

    const chats = await Chats.create({
      ...req.body,
      fileName: file.name,
      msg: `${process.env.BACK_END_URL}/file/${file.name}`,
      chatBetween: [req.user.id, req.body.receiverId],
      whoShouldSee: [req.user.id, req.body.receiverId],
    });

    res.status(200).json({ success: true, data: chats });
  });
});
