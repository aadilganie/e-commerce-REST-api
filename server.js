require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const morgan = require("morgan");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/db");
const fileUpload = require("express-fileupload");
const path = require("path");
const cookieParser = require("cookie-parser");

const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(fileUpload());
app.use(mongoSanitize()); // Sanitize request
app.use(helmet()); // Set security headers
app.use(xss()); // Prevent xss attacks
// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minuates
  max: 100, // 100 requests
});
app.use(limiter);
app.use(hpp()); // Prevent http param polution
app.use(cors()); // Enable cors

connectDB();

app.use("/api/v1/shops", require("./routers/shopRouter"));
app.use("/api/v1/shopitems", require("./routers/shopItemRouter"));
app.use("/api/v1/auth", require("./routers/authRouter"));
app.use("/api/v1/users", require("./routers/userRouter"));
app.use("/api/v1/reviews", require("./routers/reviewRouter"));
app.use(errorHandler);

// http://localhost:5000/uploads/photo_5ee59cc1ac350f856d6d273f.jpeg
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server up in ${process.env.NODE_ENV} mode on port ${PORT}.`)
);
