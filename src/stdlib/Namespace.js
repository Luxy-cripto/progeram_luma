import fs from "fs";
import { NativeFunction } from "../interpreter/NativeFunction.js";


export function createMathNamespace() {

    return {

        sqrt: new NativeFunction(args => {
            return Math.sqrt(args[0]);
        }),

        pow: new NativeFunction(args => {
            return Math.pow(args[0], args[1]);
        }),

        abs: new NativeFunction(args => {
            return Math.abs(args[0]);
        })
    };
}


export function createStringNamespace() {

    return {

        upper: new NativeFunction(args => {
            return String(args[0]).toUpperCase();
        }),

        lower: new NativeFunction(args => {
            return String(args[0]).toLowerCase();
        }),

        trim: new NativeFunction(args => {
            return String(args[0]).trim();
        }),

        contains: new NativeFunction(args => {
            return String(args[0]).includes(
                String(args[1])
            );
        }),

        replace: new NativeFunction(args => {
            return String(args[0]).replace(
                String(args[1]),
                String(args[2])
            );
        }),

        split: new NativeFunction(args => {
            return String(args[0]).split(
                args[1]
            );
        }),

        join: new NativeFunction(args => {
            return args[0].join(
                args[1]
            );
        })
    };
}


export function createJsonNamespace() {

    return {

        parse: new NativeFunction(args => {
            return JSON.parse(
                args[0]
            );
        }),

        stringify: new NativeFunction(args => {
            return JSON.stringify(
                args[0]
            );
        }),

        keys: new NativeFunction(args => {
            return Object.keys(
                args[0]
            );
        }),

        values: new NativeFunction(args => {
            return Object.values(
                args[0]
            );
        }),

        has: new NativeFunction(args => {
            return Object.prototype.hasOwnProperty.call(
                args[0],
                args[1]
            );
        })
    };
}

export function createFileNamespace() {

    return {

        read: new NativeFunction(args => {

            return fs.readFileSync(
                args[0],
                "utf8"
            );

        }),

        write: new NativeFunction(args => {

            fs.writeFileSync(
                args[0],
                String(args[1])
            );

            return null;

        }),

        append: new NativeFunction(args => {

            fs.appendFileSync(
                args[0],
                String(args[1])
            );

            return null;

        }),

        exists: new NativeFunction(args => {

            return fs.existsSync(
                args[0]
            );

        }),

        delete: new NativeFunction(args => {

            if (
                fs.existsSync(args[0])
            ) {

                fs.unlinkSync(
                    args[0]
                );

            }

            return null;

        })
    };
}