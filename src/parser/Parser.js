import { TokenType } from "../token/TokenType.js";
import { VariableDeclaration } from "../ast/VariableDeclaration.js";
import { SayStatement } from "../ast/SayStatement.js";
import { Literal } from "../ast/Literal.js";
import { Identifier } from "../ast/Identifier.js";
import { BinaryExpression } from "../ast/BinaryExpression.js";
import { UnaryExpression } from "../ast/UnaryExpression.js";
import { BlockStatement } from "../ast/BlockStatement.js";
import { IfStatement } from "../ast/IfStatement.js";
import { WhileStatement } from "../ast/WhileStatement.js";
import { Assignment } from "../ast/Assignment.js";
import { ExpressionStatement } from "../ast/ExpressionStatement.js";
import { FunctionDeclaration } from "../ast/FunctionDeclaration.js";
import { CallExpression } from "../ast/CallExpression.js";

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

    whileStatement() {

        const condition =
            this.expression();

        const body =
            this.block();

        return new WhileStatement(
            condition,
            body
        );
    }

    unary() {

    if (this.match(TokenType.MINUS)) {

            const operator =
                this.previous();

            const right =
                this.unary();

            return new UnaryExpression(
                operator.type,
                right
            );
        }

        return this.call();
    }


    functionDeclaration() {

        const name = this.consume(
            TokenType.IDENTIFIER,
            "Expected function name."
        );

        this.consume(
            TokenType.LEFT_PAREN,
            "Expected '(' after function name."
        );

        const params = [];

        if (!this.check(TokenType.RIGHT_PAREN)) {

            do {

                params.push(
                    this.consume(
                        TokenType.IDENTIFIER,
                        "Expected parameter name."
                    ).value
                );

            } while (this.match(TokenType.COMMA));

        }

        this.consume(
            TokenType.RIGHT_PAREN,
            "Expected ')'."
        );

        const body = this.block();

        return new FunctionDeclaration(
            name.value,
            params,
            body
        );
    }

    call() {

        let expr = this.primary();

        while (true) {

            if (this.match(TokenType.LEFT_PAREN)) {

                const args = [];

                if (!this.check(TokenType.RIGHT_PAREN)) {

                    do {

                        args.push(
                            this.expression()
                        );

                    } while (
                        this.match(TokenType.COMMA)
                    );

                }

                this.consume(
                    TokenType.RIGHT_PAREN,
                    "Expected ')'."
                );

                expr = new CallExpression(
                    expr,
                    args
                );

            } else {
                break;
            }
        }

        return expr;
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

        if (this.match(TokenType.FUN)) {
            return this.functionDeclaration();
        }

        if (this.match(TokenType.SAY)) {
            return this.sayStatement();
        }

        if (this.match(TokenType.IF)) {
            return this.ifStatement();
        }

        if (this.match(TokenType.WHILE)) {
            return this.whileStatement();
        }

        return new ExpressionStatement(
            this.expression()
        );
    }

    ifStatement() {

        const condition = this.expression();

        const thenBranch = this.block();

        let elseBranch = null;

        if (this.match(TokenType.ELSE)) {

            if (this.match(TokenType.IF)) {

                elseBranch = this.ifStatement();

            } else {

                elseBranch = this.block();

            }
        }

        return new IfStatement(
            condition,
            thenBranch,
            elseBranch
        );
    }

    block(){
        this.consume(
            TokenType.LEFT_BRACE,
            "Expected '{'."
        );

        const statements = [];

        while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            statements.push(this.statement());
        }

        this.consume(
            TokenType.RIGHT_BRACE,
            "Expected '}'."
        );

        return new BlockStatement(statements);
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
    
    expression() {
        return this.assignment();
    }
    
    assignment() {

        const expr = this.equality();

        if (this.match(TokenType.EQUAL)) {

            const value =
                this.assignment();

            if (expr instanceof Identifier) {

                return new Assignment(
                    expr.name,
                    value
                );
            }

            throw new Error(
                "Invalid assignment target."
            );
        }

        return expr;
    }

    equality() {
        let expr = this.comparison();

        while (
            this.match(
                TokenType.BANG_EQUAL,
                TokenType.EQUAL_EQUAL
            )
        ) {
            const operator = this.previous();
            const right = this.comparison();

            expr = new BinaryExpression(
                expr,
                operator.type,
                right
            );
        }

        return expr;
    }
        
    comparison(){
        let expr = this.addition();

        while (
            this.match(
                TokenType.GREATER,
                TokenType.GREATER_EQUAL,
                TokenType.LESS,
                TokenType.LESS_EQUAL
            )
        ) {
            const operator = this.previous();
            const right = this.addition();

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

        if (this.match(TokenType.TRUE)) {
            return new Literal(true);
        }

        if (this.match(TokenType.FALSE)) {
            return new Literal(false);
        }

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

        throw new Error(
            "Expected expression."
        );
    }
}