const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require("./src/routes/user.routes");
app.use("/api", userRoutes);

(async () => {
  try {
    app.listen(port, "0.0.0.0", () => {
      console.log(`server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Error starting server");
  }
})();
