// Dependencies
const express = require("express");
const logs = express.Router();
const logsArray = require("./models/log.js");

// Configuration
const app = express();

// Health Check Route
app.get("/", (req, res) => {
    res.send("welcome to the captain's log")
})

// Index route
app.get("/logs", (req, res) => {
    res.json(logsArray)
})

// 404 Page not found
app.get("*", (req, res) => {
    res.status(404).json({ error: "Sorry, no page found" });
});

// Export
module.exports = app;