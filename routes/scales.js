const
  express = require('express'),
  router = express.Router(),
  patterns = require('./patterns'),
  { findScale, getNotes } = require('../controllers/scales'),
  Notes = require('../models/notes'),
  notes = new Notes();


// Get scale
router.get('/:pattern/:note', function(req, res) {
  res.send(getNotes(req.params.pattern, req.params.note));
});

module.exports = router;