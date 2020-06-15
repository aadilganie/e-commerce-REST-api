require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const morgan = require("morgan");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/db");
const fileUpload = require("express-fileupload");
const path = require("path");

const app = express();
app.use(express.json());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(fileUpload({ limits: { fileSize: 5000000 } }));

connectDB();

app.use("/api/v1/shops", require("./routers/shopRouter"));
app.use("/api/v1/shopitems", require("./routers/shopItemRouter"));
app.use("/api/v1/auth", require("./routers/authRouter"));
app.use(errorHandler);

// http://localhost:5000/uploads/photo_5ee59cc1ac350f856d6d273f.jpeg
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server up in ${process.env.NODE_ENV} mode on port ${PORT}.`)
);
