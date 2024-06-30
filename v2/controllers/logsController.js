// Dependencies
const express = require("express")

const router = express.Router()

const logArray = require("../../models/log.js")

// Index HTML Route
router.get("/", (req, res) => {
    const htmlLogArray = logArray.map((log) => Object.entries(log).slice(0,1)[0][1])
    const logList = htmlLogArray.map((log) => `<li>Captain's Log: Entry id # <a href="/v2/logs/${log}/">${log}</a></li>`).join("")
    res.status(200).send(logList)
})

// Show HTML Route
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const log = logArray.find((log) => log.id === Number(id))
    if (log) {
      res.send(
        `<div><h1><em>${log.title}</em></h1><h2>By: ${log.captainName}</h2><p>"${log.post}"</p><br><a href="/v2/logs"><button>Back</button></a></div>`
    );
    } else {
      res.redirect("/*");
    }
  });

// Export
module.exports = router