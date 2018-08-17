module.exports = class FretDrawer {
    drawFretboard(pattern, note) {
        let 
            PImage = require('pureimage'),
            fs = require('fs'),
            path = require('path'),
            getNotes = require('./scales').getNotes,
            Notes = require('../models/notes'),
            notesEnum = new Notes();

        let 
            width = 1000,
            height = 300,
            nutX = 44,
            neckTop = 30,
            neckBottom = 230,
            neckLength = width - nutX*2,
            frets = 23;

        const
            white = 'rgb(255,255,255)',
            black = 'rgb(0,0,0)';

        let strings = ['E', 'B', 'G', 'D', 'A', 'E'];

        let imgLoc = path.resolve(`${__dirname}/../public/images/fretboard.png`);
        let img = PImage.make(width, height);
        let c = img.getContext('2d');
        c.fillStyle = white;
        c.fillRect(0,0,width, height);
        //let font = PImage.registerFont(path.resolve(`${__dirname}/../public/fonts/helvetica.ttf`), 'Helvetica');
        //font.load(() => {
        //c.font = "10pt 'Helvetica'";

        let notes = getNotes(pattern, note);

        let fretNumberY = neckTop - 20;
        let openStringX = nutX - 22;

        let stringDistance = (neckBottom - neckTop) / strings.length;

        let lastX = nutX;
        let endOfFretboard = this.fretLocation(frets - 1, neckLength);

        for (let i = 0; i < frets; i++) {
            let ratio = this.fretLocation(i, neckLength) / endOfFretboard;
            let x = i == 0 ? nutX : nutX + ratio * neckLength;

            // Draw Fret Number
            c.fillStyle = black;
            //c.fillText(i, i == 0 ? openStringX : (lastX + x) / 2);
            for (let j = 0; j < strings.length; j++) {
                let fretNote = notesEnum.getNote(i+notesEnum.notes[strings[j]]);

                let stringY = neckTop + stringDistance * (j + 1);
                if (j != strings.length - 1) {
                    c.fillStyle = black;
                    c.drawLine({ start: {x: nutX, y: stringY}, end: {x: nutX + neckLength, y: stringY} });
                }

                // Fret note is in scale
                if (notes.includes(fretNote)){
                    let rectX = (i == 0 ? openStringX - 6 : lastX) + 1;
                    let rectW = i == 0 ? (nutX-2)/2 : x - lastX;
                    let rectH = stringDistance;
                    let rectY = (neckTop + stringDistance * (j+1)) + 1 - rectH;
                    //let rectW = (i == 0 ? (nutX-2)/2 : x - lastX) - 2;
                    //let rectH = rectY - (neckTop + stringDistance * (j) - stringY)+2;
                    console.log(`(${rectX},${rectY}) ${rectW}x${rectH}    ${x}`);
                    c.fillStyle = black;
                    c.fillRect(rectX, rectY, rectW, rectH);
                }
            }

            if (i != 0) {
                c.drawLine({ start: {x: x, y: neckTop}, end: {x: x, y: neckBottom} });
            }

            lastX = x;
        }

        // Fretboard outlines
        c.drawLine({ start: {x: nutX, y: neckTop},              end: {x: nutX + neckLength, y: neckTop}});
        c.drawLine({ start: {x: nutX, y: neckBottom},           end: {x: nutX + neckLength, y: neckBottom}});
        c.drawLine({ start: {x: nutX, y: neckTop},              end: {x: nutX, y: neckBottom}});
        c.drawLine({ start: {x: nutX + neckLength, y: neckTop}, end: {x: nutX + neckLength, y: neckBottom}});

        return PImage.encodePNGToStream(img, fs.createWriteStream(imgLoc)).then(() => {
            return Promise.resolve(fs.readFileSync(imgLoc, {encoding: 'base64'}));
        }).catch((err) => {console.log(err)});
    }
    fretLocation(fretNumber, neckLength) {
        return neckLength - (neckLength / (Math.pow(2, fretNumber / 12)));
    }
}