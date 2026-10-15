import { LumaError } from "./LumaError.js";

export class LumaTypeError extends LumaError {

    constructor(message) {

        super(
            message,
            "TypeError"
        );

    }

}