const getPatterns = require('../controllers/patterns').getPatterns
const Notes = require('../models/notes')
const FretDrawer = require('../controllers/fretDrawer')
const fretDrawer = new FretDrawer()
const express = require('express')
const router = express.Router()

let patterns = getPatterns()
let notes = new Notes().getNotes()

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', {
    title: 'Guitar Scales',
    patterns: patterns,
    notes: notes
  })
})

/* GET fretboard png in base64 string format. */
router.get('/:pattern/:note', function (req, res) {
  res.contentType = 'base64'
  res.send(fretDrawer.drawFretboard(decodeURI(req.params.pattern), decodeURI(req.params.note)))
})

module.exports = router
