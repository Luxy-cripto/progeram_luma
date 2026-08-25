import fs from "fs";
import { NativeFunction } from "../interpreter/NativeFunction.js";

export function registerFileLibrary(env) {

    env.define(
        "read",
        new NativeFunction(args => {
            return fs.readFileSync(
                args[0],
                "utf8"
            );
        })
    );

    env.define(
        "write",
        new NativeFunction(args => {

            fs.writeFileSync(
                args[0],
                String(args[1])
            );

            return null;
        })
    );

    env.define(
        "append",
        new NativeFunction(args => {

            fs.appendFileSync(
                args[0],
                String(args[1])
            );

            return null;
        })
    );

    env.define(
        "exists",
        new NativeFunction(args => {

            return fs.existsSync(
                args[0]
            );

        })
    );

    env.define(
        "delete",
        new NativeFunction(args => {

            if (
                fs.existsSync(args[0])
            ) {

                fs.unlinkSync(
                    args[0]
                );
            }

            return null;
        })
    );

}