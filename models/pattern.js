module.exports = class Pattern {
    constructor(name, pattern) {
        this.name = name;
        this.pattern = pattern;
    }
    toJSON() {
        return {
            name: this.name,
            pattern: this.pattern
        };
    }
};