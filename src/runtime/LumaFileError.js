import { LumaError } from "./LumaError.js";

export class LumaFileError extends LumaError {

    constructor(message) {

        super(
            message,
            "FileError"
        );

    }

}