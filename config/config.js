const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    Google_ClientID: process.env.Google_ClientID,
    Google_ClientSecret: process.env.Google_ClientSecret,
    cb_URL: process.env.cb_URL,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
};
