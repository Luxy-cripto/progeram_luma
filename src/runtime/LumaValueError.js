import { LumaError } from "./LumaError.js";

export class LumaValueError extends LumaError {

    constructor(message) {

        super(
            message,
            "ValueError"
        );

    }

}