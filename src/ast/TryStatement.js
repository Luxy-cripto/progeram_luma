export class TryStatement {

    constructor(
        tryBlock,
        errorName,
        catchBlock
    ) {

        this.tryBlock =
            tryBlock;

        this.errorName =
            errorName;

        this.catchBlock =
            catchBlock;
    }
}