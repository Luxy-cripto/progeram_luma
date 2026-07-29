import fs from "fs";
import { Lexer } from "./lexer/Lexer.js";
import { Parser } from "./parser/Parser.js";
import { Interpreter } from "./interpreter/Interpreter.js";
import { Resolver } from "./resolver/Resolver.js";

const source = fs.readFileSync("test.luma", "utf-8");

// Lexer
const lexer = new Lexer(source);
const tokens = lexer.scanTokens();

// Parser
const parser = new Parser(tokens);
const statements = parser.parse();

// Interpreter
const interpreter = new Interpreter();

// Resolver
const resolver = new Resolver(interpreter);
resolver.resolve(
    statements
);

// Debug
const DEBUG = false;

if (DEBUG) {
    console.log("Tokens:");
    for (const token of tokens) {
        console.log(token);
    }

    console.log("Statements:");
    for (const stmt of statements) {
        console.dir(stmt, { depth: null });
    }
}


interpreter.interpret(statements);