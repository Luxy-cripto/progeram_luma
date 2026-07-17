import { TokenType } from "../token/TokenType.js";
import { VariableDeclaration } from "../ast/VariableDeclaration.js";
import { SayStatement } from "../ast/SayStatement.js";
import { Literal } from "../ast/Literal.js";
import { Identifier } from "../ast/Identifier.js";
import { BinaryExpression } from "../ast/BinaryExpression.js";
import { UnaryExpression } from "../ast/UnaryExpression.js";

export class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
    }

    isAtEnd() {
        return this.peek().type === TokenType.EOF;
    }

    peek() {
        return this.tokens[this.current];
    }

    previous() {
        return this.tokens[this.current - 1];
    }

    advance() {
        if (!this.isAtEnd()) {
            this.current++;
        }
        return this.previous();
    }

    check(type) {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    match(...types) {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    consume(type, message) {
        if (this.check(type)) {
            return this.advance();
        }

        throw new Error(message);
    }

    unary(){
        if (this.match(TokenType.MINUS)) {
            const operator = this.previous();
            const right = this.unary();

            return new UnaryExpression(
                operator.type,
                right
            );
        }

        return this.primary();
    }

    // =========================
    // PROGRAM
    // =========================

    parse() {
        const statements = [];

        while (!this.isAtEnd()) {
            statements.push(this.statement());
        }

        return statements;
    }

    statement() {
        if (this.match(TokenType.LET)) {
            return this.variableDeclaration();
        }

        if (this.match(TokenType.SAY)) {
            return this.sayStatement();
        }

        throw new Error(`Unexpected token ${this.peek().type}`);
    }

    // =========================
    // STATEMENTS
    // =========================

    variableDeclaration() {
        const name = this.consume(
            TokenType.IDENTIFIER,
            "Expected variable name."
        );

        this.consume(
            TokenType.EQUAL,
            "Expected '='."
        );

        const initializer = this.expression();

        return new VariableDeclaration(
            name.value,
            initializer
        );
    }

    sayStatement() {
        return new SayStatement(
            this.expression()
        );
    }

    // =========================
    // EXPRESSIONS
    // =========================

    expression() {
        return this.addition();
    }

    addition() {
        let expr = this.multiplication();

        while (this.match(TokenType.PLUS, TokenType.MINUS)) {
            const operator = this.previous();
            const right = this.multiplication();

            expr = new BinaryExpression(
                expr,
                operator.type,
                right
            );
        }

        return expr;
    }

    multiplication() {

        let expr = this.unary();

        while (this.match(TokenType.STAR, TokenType.SLASH)) {

            const operator = this.previous();

            const right = this.unary();

            expr = new BinaryExpression(
                expr,
                operator.type,
                right
            );
        }

        return expr;
    }

    primary() {

        if (this.match(TokenType.NUMBER, TokenType.STRING)) {
            return new Literal(this.previous().value);
        }

        if (this.match(TokenType.IDENTIFIER)) {
            return new Identifier(this.previous().value);
        }

        if (this.match(TokenType.LEFT_PAREN)) {

            const expr = this.expression();

            this.consume(
                TokenType.RIGHT_PAREN,
                "Expected ')' after expression."
            );

            return expr;
        }

        throw new Error("Expected expression.");
    }
}