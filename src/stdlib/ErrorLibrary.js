import { NativeFunction } from "../interpreter/NativeFunction.js";
import { LumaError } from "../runtime/LumaError.js";
import { LumaTypeError } from "../runtime/LumaTypeError.js";
import { LumaValueError } from "../runtime/LumaValueError.js";
import { LumaFileError } from "../runtime/LumaFileError.js";

export function registerErrorLibrary(env) {

    env.define(
        "Error",
        new NativeFunction(args => {

            return new LumaError(
                String(args[0] ?? "")
            );

        })
    );

    env.define(
        "TypeError",
        new NativeFunction(args => {

            return new LumaTypeError(
                String(args[0] ?? "")
            );

        })
    );

    env.define(
        "ValueError",
        new NativeFunction(args => {

            return new LumaValueError(
                String(args[0] ?? "")
            );

        })
    );

    env.define(
        "FileError",
        new NativeFunction(args => {

            return new LumaFileError(
                String(args[0] ?? "")
            );

        })
    );

}