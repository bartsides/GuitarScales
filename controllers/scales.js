const Notes = require('../models/notes')
const notes = new Notes()

module.exports = {
  getNotes: function (pattern, note) {
    let result = []
    pattern.split(',').forEach(e => {
      let mod = notes.notes[note.replace(' ', '')]
      if (e.includes('b')) { mod -= 1 }
      if (e.includes('s')) { mod += 1 }

      // Skip 1 as it is the first note and has a mod of 0.
      if (e.includes('2')) {
        mod += 2
      } else if (e.includes('3')) {
        mod += 4
      } else if (e.includes('4')) {
        mod += 5
      } else if (e.includes('5')) {
        mod += 7
      } else if (e.includes('6')) {
        mod += 9
      } else if (e.includes('7')) {
        mod += 11
      }

      result.push(notes.getNote(mod))
    })
    return result
  }
}
