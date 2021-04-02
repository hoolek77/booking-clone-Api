const express = require('express')
const cityController = require('../controllers/cityController')
const router = express.Router()

router.get('', async (req, res, next) => {
  cityController.getCities(req, res, next)
})

module.exports = router
