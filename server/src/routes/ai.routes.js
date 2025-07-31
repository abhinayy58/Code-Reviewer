const express = require('express')
const router = express.Router()

const aiService = require('../controllers/ai.controller')

router.post("/get-review", aiService.getResponse); 

module.exports = router
