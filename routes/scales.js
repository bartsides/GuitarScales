const express = require('express')
const router = express.Router()
const getNotes = require('../controllers/scales')

// Get scale
router.get('/:pattern/:note', function (req, res) {
  res.send(getNotes(req.params.pattern, req.params.note))
})

module.exports = router
