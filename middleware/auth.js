const JWT = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = require("../config/config");
// Protect routes
exports.verifyAccessToken = asyncHandler(async (req, res, next) => {
    if (!req.headers["authorization"])
        return next(
            new ErrorResponse("Not authorized to access this route", 401)
        );
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    console.log(token);
    JWT.verify(token, JWT_ACCESS_SECRET, (err, payload) => {
        console.log(payload);
        if (err) {
            const message =
                err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
            return next(new ErrorResponse(`${message}`, 401));
        }
        req.payload = payload;
        next();
    });
});

exports.verifyRfreshToken = (refreshToken) => {
    return JWT.verify(refreshToken, JWT_REFRESH_SECRET, (err, payload) => {
        if (err) return new ErrorResponse(`${err}`, 404);
        const userId = payload.aud;
        return userId;
    });
};

exports.sendTokenResponse = (user) => {
    return new Promise((resolve, reject) => {
        const payload = {};
        const secret = JWT_ACCESS_SECRET;
        const options = {
            expiresIn: "25s",
            issuer: "nayeem",
            audience: String(user),
        };

        JWT.sign(payload, secret, options, (err, accessToken) => {
            if (err) {
                console.log(err.message);
                reject(new ErrorResponse("Invalid credentials", 401));
            }
            resolve({ accessToken, options });
        });
    });
};

exports.sendRefresehTokenResponse = (user) => {
    return new Promise((resolve, reject) => {
        const payload = {};
        const secret = JWT_REFRESH_SECRET;
        const options = {
            expiresIn: "1y",
            issuer: "nayeem",
            audience: String(user),
        };
        JWT.sign(payload, secret, options, (err, refreshToken) => {
            if (err) {
                console.log(err.message);
                // reject(err)
                reject(new ErrorResponse(`${err.message}`, 400));
            }
            resolve(refreshToken);
        });
    });
};
