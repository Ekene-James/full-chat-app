const express = require("express");
const advancedResults = require("../middleware/advancedResultMiddleware");
const Chats = require("../models/Chats");

const router = express.Router({ mergeParams: true });
const {

  postChat,
  getChats,
  firstLoadWithUser,
  deleteChat,
  deleteChats,
  deleteChatForMe,
  clearChats,
  postNormalFileupload 
} = require("../controller/chats");
const { protect } = require("../middleware/authMiddleware");

router
  .route("/")

  .post(protect, postChat);
router
  .route("/file")

  .post(protect, postNormalFileupload);
router
  .route("/singleChat/:id")
  .put(protect, deleteChatForMe)
  .delete(protect, deleteChat);
router
  .route("/firstLoadWithUser/:receiverId")
  .get(protect,advancedResults(Chats), firstLoadWithUser);

router
  .route("/:receiverId")
  .get(protect,advancedResults(Chats),getChats)
  .put(protect, clearChats)
  .delete(protect, deleteChats);

module.exports = router;
