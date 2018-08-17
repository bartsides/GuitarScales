class Notes {
    constructor() {
        this.notes = {    
            A:   1,
            As:  2,
            B:   3,
            C:   4,
            Cs:  5,
            D:   6,
            Ds:  7,
            E:   8,
            F:   9,
            Fs: 10,
            G:  11,
            Gs: 12
        }
    }
    getNote(index) {
        if (index < 1) {
            index += 12;
        }
        let note = Object.keys(this.notes)[(index-1)%12].replace('s', '#');
        if (note.length == 1) {
            note += ' ';
        }
        return note;
    }
    getNotes() {
        let results = [];
        for (let i = 1; i < 13; i++) {
            results.push(this.getNote(i));
        }
        return results;
    }
}

module.exports = Notes;