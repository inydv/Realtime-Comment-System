// IMPORT MODULES
const express = require("express");

// CREATE EXPRESS APP
const app = express();

// CONSTANTS
const PORT = process.env.PORT || 3000;

// SERVE STATIC FILE
app.use(express.static("public"));

// LISTEN SERVER
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
