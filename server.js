const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user.routes");

const app = express();
const PORT = process.env.PORT || 3000;
const indexRouter = require("./routes/index.routes");
// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/drive_project", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Routes
app.use("/user", userRouter);
app.use("/", indexRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
