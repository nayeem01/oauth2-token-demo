const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
    getUsers,
    successResponse,
    createUser,
    refreshToken,
} = require("../controllers/users");
const { login, logout } = require("../controllers/auth");
const { verifyAccessToken } = require("../middleware/auth");
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);
router.get(
    "/google/redirect",
    passport.authenticate("google"),
    successResponse
);

router.post("/register", createUser);
router.get("/getUsers", verifyAccessToken, getUsers);
router.post("/refresh-token", refreshToken);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
