var express = require('express')
var router = express.Router()
var patternsController = require('../controllers/patterns')

router.get('/', function (req, res) {
  res.send(patternsController.getPatterns())
})

module.exports = router
