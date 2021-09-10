const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const passport = require("passport");
const passportSetup = require("./config/passport.google.setup");
const { PORT, NODE_ENV } = require("./config/config");

connectDB();

// Route files
const users = require("./routes/users");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

if (NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Mount routers
app.use("/auth", users);

const port = PORT || 5000;

app.listen(
    port,
    console.log(`Server running in ${NODE_ENV} mode on port ${port}`)
);

process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
});
