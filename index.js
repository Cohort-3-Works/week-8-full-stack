const express = require("express");
const mongoose = require("mongoose");

const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
const app = express();

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

async function connectDB() {
  await mongoose.connect(
    "mongodb+srv://subhajit:nainasweetheart@coursera.6brng.mongodb.net/Coursera-app"
  );
  console.log("Connected to MongoDB");

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

connectDB();
