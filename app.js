// Dependencies
const express = require("express");
const logsArray = require("./models/log.js");

// Configuration
const app = express();

// Middleware
app.use(express.json());

// Health Check Route
app.get("/", (req, res) => {
    res.send("welcome to the captain's log")
})

// Index route
app.get("/logs", (req, res) => {
    res.json(logsArray)
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

// 404 Page not found
app.get("*", (req, res) => {
    res.status(404).json({ error: "Sorry, no page found" });
});

// Export
module.exports = app;