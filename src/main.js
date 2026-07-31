#!/usr/bin/env node

import fs from "fs";
import readline from "readline";

import { Lexer } from "./lexer/Lexer.js";
import { Parser } from "./parser/Parser.js";
import { Interpreter } from "./interpreter/Interpreter.js";
import { Resolver } from "./resolver/Resolver.js";

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
        "Luma REPL v0.4"
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
            "> ",
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