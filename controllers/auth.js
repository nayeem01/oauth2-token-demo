const JWT = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const {
    sendTokenResponse,
    sendRefresehTokenResponse,
} = require("../middleware/auth");

// @desc      Login
// @route     POST auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate emil & password
    if (!email || !password) {
        return next(
            new ErrorResponse("Please provide an email and password", 400)
        );
    }

    // Check for user
    user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    const { accessToken, options } = await sendTokenResponse(user._id);
    const refreshToken = await sendRefresehTokenResponse(user._id);
    res.status(200).cookie("token", accessToken, options).json({
        success: true,
        accessToken,
        refreshToken,
    });
});

// @desc      Log user out / clear cookie
// @route     GET auth/logout
// @access    Public
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        data: {},
    });
});
