const User = require("../models/User");
const ChatStructure = require("../models/ChatStructure");
const Chats = require("../models/Chats");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncMiddleware");
const sendMail = require("../utils/nodeMailer");
const crypto = require("crypto");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, gender } = req.body;

  const chatStructure = await ChatStructure.create({
    _id: new mongoose.Types.ObjectId(),
  });
  const user = await User.create({
    name,
    email,
    password,
    role,
    gender,
    chatStructure,
  });
  const update = await ChatStructure.findByIdAndUpdate(chatStructure._id, {
    user: user._id,
  });

  sendTokenResponse(user, 200, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { password, email } = req.body;
  if (!password || !email) {
    return next(
      new ErrorResponse("please provide your email and password", 400)
    );
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("invalid email or password", 401));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("invalid email or password", 401));
  }

  sendTokenResponse(user, 200, res);
});

//get token from model, sign and send token via response and cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

exports.getHome = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
    .select(["-resetPasswordExpire", "-resetPasswordToken"])
    .populate("chatStructure")
    .exec();

  if (!user) {
    return next(new ErrorResponse("User not found", 401));
  }

  res.status(200).json({ success: true, data: { user } });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse("No User with such email found", 404));
  }
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONT_END_URL}/resetpassword/${resetToken}`;
  const message = `Please follow this url to reset your password: \n\n\ ${resetUrl} `;

  try {
    await sendMail({
      message,
      subject: "password reset email",
      email: user.email,
    });
    res.status(200).json({
      success: true,
      data: "email sent",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  //hash the token gotten back from the url
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");
  // console.log("controller hashed :" + resetPasswordToken);

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("invalid token", 400));
  }

  //set new password
  user.password = req.body.password;
  //set ressetpasswordtoken & resetpasswordexpire to undefned
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  //save these changes to database
  await user.save();

  sendTokenResponse(user, 200, res);
});

exports.updateUserDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    email: req.body.email,
    name: req.body.name,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("password is incorrect", 401));
  }
  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, data: {} });
});

exports.uploadDp = asyncHandler(async (req, res, next) => {
  if (!req.files) {
    return next(new ErrorResponse(`Please select a photo to upload`, 404));
  }
  const file = req.files.profile_pics;

  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload only a photo file`, 404));
  }
  if (file.size > 16 * 1000 * 1000) {
    return next(
      new ErrorResponse(
        `Please you cant upload photo of more than 16mb size`,
        404
      )
    );
  }
  const rand1000 = Math.floor(Math.random() * 1000);

  file.name = `profile_${req.user.id}_${rand1000}_${Date.now()}${
    path.parse(file.name).ext
  }`;
  // console.log(process);
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(
        new ErrorResponse(`Problem uploading file, please try again later`, 500)
      );
    }

    const data = await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        dp: `${process.env.BACK_END_URL}/file/${file.name}`,

        fileName: file.name,
      },
      { new: true }
    ).select("-chatStructure");
    if (req.body.old_pics) {
      await fs.unlink(`src/public/uploads/${req.body.old_pics}`, (err) => {
        if (err) return console.log(err);
        console.log("removed");
      });
    }

    res.status(200).json({ success: true, data: data });
  });
});
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const data = await User.findOneAndUpdate({ _id: req.user.id }, req.body, {
    new: true,
  }).select("-chatStructure");
  if (!data) {
    return next(new ErrorResponse(`User Not Found`, 404));
  }
  res.status(200).json({ success: true, data: data });
});
exports.deleteProfile = asyncHandler(async (req, res, next) => {
  const cs = await ChatStructure.deleteOne({ user: req.user.id });

  const clearChats = await Chats.updateMany(
    {},
    {
      $pull: {
        whoShouldSee: req.user.id,
      },
    }
  );
  const clear = await ChatStructure.updateMany(
    {},
    {
      $pull: {
        chatsWith: { userId: req.user.id },
      },
    }
  );
  const user = await User.findByIdAndDelete(req.user.id);
  if (!user) {
    return next(new ErrorResponse(`User Not Found`, 404));
  }

  res.status(200).json({ success: true, data: {} });
});
