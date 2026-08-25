import { NativeFunction } from "../interpreter/NativeFunction.js";

export function registerMathLibrary(env) {

    env.define(
        "sqrt",
        new NativeFunction(args => {
            return Math.sqrt(args[0]);
        })
    );

    env.define(
        "pow",
        new NativeFunction(args => {
            return Math.pow(
                args[0],
                args[1]
            );
        })
    );

    env.define(
        "floor",
        new NativeFunction(args => {
            return Math.floor(args[0]);
        })
    );

    env.define(
        "ceil",
        new NativeFunction(args => {
            return Math.ceil(args[0]);
        })
    );

    env.define(
        "round",
        new NativeFunction(args => {
            return Math.round(args[0]);
        })
    );

    env.define(
        "abs",
        new NativeFunction(args => {
            return Math.abs(args[0]);
        })
    );

    env.define(
        "min",
        new NativeFunction(args => {
            return Math.min(...args);
        })
    );

    env.define(
        "max",
        new NativeFunction(args => {
            return Math.max(...args);
        })
    );

    env.define(
        "random",
        new NativeFunction(() => {
            return Math.random();
        })
    );
}