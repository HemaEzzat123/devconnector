const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const users = require("./routes/api/users");
const post = require("./routes/api/post");
const profile = require("./routes/api/profile");

const app = express();

const db = require("./config/keys").mongoURI;

mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

app.use("/api/users", users);
app.use("/api/post", post);
app.use("/api/profile", profile);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
