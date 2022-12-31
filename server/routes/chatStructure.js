const express = require("express");
const router = express.Router();
const {
  
  blockContact,
  unBlockContact
} = require("../controller/chatStructure");

const { protect } = require("../middleware/authMiddleware");
router.put("/block/:id",protect, blockContact);
router.put("/unblock/:id",protect, unBlockContact);

module.exports = router;
