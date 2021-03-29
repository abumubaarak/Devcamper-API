const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const path= require('path')
const errorHandler = require("./middleware/error");
const fileUpload= require("express-fileupload")
const helmet= require('helmet')
const xssclean= require('xss-clean')
const rateLimit= require('express-rate-limit')
const hpp= require('hpp')
const cors= require('cors')
const cookieParser= require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize');

const connectDB = require("./config/db");
const logger = require("./middleware/logger");

///LOad ENV
dotenv.config({ path: "./config/config.env" });

const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/review");


connectDB();

const app = express();

app.use(express.json());

app.use(cookieParser())

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//File uploading
app.use(fileUpload())

//Sanitize data
app.use(mongoSanitize());

//set security header
app.use(helmet())

//Prevent XSS ATTACKS
app.use(xssclean())

//Rate limiting
const limiter= rateLimit({
  windowMs:10*60*1000,
  max:100 //10 min
})

app.use(limiter)
app.use(cors())

//prevent hpp param plloution
app.use(hpp())

app.use(express.static(path.join(__dirname,'public')))
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses",courses);
app.use("/api/v1/auth",auth);
app.use("/api/v1/users",users);
app.use("/api/v1/reviews",reviews);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);

  server.close(() => process.exit(1));
});
