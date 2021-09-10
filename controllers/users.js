const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const { verifyRfreshToken } = require("../middleware/auth");
const { sendTokenResponse } = require("../middleware/auth");

// @access    Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
    const user = await User.find();
    res.status(200).json({
        success: true,
        data: user,
    });
});

exports.successResponse = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Redirected URl",
    });
});

// @route     GET /api/v1/users/:id
// @access    Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc      Create user
// @route     POST /auth/register
// @access    Public/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(201).json({
        success: true,
        data: user,
    });
});

// @desc      refresh access token
// @route     POST /auth/refresh-token
// @access    Public/Admin
exports.refreshToken = asyncHandler(async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) next(new ErrorResponse("no token found", 400));
        const userId = await verifyRfreshToken(refreshToken);
        const { accessToken, options } = await sendTokenResponse(userId);
        // const refToken = await signRefreshToken(userId)
        res.status(200).cookie("token", accessToken, options).json({
            success: true,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        next(error);
    }
});
