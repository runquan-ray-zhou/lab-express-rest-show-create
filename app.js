// Dependencies
const express = require("express");
const logArray = require("./models/log.js");

// Configuration
const app = express();

// Middleware
app.use(express.json());

// Part 2 Bonus Validation Checkers
const checkForCaptainName = (req, res, next) => {
  if (typeof req.body.captainName === "string") {
    return next();
  } else {
    res.send("The captain's name must be a string type!")
  }
}

const checkForTitle = (req, res, next) => {
  if (typeof req.body.title === "string") {
    return next();
  } else {
    res.send("The title must be a string type!")
  }
}

const checkForPost = (req, res, next) => {
  if (typeof req.body.post === "string") {
    return next();
  } else {
    res.send("The post must be a string type!")
  }
}

const checkForMistakesWereMadeToday = (req, res, next) => {
  if (typeof req.body.mistakesWereMadeToday === "boolean") {
    return next();
  } else {
    res.send("The mistakesWereMadeToday must be a boolean type!")
  }
}

// const checkForDaysSinceLastCrisis = (req, res, next) => {
//   if (typeof req.body.daysSinceLastCrisis === "number") {
//     return next();
//   } else {
//     res.send("The daysSinceLastCrisis must be a number type!")
//   }
// }

// Controllers
const logsController = require("./v2/controllers/logsController.js")

app.use("/v2/logs", logsController)

// Health Check Route
app.get("/", (req, res) => {
    res.send("welcome to the captain's log")
})

// // Index Route
// app.get("/logs", (req, res) => {
//     res.json(logArray)
// })

// Part 1 Bonus Route
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

// Show Route
app.get("/logs/:id", (req, res) => {
    const { id } = req.params;
    const log = logArray.find((log, index) => index === Number(id))
    if (log) {
      res.send(log);
    } else {
      res.redirect("/*");
    }
  });

// Create Route
app.post("/logs", checkForCaptainName, checkForTitle, checkForPost, checkForMistakesWereMadeToday, 
  //checkForDaysSinceLastCrisis, 
  (req, res) => {
    const currentLog = {...req.body}
    logArray.push(currentLog);
    res.json(logArray[logArray.length - 1]);
  });

// Delete Route
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

// Update Route
app.put("/:id", checkForCaptainName, checkForTitle, checkForPost, checkForMistakesWereMadeToday, 
  //checkForDaysSinceLastCrisis, 
  (req, res) => {
    const { id } = req.params;
    const logToUpdateIndex = logArray.findIndex((log) => log.id === Number(id));
    if (logToUpdateIndex !== -1) {
      logArray[logToUpdateIndex] = {...logArray[logToUpdateIndex], ...req.body};
      res.status(200).json(logArray[logToUpdateIndex]);
    } else {
      res.redirect("/*");
    }
  });

// 404 Page Not Found
app.get("*", (req, res) => {
    res.status(404).json({ error: "Sorry, no page found" });
});

// Export
module.exports = app;