const User = require("../model/User");
 const ErrorResponse = require("../utills/errorResponse");
const asyncHandler = require("../middleware/async");
const crypto= require('crypto')

// @desc   Get all user
// @route  GET  /api/v1/auth/users
// @access Private/Admin

exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
});
  
// @desc   Get single user
// @route  GET  /api/v1/auth/users/:id
// @access Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    res.status(200).json({
        success:true,
        data:user
    })
  });
    

  // @desc   Create  user
// @route  Post  /api/v1/auth/users
// @access Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body)
    res.status(201).json({
        success:true,
        data:user
    })
  });
    

    // @desc   Update  user
// @route  Put  /api/v1/auth/users/:id
// @access Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id,req.body,{
        new :true,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        data:user
    })
  });
    

    // @desc   Delete  user
// @route  DELETE  /api/v1/auth/users/:id
// @access Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success:true,
        data:{}
    })
  });