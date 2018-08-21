const getPatterns = require('../controllers/patterns').getPatterns
const Notes = require('../models/notes')
const getTunings = require('../controllers/tunings').getTunings
const FretDrawer = require('../controllers/fretDrawer')
const fretDrawer = new FretDrawer()
const express = require('express')
const router = express.Router()

let patterns = getPatterns()
let notes = new Notes().getNotes()
let tunings = getTunings()

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', {
    title: 'Guitar Scales',
    patterns: patterns,
    notes: notes,
    tunings: tunings
  })
})

/* GET fretboard png in base64 string format. */
router.get('/:tuning/:pattern/:note', function (req, res) {
  res.contentType = 'base64'
  let tuningArray = decodeURI(req.params.tuning).replace('[', '').replace(']', '').split(',')
  res.send(fretDrawer.drawFretboard(tuningArray, decodeURI(req.params.pattern), decodeURI(req.params.note)))
})

module.exports = router
