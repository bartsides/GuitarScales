module.exports = class FretDrawer {
  drawFretboard (pattern, note) {
    const PImage = require('pureimage')
    const fs = require('fs')
    const path = require('path')
    const opentype = require('opentype.js')
    const getNotes = require('./scales').getNotes
    const Notes = require('../models/notes')
    const notesEnum = new Notes()
    const helveticaLoc = path.resolve(`${__dirname}/../public/fonts/helvetica.ttf`)
    const imgLoc = path.resolve(`${__dirname}/../public/images/fretboard.png`)

    const width = 1000
    const height = 300
    const markerScale = 0.7
    const nutX = 44
    const openStringX = nutX - 22
    const neckTop = 30
    const neckBottom = 230
    const neckLength = width - nutX * 2
    const fretNumberingY = neckTop - 6
    const frets = 23
    const fontSize = '12pt'
    const openStringFontSize = '20pt'
    const fontFamily = 'Helvetica'
    const white = '#ffffff'
    const black = '#000000'
    const blue = '#4d94ff'

    // Guitar tuning highest note to lowest
    let strings = ['E', 'B', 'G', 'D', 'A', 'E']
    let font = PImage.registerFont(helveticaLoc, fontFamily)
    font.font = opentype.loadSync(font.binary)
    font.loaded = true

    // Initialize picture with white background
    let img = PImage.make(width, height)
    let c = img.getContext('2d')
    c.fillStyle = white
    c.fillRect(0, 0, width, height)

    // Notes in scale
    let notes = getNotes(pattern, note)

    let stringDistance = (neckBottom - neckTop) / strings.length
    let lastX = nutX
    let endOfFretboard = this.fretLocation(frets - 1, neckLength)

    for (let i = 0; i < frets; i++) {
      let ratio = this.fretLocation(i, neckLength) / endOfFretboard
      let x = i === 0 ? nutX : nutX + ratio * neckLength

      // Draw Fret Number
      c.fillStyle = black
      c.font = `${fontSize} ${fontFamily}`
      c.fillText(String(i), i === 0 ? openStringX + 4 : ((lastX + x) / 2) - 4, fretNumberingY)

      for (let j = 0; j < strings.length; j++) {
        let fretNote = notesEnum.getNote(i + notesEnum.notes[strings[j]])

        if (notes.includes(fretNote)) {
          // Fret note is in scale
          let rectX = (i === 0 ? openStringX - 6 : lastX) + 1
          let rectW = i === 0 ? nutX - 19 : x - lastX - 1
          let rectH = stringDistance - 1
          let rectY = (neckTop + stringDistance * (j + 1)) - rectH

          let noteX = i === 0 ? openStringX : rectX + rectW / 2 - 8
          let noteY = rectY + rectH / 2 + 4

          if (markerScale !== 1) {
            // Scale marker
            rectX += ((1 - markerScale) * rectW) / 2
            rectY += ((1 - markerScale) * rectH) / 2
            rectW *= markerScale
            rectH *= markerScale
          }

          // Draw fret location in scale
          c.fillStyle = blue
          c.fillRect(rectX, rectY, rectW, rectH)

          // Draw note
          if (fretNote.length === 1) {
            fretNote = ' ' + fretNote
          }
          c.fillStyle = white
          c.font = `${fontSize} ${fontFamily}`
          c.fillText(fretNote, noteX, noteY)
        }
      }

      if (i !== 0) {
        c.fillStyle = black
        c.drawLine({ start: {x: x, y: neckTop}, end: {x: x, y: neckBottom} })
      }

      lastX = x
    }

    // Fretboard outlines
    c.fillStyle = black
    c.drawLine({ start: { x: nutX, y: neckTop }, end: { x: nutX + neckLength, y: neckTop } })
    c.drawLine({ start: { x: nutX, y: neckBottom }, end: { x: nutX + neckLength, y: neckBottom } })
    c.drawLine({ start: { x: nutX, y: neckTop }, end: { x: nutX, y: neckBottom } })
    c.drawLine({ start: { x: nutX + neckLength, y: neckTop }, end: { x: nutX + neckLength, y: neckBottom } })

    for (let i = 0; i < strings.length; i++) {
      let openNote = strings[i]
      let stringY = neckTop + stringDistance * (i + 1)

      // Draw string separator
      if (i !== strings.length - 1) {
        c.fillStyle = black
        c.drawLine({ start: {x: nutX, y: stringY}, end: {x: nutX + neckLength, y: stringY} })
      }

      // Draw open string note
      c.fillStyle = black
      c.font = `${openStringFontSize} ${fontFamily}`
      c.fillText(openNote, openStringX - 20, stringY - stringDistance * 0.25)
    }

    c.fillStyle = black
    c.drawLine({ start: {x: openStringX - 6, y: neckTop}, end: {x: openStringX - 6, y: neckBottom} })

    return PImage.encodePNGToStream(img, fs.createWriteStream(imgLoc)).then(() => {
      return Promise.resolve(fs.readFileSync(imgLoc, {encoding: 'base64'}))
    }).catch((err) => { console.log(err) })
  }
  fretLocation (fretNumber, neckLength) {
    return neckLength - (neckLength / (Math.pow(2, fretNumber / 12)))
  }
}
