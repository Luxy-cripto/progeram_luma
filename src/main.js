#!/usr/bin/env node

import fs from "fs";
import readline from "readline";

import { Lexer } from "./lexer/Lexer.js";
import { Parser } from "./parser/Parser.js";
import { Interpreter } from "./interpreter/Interpreter.js";
import { Resolver } from "./resolver/Resolver.js";

const cyan = "\x1b[36m";
const yellow = "\x1b[33m";
const green = "\x1b[32m";
const reset = "\x1b[0m";

function run(source, interpreter) {

    const lexer =
        new Lexer(source);

    const tokens =
        lexer.scanTokens();

    const parser =
        new Parser(tokens);

    const statements =
        parser.parse();

    const resolver =
        new Resolver(interpreter);

    resolver.resolve(
        statements
    );

    interpreter.interpret(
        statements
    );
}

const file =
    process.argv[2];

if (file) {

    try {

        const source =
            fs.readFileSync(
                file,
                "utf8"
            );

        const interpreter =
            new Interpreter();

        run(
            source,
            interpreter
        );

        process.exit(0);

    } catch (error) {

        console.error(
            "\n[Luma Error]"
        );

        console.error(
            error.message
        );

        process.exit(1);
    }

} else {

    console.log(
        cyan +
`
██╗     ██╗   ██╗███╗   ███╗ █████╗
██║     ██║   ██║████╗ ████║██╔══██╗
██║     ██║   ██║██╔████╔██║███████║
██║     ██║   ██║██║╚██╔╝██║██╔══██║
███████╗╚██████╔╝██║ ╚═╝ ██║██║  ██║
`
        + reset +
        yellow +
`
Luma Programming Language v0.5.0
`
        + reset
    );

    const rl =
        readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

    const interpreter =
        new Interpreter();

    function prompt() {

        rl.question(
            green + "luma> " + reset,
            line => {

                try {

                    run(
                        line,
                        interpreter
                    );

                } catch (error) {

                    console.error(
                        error.message
                    );
                }

                prompt();
            }
        );
    }

    prompt();
}