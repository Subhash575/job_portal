import app from "./app.js";
import connectDB from "./utils/db.js";

const PORT = process.env.PORT || 5000;

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
