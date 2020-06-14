require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const morgan = require("morgan");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/db");

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

connectDB();

app.use("/api/v1/shops", require("./routers/shopRouter"));
app.use("/api/v1/shopitems", require("./routers/shopItemRouter"));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server up in ${process.env.NODE_ENV} mode on port ${PORT}.`)
);
