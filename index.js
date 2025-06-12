const express = require("express");
require("dotenv").config({ path: "./config.env" });
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const globalErrorHandler = require("./middleware/error");
const room = require("./routes/roomRoutes");
const user = require("./routes/userRoutes");
const booking = require("./routes/bookingRoutes");
const path = require("path");
const connectDB = require("./server");
const app = express();

app.set("trust proxy", 1);
app.use(helmet());
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:5173",
    ];
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      process.env.NODE_ENV === "development"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
};
app.use(cors(corsOptions));
app.use(
  "/api/v1/images",
  cors(corsOptions),
  express.static(path.join(__dirname, "public/images"))
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      "price",
      "ratingsAverage",
      "ratingsQuantity",
      "maxGroupSize",
      "difficulty",
    ],
  })
);

app.use("/api/v1/room", room);
app.use("/api/v1/user", user);
app.use("/api/v1/bookings", booking);

app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.use(globalErrorHandler);

const port = process.env.PORT || 3000;
const host = "0.0.0.0";
let server;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(port, host, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on http://${host}:${port}`
      );
      if (process.env.RAILWAY_STATIC_URL) {
        console.log(`Running on Railway: ${process.env.RAILWAY_STATIC_URL}`);
      }
    });
  } catch (err) {
    console.error("Failed to connect to database. Server not started.", err);
    process.exit(1);
  }
};

startServer();

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  if (server) {
    server.close(() => {
      console.log("💥 Process terminated!");
    });
  }
});

module.exports = app;
