require("dotenv").config();
const express = require("express");
const mongoDB = require("./src/database/mongoDB");
const redisDB = require("./src/database/redisDB");
const router = require("./src/routes/openRoutes.js");
const secureRoute = require("./src/routes/secureRoutes.js");
const bodyParser = require("body-parser");
const passport = require("passport");
require("./src/auth/auth");

mongoDB.on(
  "error",
  console.log.bind(console, `Mongo Database connection error`)
);
mongoDB.once("open", () => {
  console.log(`Mongo Database connection successful`);
});

redisDB.on("error", (err) =>
  console.log.bind(console, `Redis Database connection error`)
);

redisDB.ping().then((result) => {
  if(result === "PONG") console.log(`Redis Database connection successful`);
})

const app = express();

app.use(passport.initialize());
app.use(bodyParser.json());
app.use(router);
app.use("/user", passport.authenticate("jwt", { session: false }), secureRoute);

const port = process.env.PORT;

app.listen(port, (req, res) => {
  console.log(`Server is Running on http://localhost:${port}`);
});
