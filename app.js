// Dependencies
const express = require("express");
const logsArray = require("./models/log.js");
const log = require("./models/log.js");

// Configuration
const app = express();

// Middleware
app.use(express.json());

// Health Check Route
app.get("/", (req, res) => {
    res.send("welcome to the captain's log")
})

// // Index route
// app.get("/logs", (req, res) => {
//     res.json(logsArray)
// })

// Bonus route
app.get("/logs", (req, res) => {
  console.log(req.query)
  let returnArray;
  if (Object.hasOwn(req.query,"order")) {
    switch(req.query.order) {
      case "asc":
      returnArray = [...logsArray].sort((a, b) => a.captainName.localeCompare(b.captainName))
      break;
      case "desc":
      returnArray = [...logsArray].sort((a, b) => b.captainName.localeCompare(a.captainName))
      break;
      default:
      returnArray = [...logsArray]
    }
    res.json(returnArray)
  } else if (Object.hasOwn(req.query,"mistakes")){
    switch(req.query.mistakes) {
      case "true":
      returnArray = [...logsArray].filter((log) => log.mistakesWereMadeToday === true)
      break;
      case "false":
      returnArray = [...logsArray].filter((log) => log.mistakesWereMadeToday === false)
      break;
      default:
      returnArray = [...logsArray]
    }
    res.json(returnArray)
  } else if (Object.hasOwn(req.query,"lastCrisis")){
    switch(req.query.lastCrisis) {
      case "gt10":
      returnArray = [...logsArray].filter((log) => log.daysSinceLastCrisis > 10)
      break;
      case "gte20":
      returnArray = [...logsArray].filter((log) => log.daysSinceLastCrisis >= 20)
      break;
      case "lte5":
      returnArray = [...logsArray].filter((log) => log.daysSinceLastCrisis <= 5)
      break;
      default:
      returnArray = [...logsArray]
    }
    res.json(returnArray)
  } else {
    res.json(logsArray)
  }
})

// Show route
app.get("/logs/:id", (req, res) => {
    const { id } = req.params;
    const log = logsArray.find((log, index) => index === Number(id))
    if (log) {
      res.send(log);
    } else {
      res.redirect("/*");
    }
  });

// Create route
app.post("/logs", (req, res) => {
    const newLog = {...req.body}
    logsArray.push(newLog);
    res.json(logsArray[logsArray.length - 1]);
  });

// Delete route
app.delete("/logs/:id", (req, res) => {
    const { id } = req.params;
    const deletedLogIndex = logsArray.findIndex((log) => log.id === Number(id));
    if (deletedLogIndex !== -1) {
      const deletedLog = logsArray.splice(deletedLogIndex, 1);
      res.redirect("/logs")
    } else {
      res.redirect("/*");
    }
  });

// Update route
app.put("/:id", (req, res) => {
    const { id } = req.params;
    const logToUpdateIndex = logsArray.findIndex((log) => log.id === Number(id));
    if (logToUpdateIndex !== -1) {
      logsArray[logToUpdateIndex] = {...logsArray[logToUpdateIndex], ...req.body};
      res.status(200).json(logsArray[logToUpdateIndex]);
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