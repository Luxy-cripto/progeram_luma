export class LumaError extends Error {

    constructor(message, type = "Error") {

        super(message);

        this.name = type;
        this.type = type;

    }

}