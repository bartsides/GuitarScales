const 
  fs = require('fs'),
  getPatterns = require('../controllers/patterns').getPatterns,
  Notes = require('../models/notes'),
  FretDrawer = require('../controllers/fretDrawer'),
  fretDrawer = new FretDrawer(),
  express = require('express'),
  router = express.Router();

let patterns = getPatterns();
let notes = new Notes().getNotes();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { 
    title: 'Guitar Scales', 
    patterns: patterns,
    notes: notes
  });
});

router.get('/:pattern/:note', function(req, res) {
  fretDrawer.drawFretboard(req.params.pattern, req.params.note).then(function(result) {
    res.contentType = 'base64';
    res.send(result);
  });
});

module.exports = router;