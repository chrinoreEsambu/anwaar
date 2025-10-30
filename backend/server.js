const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;

(async () => {
  try {
    app.listen(port, "0.0.0.0", () => {
      console.log(`server running on http://loacalhost:${port}`);
    });
  } catch (error) {
    console.log("Error starting server");
  }
})();
