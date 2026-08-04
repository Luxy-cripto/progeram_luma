export class Identifier {

    constructor(
        name,
        line = null,
        column = null
    ) {

        this.name = name;
        this.line = line;
        this.column = column;
    }
}