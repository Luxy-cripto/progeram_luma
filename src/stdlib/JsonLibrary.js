import { NativeFunction } from "../interpreter/NativeFunction.js";

export function registerJsonLibrary(env) {

    env.define(
        "jsonParse",
        new NativeFunction(args => {

            return JSON.parse(
                args[0]
            );

        })
    );

    env.define(
        "jsonStringify",
        new NativeFunction(args => {

            return JSON.stringify(
                args[0]
            );

        })
    );

    env.define(
        "keys",
        new NativeFunction(args => {

            return Object.keys(
                args[0]
            );

        })
    );

    env.define(
        "values",
        new NativeFunction(args => {

            return Object.values(
                args[0]
            );

        })
    );

    env.define(
        "has",
        new NativeFunction(args => {

            return Object.prototype.hasOwnProperty.call(
                args[0],
                args[1]
            );

        })
    );

}