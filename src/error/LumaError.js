export class LumaError extends Error {

    constructor(
        message,
        token = null
    ) {

        super(message);

        this.token =
            token;
    }
}