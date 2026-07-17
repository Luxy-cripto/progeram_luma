import fs from "fs";
import { Lexer } from "./lexer/Lexer.js";
import { Parser } from "./parser/Parser.js";
import { Interpreter } from "./interpreter/Interpreter.js";

const source = fs.readFileSync("test.luma", "utf-8");

// Lexer
const lexer = new Lexer(source);
const tokens = lexer.scanTokens();

// Parser
const parser = new Parser(tokens);
const statements = parser.parse();

// Debug
console.log("Tokens:");
for (const token of tokens) {
    console.log(token);
}

console.log("Statements:");
for (const statement of statements) {
    console.log(statement);
}

// Interpreter
const interpreter = new Interpreter();
interpreter.interpret(statements);