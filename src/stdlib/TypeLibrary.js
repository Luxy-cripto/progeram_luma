import { NativeFunction } from "../interpreter/NativeFunction.js";

export function registerTypeLibrary(env) {

    env.define(
        "isType",
        new NativeFunction(args => {

            const value = args[0];
            const expected =
                String(args[1]);

            if (expected === "array") {

                return Array.isArray(
                    value
                );
            }

            if (expected === "null") {

                return value === null;
            }

            if (expected === "object") {

                return (
                    value !== null &&
                    typeof value === "object" &&
                    !Array.isArray(value)
                );
            }

            return (
                typeof value === expected
            );
        })
    );
}