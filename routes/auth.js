const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const { register, login,logout, getMe,forgotPassword,updatePassword,updateDetails,resetPassword } = require("../controllers/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(protect, getMe);
router.route("/logout").get(logout);
router.route("/updatedetails").put(protect, updateDetails);
 router.route("/updatepassword").put(protect, updatePassword);
router.route("/forgotpassword").post( forgotPassword);
router.route("/resetpassword/:resettoken").put( resetPassword);


module.exports = router;
