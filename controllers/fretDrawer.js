module.exports = class FretDrawer {
  drawFretboard (tuning, pattern, note) {
    const Canvas = require('canvas-prebuilt')
    const canvas = new Canvas()
    const getNotes = require('./scales').getNotes
    const Notes = require('../models/notes')
    const notesEnum = new Notes()

    
    const stringDistance = 35
    const width = 1000
    const markerScale = 0.74
    const nutX = 44
    const openStringX = nutX - 20
    const neckTop = 30
    const neckLength = width - nutX * 2
    const fretNumberingY = neckTop - 4
    const frets = 23
    const fontSize = '9pt'
    const openStringFontSize = '16pt'
    const fontFamily = 'Helvetica'
    const white = '#ffffff'
    const black = '#000000'
    const blue = '#2980b9'

    // Guitar tuning highest note to lowest
    let strings = tuning.reverse()
    let height = stringDistance * strings.length + 50
    let neckBottom = neckTop + stringDistance * strings.length

    // Notes in scale
    let notes = getNotes(pattern, note)

    // Initialize picture with white background
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = white
    ctx.fillRect(0, 0, width, height)


    let lastX = nutX
    let endOfFretboard = this.fretLocation(frets - 1, neckLength)

    for (let i = 0; i < frets; i++) {
      let ratio = this.fretLocation(i, neckLength) / endOfFretboard
      let x = i === 0 ? nutX : nutX + ratio * neckLength

      // Draw Fret Number
      ctx.fillStyle = black
      ctx.font = `${fontSize} ${fontFamily}`
      let fretNumString = i < 10 ? ' ' + i : String(i)
      ctx.fillText(fretNumString, i === 0 ? openStringX + 4 : ((lastX + x) / 2) - 6, fretNumberingY)

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
          ctx.fillStyle = blue
          ctx.fillRect(rectX, rectY, rectW, rectH)

          // Draw note
          if (fretNote.length === 1) {
            fretNote = ' ' + fretNote
          }
          ctx.fillStyle = white
          ctx.font = `${fontSize} ${fontFamily}`
          ctx.fillText(fretNote, noteX, noteY)
        }
      }

      if (i !== 0) {
        ctx.fillStyle = black
        this.drawLine(ctx, x, neckTop, x, neckBottom)
      }

      lastX = x
    }

    // Fretboard outlines
    ctx.fillStyle = black
    this.drawLine(ctx, nutX, neckTop, nutX + neckLength, neckTop)
    this.drawLine(ctx, nutX, neckBottom, nutX + neckLength, neckBottom)
    this.drawLine(ctx, nutX, neckTop, nutX, neckBottom)
    this.drawLine(ctx, nutX + neckLength, neckTop, nutX + neckLength, neckBottom)

    for (let i = 0; i < strings.length; i++) {
      let openNote = strings[i]
      let stringY = neckTop + stringDistance * (i + 1)

      // Draw string separator
      if (i !== strings.length - 1) {
        ctx.fillStyle = black
        this.drawLine(ctx, nutX, stringY, nutX + neckLength, stringY)
      }

      // Draw open string note
      ctx.fillStyle = black
      ctx.font = `${openStringFontSize} ${fontFamily}`
      ctx.fillText(openNote, openStringX - 24, stringY - stringDistance * 0.25)
    }

    ctx.fillStyle = black
    this.drawLine(ctx, openStringX - 6, neckTop, openStringX - 6, neckBottom)

    return canvas.toDataURL(['image/png', null, null])
  }
  fretLocation (fretNumber, neckLength) {
    return neckLength - (neckLength / (Math.pow(2, fretNumber / 12)))
  }
  drawLine (ctx, startX, startY, endX, endY) {
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()
  }
}
