export class ImportStatement {

    constructor(
        path,
        alias = null
    ) {

        this.path = path;
        this.alias = alias;
    }
}