import { NativeFunction } from "../interpreter/NativeFunction.js";

export function registerStringLibrary(env) {

    env.define(
        "upper",
        new NativeFunction(args => {
            return String(args[0]).toUpperCase();
        })
    );

    env.define(
        "lower",
        new NativeFunction(args => {
            return String(args[0]).toLowerCase();
        })
    );

    env.define(
        "trim",
        new NativeFunction(args => {
            return String(args[0]).trim();
        })
    );

    env.define(
        "contains",
        new NativeFunction(args => {
            return String(args[0]).includes(
                String(args[1])
            );
        })
    );

    env.define(
        "replace",
        new NativeFunction(args => {
            return String(args[0]).replace(
                String(args[1]),
                String(args[2])
            );
        })
    );

    env.define(
        "split",
        new NativeFunction(args => {
            return String(args[0]).split(
                args[1]
            );
        })
    );

    env.define(
        "join",
        new NativeFunction(args => {
            return args[0].join(
                args[1]
            );
        })
    );
}