const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const verifyToken = require('../middleware/verifyToken')

router.post('/register', async (req, res) => {
  authController.register(req, res)
})

router.post('/login', async (req, res) => {
  authController.login(req, res)
})

// TODO: example how to use verifyToken, delete later
router.get('/test', verifyToken, (req, res) => {
  console.log(req.userId)
  res.send('test')
})

module.exports = router
