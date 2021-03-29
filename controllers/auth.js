const User = require("../model/User");
const sendEmail= require('../utills/sendEmail')
const ErrorResponse = require("../utills/errorResponse");
const asyncHandler = require("../middleware/async");
const crypto= require('crypto')
// @desc   Register user
// @route  POST /api/v1/auth/register
// @access Public

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  ///Create token
  sendTokenResponse(user, 200, res);
});

// @desc   Login user
// @route  Post /api/v1/auth/login
// @access Public   

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorResponse("Plsease provide an email and password ", 400)
    );
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials ", 400));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials ", 400));
  }

  sendTokenResponse(user, 200, res);
});

//Get Token from model

const sendTokenResponse = (user, statusCode, res) => {
  ///Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "productions") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};

// @desc   Get curretn logged in user
// @route  Post /api/v1/auth/me
// @access private

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc  Forget Password
// @route  Post /api/v1/auth/forgotpassword
// @access public 

exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({email:req.body.email});
  
    if(!user){
        return next(new ErrorResponse("There is no user that email", 400));
    }

    const resetToken= user.getResetPasswordToken()

    await user.save({validateBeforeSave:false})

    //Create reset url

    const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`
 
    const message=`You are receiving this email because you (or someone else ) hs requested the reset of a password . Plsease make a PUT request to : \n\n  ${resetUrl}`
 
    try {
        await sendEmail({
            email:user.email,
            subject:'Password reset token',
            message
        })
        res.status(200).json({sucess:true,data:'Email sent'})
    } catch (error) {
        user.resetPasswordToken=undefined
        user.resetPasswordExpire=undefined
        await user.save({validateBeforeSave:false})
        return next(new ErrorResponse("Email couldn't be sent ", 400));

    }

    res.status(200).json({
      success: true,
      data: user,
    });
  });
  

  // @desc   Reset Password
// @route  PUT /api/v1/auth/resetpassword/:resetToken
// @access private

exports.resetPassword = asyncHandler(async (req, res, next) => {

    const resetPasswordToken= crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    });

    if(!user){
        return next(new ErrorResponse('iNVALID tOKEN',400))
    }

    user.password= req.body.password
    user.resetPasswordToken=undefined
    user.resetPasswordExpire=undefined

    await user.save()

    sendTokenResponse(user,200,res)
   
  });

  // @desc   Update user details
// @route  PUT /api/v1/auth/updatedetails
// @access private

exports.updateDetails = asyncHandler(async (req, res, next) => {
   
    const fieldToUpdate={
        name:req.body.name,
        email:req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id,fieldToUpdate,{
        new: true,
        runValidators:true
    });
  
    res.status(200).json({
      success: true,
      data: user,
    });
  });

// @desc   Update password
// @route  PUT /api/v1/auth/updatepassword
// @access private
  exports.updatePassword = asyncHandler(async (req, res, next) => {
   
    const user = await User.findById(req.user.id).select('+password');

    if(!(await user.matchPassword(req.body.currentPassword))){
        return next(new ErrorResponse('Password is incorrect',401))
    }

    user.password=req.body.newPassword

    await user.save()

    sendTokenResponse(user,200,res)
     
  });


  // @desc   Log user out / clear cookie
// @route  Post /api/v1/auth/logout
// @access private

exports.logout = asyncHandler(async (req, res, next) => {

    res.cookie('token','none',{
        expires: new Date(Date.now()+10*1000),
        httpOnly:true
    })
    
    res.status(200).json({
      success: true,
      data: {},
    });
  });