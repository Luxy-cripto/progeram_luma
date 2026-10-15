import fs from "fs";
import { NativeFunction } from "../interpreter/NativeFunction.js";
import { LumaFileError } from "../runtime/LumaFileError.js";


export function registerFileLibrary(env) {

    env.define(
        "read",
        new NativeFunction(args => {

            try {

                return fs.readFileSync(
                    args[0],
                    "utf8"
                );

            } catch (error) {

                throw new LumaFileError(
                    `File tidak ditemukan: ${args[0]}`
                );

            }

        })
    );

    env.define(
        "write",
        new NativeFunction(args => {

            try {

                fs.writeFileSync(
                    args[0],
                    String(args[1])
                );

                return null;

            } catch (error) {

                throw new LumaFileError(
                    `Gagal menulis file: ${args[0]}`
                );

            }

        })
    );

    env.define(
        "append",
        new NativeFunction(args => {

            try {

                fs.appendFileSync(
                    args[0],
                    String(args[1])
                );

                return null;

            } catch (error) {

                throw new LumaFileError(
                    `Gagal menambahkan ke file: ${args[0]}`
                );

            }

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

            try {

                if (
                    fs.existsSync(args[0])
                ) {

                    fs.unlinkSync(
                        args[0]
                    );

                }

                return null;

            } catch (error) {

                throw new LumaFileError(
                    `Gagal menghapus file: ${args[0]}`
                );

            }

        })
    );

}