// Dependencies
const express = require("express");

// Configuration
const app = express();

// Health Check Route
app.get("/", (req, res) => {
    res.send(`Captain's Log - ${Date()}`)
})

// 404 Page not found
app.get("*", (req, res) => {
    res.status(404).json({ error: "Sorry, no page found" });
});

// Export
module.exports = app;