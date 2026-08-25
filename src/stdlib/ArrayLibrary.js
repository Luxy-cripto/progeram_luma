import { NativeFunction } from "../interpreter/NativeFunction.js";

export function registerArrayLibrary(env) {

    env.define(
        "push",
        new NativeFunction(args => {

            args[0].push(args[1]);

            return null;

        })
    );

    env.define(
        "pop",
        new NativeFunction(args => {

            return args[0].pop();

        })
    );

    env.define(
        "first",
        new NativeFunction(args => {

            return args[0][0];

        })
    );

    env.define(
        "last",
        new NativeFunction(args => {

            return args[0][args[0].length - 1];

        })
    );

    env.define(
        "clear",
        new NativeFunction(args => {

            args[0].length = 0;

            return null;

        })
    );
}