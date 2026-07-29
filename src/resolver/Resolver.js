export class Resolver {

    constructor(interpreter) {

        this.interpreter = interpreter;
        this.scopes = [];
    }

    resolve(statements) {

        for (const stmt of statements) {
            this.resolveStatement(stmt);
        }
    }

    beginScope() {
        this.scopes.push(new Map());
    }

    endScope() {
        this.scopes.pop();
    }

    declare(name) {

        if (this.scopes.length === 0) {
            return;
        }

        this.scopes.at(-1).set(
            name,
            false
        );
    }

    define(name) {

        if (this.scopes.length === 0) {
            return;
        }

        this.scopes.at(-1).set(
            name,
            true
        );
    }

    resolveLocal(expr, name) {

        for (
            let i = this.scopes.length - 1;
            i >= 0;
            i--
        ) {

            if (
                this.scopes[i].has(name)
            ) {

                this.interpreter.resolve(
                    expr,
                    this.scopes.length - 1 - i
                );

                return;
            }
        }
    }

    resolveFunction(fn) {

        this.beginScope();

        for (const param of fn.params) {

            this.declare(param);
            this.define(param);
        }

        if (fn.body?.statements) {

            for (const stmt of fn.body.statements) {
                this.resolveStatement(stmt);
            }
        }

        this.endScope();
    }

    resolveStatement(stmt) {

        if (!stmt) {
            return;
        }

        switch (stmt.constructor.name) {

            case "BlockStatement":

                this.beginScope();

                for (const statement of stmt.statements) {
                    this.resolveStatement(statement);
                }

                this.endScope();
                return;

            case "VariableDeclaration":

                this.declare(
                    stmt.identifier
                );

                if (stmt.initializer) {

                    this.resolveExpression(
                        stmt.initializer
                    );
                }

                this.define(
                    stmt.identifier
                );

                return;

            case "FunctionDeclaration":

                this.declare(
                    stmt.name
                );

                this.define(
                    stmt.name
                );

                this.resolveFunction(
                    stmt
                );

                return;

            case "SayStatement":

                this.resolveExpression(
                    stmt.expression
                );

                return;

            case "ExpressionStatement":

                this.resolveExpression(
                    stmt.expression
                );

                return;

            case "ReturnStatement":

                this.resolveExpression(
                    stmt.value
                );

                return;

            case "IfStatement":

                this.resolveExpression(
                    stmt.condition
                );

                this.resolveStatement(
                    stmt.thenBranch
                );

                if (stmt.elseBranch) {

                    this.resolveStatement(
                        stmt.elseBranch
                    );
                }

                return;

            case "WhileStatement":

                this.resolveExpression(
                    stmt.condition
                );

                this.resolveStatement(
                    stmt.body
                );

                return;

            default:
                return;
        }
    }

    resolveExpression(expr) {

        if (!expr) {
            return;
        }

        switch (expr.constructor.name) {

            case "Identifier":

                this.resolveLocal(
                    expr,
                    expr.name
                );

                return;

            case "Assignment":

                this.resolveExpression(
                    expr.value
                );

                this.resolveLocal(
                    expr,
                    expr.identifier
                );

                return;

            case "BinaryExpression":

                this.resolveExpression(
                    expr.left
                );

                this.resolveExpression(
                    expr.right
                );

                return;

            case "UnaryExpression":

                this.resolveExpression(
                    expr.right
                );

                return;

            case "CallExpression":

                this.resolveExpression(
                    expr.callee
                );

                for (const arg of expr.args) {

                    this.resolveExpression(
                        arg
                    );
                }

                return;

            default:
                return;
        }
    }
}