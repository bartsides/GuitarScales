module.exports = class Scale {
    constructor(note, pattern) {
        this.note = note;
        this.pattern = pattern;
    }
    toJSON() {
        return {
            note: this.note,
            pattern: this.pattern
        };
    }
}