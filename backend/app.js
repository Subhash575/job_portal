import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

const app = express();

// Render puts one proxy in front of the app. Without this every visitor shares the proxy's IP and the login limit would lock everyone out together.
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, // Set this in Render: https://your-app.vercel.app
].filter(Boolean); // Remove undefined if FRONTEND_URL not set yet

app.use(
  cors({
    // Only our own sites may call the API from a browser. Any other origin gets no CORS headers and the browser blocks it.
    origin: allowedOrigins,
    credentials: true,
  }),
);

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Express 5 sends errors thrown in async handlers here, so every route gets a reply.
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid id.", success: false });
  }
  res.status(500).json({
    message: "Internal server error. Please try again.",
    success: false,
  });
});

export default app;
