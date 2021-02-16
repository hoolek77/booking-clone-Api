const express = require("express");
const router = express.Router();
const exampleLogger = require('../middleware/exampleLogger')

router.post("/", exampleLogger, async (req, res) => {
    // example
});

module.exports = router;
