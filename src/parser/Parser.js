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
import { ReturnStatement } from "../ast/ReturnStatement.js";
import { ArrayLiteral } from "../ast/ArrayLiteral.js";
import { IndexExpression } from "../ast/IndexExpression.js";
import { ArrayAssignment } from "../ast/ArrayAssignment.js";
import { ForStatement } from "../ast/ForStatement.js";
import { ForEachStatement } from "../ast/ForEachStatement.js";
import { BreakStatement } from "../ast/BreakStatement.js";
import { ContinueStatement } from "../ast/ContinueStatement.js";
import { ObjectLiteral } from "../ast/ObjectLiteral.js";
import { PropertyAccess } from "../ast/PropertyAccess.js";
import { PropertyAssignment } from "../ast/PropertyAssignment.js";
import { FunctionExpression } from "../ast/FunctionExpression.js";
import { ThisExpression } from "../ast/ThisExpression.js";
import { ClassDeclaration } from "../ast/ClassDeclaration.js";
import { SuperExpression } from "../ast/SuperExpression.js";
import { LumaError } from "../error/LumaError.js";
import { ImportStatement } from "../ast/ImportStatement.js";


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

        const token =
            this.peek();

        throw new Error(
            `${message}
    Line ${token.line}, Column ${token.column}
    Found: ${token.type}`
        );
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

    importStatement() {

        const path =
            this.consume(
                TokenType.STRING,
                "Expected module path."
            );

        this.consume(
            TokenType.SEMICOLON,
            "Expected ';'."
        );

        return new ImportStatement(
            path.value
        );
    }


    classDeclaration() {

        const name = this.consume(
            TokenType.IDENTIFIER,
            "Expected class name."
        );

        let superclass = null;

        if (this.match(TokenType.COLON)) {

            superclass = this.consume(
                TokenType.IDENTIFIER,
                "Expected superclass name."
            ).value;
        }

        this.consume(
            TokenType.LEFT_BRACE,
            "Expected '{' before class body."
        );

        const methods = [];
        const staticMethods = [];

        while (
            !this.check(TokenType.RIGHT_BRACE) &&
            !this.isAtEnd()
        ) {

            let isStatic = false;

            if (this.match(TokenType.STATIC)) {
                isStatic = true;
            }

            this.consume(
                TokenType.FUN,
                "Expected method."
            );

            const method =
                this.functionDeclaration();

            if (isStatic) {

                staticMethods.push(
                    method
                );

            } else {

                methods.push(
                    method
                );
            }
        }

        this.consume(
            TokenType.RIGHT_BRACE,
            "Expected '}' after class body."
        );

        return new ClassDeclaration(
            name.value,
            superclass,
            methods,
            staticMethods
        );
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

    objectLiteral() {

        const properties = [];

        while (
            !this.check(TokenType.RIGHT_BRACE)
        ) {

            const key =
                this.consume(
                    TokenType.IDENTIFIER,
                    "Expected property name."
                );

            this.consume(
                TokenType.COLON,
                "Expected ':'."
            );

            const value =
                this.expression();

            properties.push({
                key: key.value,
                value
            });

            if (
                !this.match(TokenType.COMMA)
            ) {
                break;
            }
        }

        this.consume(
            TokenType.RIGHT_BRACE,
            "Expected '}'."
        );

        return new ObjectLiteral(
            properties
        );
    }

    call() {

        let expr =
            this.primary();

        while (true) {

            if (
                this.match(
                    TokenType.LEFT_PAREN
                )
            ) {

                expr =
                    this.finishCall(expr);

            } else if (
                this.match(
                    TokenType.LEFT_BRACKET
                )
            ) {

                const index =
                    this.expression();

                this.consume(
                    TokenType.RIGHT_BRACKET,
                    "Expected ']'"
                );

                expr =
                    new IndexExpression(
                        expr,
                        index
                    );

            } else if (
                this.match(
                    TokenType.DOT
                )
            ) {

                const name =
                    this.consume(
                        TokenType.IDENTIFIER,
                        "Expected property name."
                    );

                expr =
                    new PropertyAccess(
                        expr,
                        name.value
                    );

            } else {

                break;
            }

        }

        return expr;
    }

    forStatement() {

        const name =
            this.consume(
                TokenType.IDENTIFIER,
                "Expected variable name."
            );

        // for item in users
        if (this.match(TokenType.IN)) {

            const iterable =
                this.expression();

            const body =
                this.block();

            return new ForEachStatement(
                name.value,
                iterable,
                body
            );
        }

        // for i = 1 to 5

        this.consume(
            TokenType.EQUAL,
            "Expected '='."
        );

        const start =
            this.expression();

        this.consume(
            TokenType.TO,
            "Expected 'to'."
        );

        const end =
            this.expression();

        const body =
            this.block();

        return new ForStatement(
            name.value,
            start,
            end,
            body
        );
    }



    finishCall(callee) {

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
            "Expected ')' after arguments."
        );

        return new CallExpression(
            callee,
            args
        );
    }

   returnStatement() {

        let value = null;

        if (!this.check(TokenType.SEMICOLON)) {
            value = this.expression();
        }

        this.consume(
            TokenType.SEMICOLON,
            "Expected ';' after return."
        );

        return new ReturnStatement(
            value
        );
    }

    // =========================
    // PROGRAM
    // =========================

    parse() {

        const statements = [];

        while (!this.isAtEnd()) {

            const stmt =
                this.statement();

            if (stmt !== null) {
                statements.push(stmt);
            }
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
        if (this.match(TokenType.RETURN)) {
            return this.returnStatement();
        }

        if (this.match(TokenType.FOR)) {
            return this.forStatement();
        }

        if (this.match(TokenType.BREAK)) {
            return new BreakStatement();
        }

        if (this.match(TokenType.CONTINUE)) {
            return new ContinueStatement();
        }

        if (this.match(TokenType.SEMICOLON)) {
            return null;
        }

        if (this.match(TokenType.IMPORT)) {
            return this.importStatement();
        }

        if (this.match(TokenType.CLASS)) {
            return this.classDeclaration();
        }

        if (this.check(TokenType.LEFT_BRACE)) {
            return this.block();
        }

       return this.expressionStatement();
    }


    expressionStatement() {

        const expr =
            this.expression();

        this.consume(
            TokenType.SEMICOLON,
            "Expected ';'."
        );

        return new ExpressionStatement(
            expr
        );
    }

    ifStatement() {

        const condition =
            this.expression();

        const thenBranch =
            this.block();

        let elseBranch = null;

        if (this.match(TokenType.ELSE)) {

            if (this.match(TokenType.IF)) {

                elseBranch =
                    this.ifStatement();

            } else {

                elseBranch =
                    this.block();

            }
        }

        return new IfStatement(
            condition,
            thenBranch,
            elseBranch
        );
    }

    block() {

        this.consume(
            TokenType.LEFT_BRACE,
            "Expected '{'."
        );

        const statements = [];

        while (
            !this.check(TokenType.RIGHT_BRACE) &&
            !this.isAtEnd()
        ) {

            const stmt =
                this.statement();

            if (stmt !== null) {
                statements.push(stmt);
            }
        }

        this.consume(
            TokenType.RIGHT_BRACE,
            "Expected '}'."
        );

        return new BlockStatement(
            statements
        );
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

        const initializer =
            this.expression();

        this.consume(
            TokenType.SEMICOLON,
            "Expected ';'."
        );

        return new VariableDeclaration(
            name.value,
            initializer
        );
    }

   sayStatement() {

        const expr =
            this.expression();

        this.consume(
            TokenType.SEMICOLON,
            "Expected ';'."
        );

        return new SayStatement(
            expr
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

            if (expr instanceof PropertyAccess) {

                return new PropertyAssignment(
                    expr.object,
                    expr.property,
                    value
                );
            }

            if (expr instanceof IndexExpression) {

                return new ArrayAssignment(
                    expr.array,
                    expr.index,
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

        while (this.match(TokenType.STAR, TokenType.SLASH, TokenType.PERCENT)) {

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

        if (this.match(TokenType.THIS)) {

            return new ThisExpression();

        }

        if (this.match(TokenType.SUPER)) {

            this.consume(
                TokenType.DOT,
                "Expect '.' after super."
            );

            const method =
                this.consume(
                    TokenType.IDENTIFIER,
                    "Expect superclass method name."
                );

            return new SuperExpression(
                method.value
            );
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

        if (this.match(TokenType.LEFT_BRACKET)) {

                const elements = [];

                if (!this.check(TokenType.RIGHT_BRACKET)) {

                    do {

                        elements.push(
                            this.expression()
                        );

                    } while (
                        this.match(TokenType.COMMA)
                    );
                }

                this.consume(
                    TokenType.RIGHT_BRACKET,
                    "Expected ']'"
                );

                return new ArrayLiteral(
                    elements
                );
            }
        if (this.match(TokenType.LEFT_BRACE)) {
            return this.objectLiteral();
        }

        if (this.match(TokenType.FUN)) {

            this.consume(
                TokenType.LEFT_PAREN,
                "Expected '(' after fun."
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

                } while (
                    this.match(TokenType.COMMA)
                );
            }

            this.consume(
                TokenType.RIGHT_PAREN,
                "Expected ')'."
            );

            const body =
                this.block();

            return new FunctionExpression(
                params,
                body
            );
        }
        throw new Error(
            "Expected expression."
        );
    }
}