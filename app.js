require("dotenv").config();
const express = require("express");
const database = require("./src/config/database");
const router = require("./src/routes/index.js");
const secureRoute = require("./src/routes/secureRoutes.js");
const bodyParser = require("body-parser");
const passport = require("passport");
require("./src/auth/auth");

database.on("error", console.log.bind(console, `Database connection error`));
database.once("open", () => {
  console.log(`Database connection successful`);
});

const app = express();

app.use(passport.initialize());
app.use(bodyParser.json());
app.use(router);
app.use('/user', passport.authenticate('jwt', { session: false }), secureRoute);

const port = process.env.PORT;

app.listen(port, (req, res) => {
  console.log(`Server is Running on http://localhost:${port}`);
  console.log("hello world...");
});
