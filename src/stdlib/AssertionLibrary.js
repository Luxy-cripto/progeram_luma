import { NativeFunction } from "../interpreter/NativeFunction.js";

export function registerAssertionLibrary(env) {

    env.define(
        "assert",
        new NativeFunction(args => {

            const condition = args[0];

            if (!condition) {

                const message =
                    args.length > 1
                        ? String(args[1])
                        : "Assertion failed.";

                throw new Error(message);
            }

            return null;
        })
    );
}