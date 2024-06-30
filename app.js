// Dependencies
const express = require("express");
const logArray = require("./models/log.js");

// Configuration
const app = express();

// Middleware
app.use(express.json());

// Part 2 Bonus Validation Checker
const checkForCaptainName = (req, res, next) => {
  if (typeof req.body.captainName === "string") {
    return next();
  } else {
    res.send("The captain's name must be a string type!")
  }
}


// Health Check Route
app.get("/", (req, res) => {
    res.send("welcome to the captain's log")
})

// // Index route
// app.get("/logs", (req, res) => {
//     res.json(logArray)
// })

// Part 1 Bonus route
app.get("/logs", (req, res) => {
  console.log(req.query)
  let returnArray;
  if (Object.hasOwn(req.query,"order")) {
    switch(req.query.order) {
      case "asc":
      returnArray = [...logArray].sort((a, b) => a.captainName.localeCompare(b.captainName))
      break;
      case "desc":
      returnArray = [...logArray].sort((a, b) => b.captainName.localeCompare(a.captainName))
      break;
      default:
      returnArray = [...logArray]
    }
    res.json(returnArray)
  } else if (Object.hasOwn(req.query,"mistakes")){
    switch(req.query.mistakes) {
      case "true":
      returnArray = [...logArray].filter((log) => log.mistakesWereMadeToday === true)
      break;
      case "false":
      returnArray = [...logArray].filter((log) => log.mistakesWereMadeToday === false)
      break;
      default:
      returnArray = [...logArray]
    }
    res.json(returnArray)
  } else if (Object.hasOwn(req.query,"lastCrisis")){
    switch(req.query.lastCrisis) {
      case "gt10":
      returnArray = [...logArray].filter((log) => log.daysSinceLastCrisis > 10)
      break;
      case "gte20":
      returnArray = [...logArray].filter((log) => log.daysSinceLastCrisis >= 20)
      break;
      case "lte5":
      returnArray = [...logArray].filter((log) => log.daysSinceLastCrisis <= 5)
      break;
      default:
      returnArray = [...logArray]
    }
    res.json(returnArray)
  } else {
    res.json(logArray)
  }
})

// Show route
app.get("/logs/:id", (req, res) => {
    const { id } = req.params;
    const log = logArray.find((log, index) => index === Number(id))
    if (log) {
      res.send(log);
    } else {
      res.redirect("/*");
    }
  });

// Create route
app.post("/logs", checkForCaptainName, (req, res) => {
    const currentLog = {...req.body}
    logArray.push(currentLog);
    res.json(logArray[logArray.length - 1]);
  });

// Delete route
app.delete("/logs/:id", (req, res) => {
    const { id } = req.params;
    const deletedLogIndex = logArray.findIndex((log) => log.id === Number(id));
    if (deletedLogIndex !== -1) {
      const deletedLog = logArray.splice(deletedLogIndex, 1);
      res.redirect("/logs")
    } else {
      res.redirect("/*");
    }
  });

// Update route
app.put("/:id", (req, res) => {
    const { id } = req.params;
    const logToUpdateIndex = logArray.findIndex((log) => log.id === Number(id));
    if (logToUpdateIndex !== -1) {
      logArray[logToUpdateIndex] = {...logArray[logToUpdateIndex], ...req.body};
      res.status(200).json(logArray[logToUpdateIndex]);
    } else {
      res.redirect("/*");
    }
  });

// 404 Page not found
app.get("*", (req, res) => {
    res.status(404).json({ error: "Sorry, no page found" });
});

// Export
module.exports = app;