const express = require('express')
const router = express.Router()
const exampleLogger = require('../middleware/exampleLogger')

router.post('/', exampleLogger, async (req, res) => {
  console.log('users post')
})

module.exports = router
