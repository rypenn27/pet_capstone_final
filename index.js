// This is the Web Server
const express = require("express");
const server = express();
const cookieSession = require("cookie-session");
const passport = require("passport");
require("./passport-setup");

// create logs for everything
const morgan = require("morgan");
server.use(morgan("dev"));

// handle application/json requests
const bodyParser = require("body-parser");
server.use(bodyParser.json());

// here's our static files
const path = require("path");
server.use(express.static(path.join(__dirname, "build")));

// here's our API
server.use("/api", require("./routes"));

//GoogleAuth20

server.use(passport.initialize());
server.use(passport.session());

server.use(
  cookieSession({
    name: "pet-rescuers",
    keys: ["key1", "key2"],
  })
);

const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

server.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

server.get("/", (req, res) => res.send("You are not Logged In!"));
server.get("/failed", (req, res) => res.send("You Failed to log in!"));
server.get("/good", isLoggedIn, (req, res) =>
  res.send(`Welcome ${req.user.displayName}!`)
);

server.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/good");
    console.log("you are logged in");
  }
);

// by default serve up the react app if we don't recognize the route
server.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

server.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});

// bring in the DB connection
const { client } = require("./db");

// connect to the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`Server is running on ${PORT}!`);

  try {
    await client.connect();
    console.log("Database is open for business!");
  } catch (error) {
    console.error("Database is closed for repairs!\n", error);
  }
});
