const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getHome,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateUserDetails,
  logout,
  uploadDp,
  updateProfile,
  deleteProfile

} = require("../controller/auth");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.put("/uploadDp",protect, uploadDp);
router.put("/updateProfile",protect, updateProfile);
router.get("/logout", logout);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.put("/updatedetails", protect, updateUserDetails);
router.put("/updatepassword", protect, updatePassword);
router.get("/getHome", protect, getHome);
router.delete("/deleteProfile", protect, deleteProfile);
module.exports = router;
