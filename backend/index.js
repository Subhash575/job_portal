import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
//In this way we connect to mongodb

// remember here we intialize the empty object
dotenv.config();

const app = express();

//How to make API or how to get data from the browser.
//This is our API basic
//Below api is for testing our code is working or not.
// app.get("/home", (req, res) => {
//   return res.status(200).json({
//     message: "I am coming from backend",
//     success: true,
//   });
// });

//middleware
//When request pass then our data in jason format.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//frontend build we use the react vite(imp to remember)
// const corsOptions = {
//   origin: "http://localhost:5173",
//   credentials: true,
// };
// app.use(cors(corsOptions));

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, // Set this in Render: https://your-app.vercel.app
].filter(Boolean); // Remove undefined if FRONTEND_URL not set yet

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl), allowed explicit origins, OR any Vercel domain ending in .vercel.app
      if (
        !origin || 
        allowedOrigins.includes(origin) || 
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin} not allowed`));
      }
    },
    credentials: true,
  }),
);

// Add Test Route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;

//api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

//It take the port and callback function
// app.listen(PORT, () => {
//   connectDB();
//   console.log(`Server running at port ${PORT}`);
// });

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

// connect DB first, then start server. If the database is down, stop instead of serving errors.
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Could not connect to MongoDB:", error.message);
    process.exit(1);
  });
