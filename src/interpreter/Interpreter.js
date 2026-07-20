import { Literal } from "../ast/Literal.js";
import { Identifier } from "../ast/Identifier.js";
import { BinaryExpression } from "../ast/BinaryExpression.js";
import { VariableDeclaration } from "../ast/VariableDeclaration.js";
import { SayStatement } from "../ast/SayStatement.js";
import { UnaryExpression } from "../ast/UnaryExpression.js";
import { IfStatement } from "../ast/IfStatement.js";
import { BlockStatement } from "../ast/BlockStatement.js";
import { WhileStatement } from "../ast/WhileStatement.js";
import { ExpressionStatement } from "../ast/ExpressionStatement.js";
import { Assignment } from "../ast/Assignment.js";
import { Environment } from "./Environment.js";
import { FunctionDeclaration } from "../ast/FunctionDeclaration.js";
import { CallExpression } from "../ast/CallExpression.js";
import { LumaFunction } from "./LumaFunction.js";
import { Return } from "./Return.js";
import { ReturnStatement } from "../ast/ReturnStatement.js";
import { ArrayLiteral } from "../ast/ArrayLiteral.js";
import { IndexExpression } from "../ast/IndexExpression.js";

export class Interpreter {

    constructor() {
        this.environment = new Environment();
    }

    interpret(statements) {

        for (const statement of statements) {
            this.execute(statement);
        }

    }

    execute(statement) {

        if (statement instanceof VariableDeclaration) {

            const value =
                this.evaluate(statement.initializer);

            this.environment.define(
                statement.identifier,
                value
            );

            return;
        }

        if (statement instanceof ReturnStatement) {

            const value =
                this.evaluate(statement.value);

            throw new Return(value);
        }

        if (statement instanceof FunctionDeclaration) {

            const func =
                new LumaFunction(statement);

            this.environment.define(
                statement.name,
                func
            );

            return;
        }


        if (statement instanceof SayStatement) {

            const value =
                this.evaluate(statement.expression);

            console.log(value);

            return;
        }

        if (statement instanceof ExpressionStatement) {

            this.evaluate(
                statement.expression
            );

            return;
        }

        if (statement instanceof IfStatement) {

            const condition =
                this.evaluate(statement.condition);

            if (condition) {

                this.execute(
                    statement.thenBranch
                );

            } else if (statement.elseBranch) {

                this.execute(
                    statement.elseBranch
                );

            }

            return;
        }

        if (statement instanceof WhileStatement) {

            while (
                this.evaluate(
                    this.condition
                )
            ) {

                this.execute(
                    this.body
                );      
          if (statement instanceof FunctionDeclaration) {

            const func =
                new LumaFunction(statement);

            this.environment.define(
                statement.name,
                func
            );

            return;
        }

            }

            return;
        }

        if (statement instanceof BlockStatement) {

            const previous =
                this.environment;

            this.environment =
                new Environment(previous);

            try {

                for (const stmt of statement.statements) {
                    this.execute(stmt);
                }

            } finally {

                this.environment =
                    previous;
            }

            return;
        }

        throw new Error(
            "Unknown statement."
        );
    }

    call(interpreter, args) {

        const environment =
            new Environment(
                interpreter.environment
            );

        for (
            let i = 0;
            i < this.declaration.params.length;
            i++
        ) {
            environment.define(
                this.declaration.params[i],
                args[i]
            );
        }

        const previous =
            interpreter.environment;

        interpreter.environment =
            environment;

        try {

            interpreter.execute(
                this.declaration.body
            );

        } finally {

            interpreter.environment =
                previous;
        }
    }

    evaluate(expr) {

        if (expr instanceof Literal) {
            return expr.value;
        }

        if (expr instanceof Identifier) {

            return this.environment.get(
                expr.name
            );
        }
        if (expr instanceof IndexExpression) {

            const array =
                this.evaluate(expr.array);

            const index =
                this.evaluate(expr.index);

            return array[index];
        }

        if (expr instanceof ArrayLiteral) {

            return expr.elements.map(
                element =>
                    this.evaluate(element)
            );
        }

        if (expr instanceof CallExpression) {

            const callee =
                this.evaluate(expr.callee);

            const args =
                expr.args.map(arg =>
                    this.evaluate(arg)
                );

            return callee.call(
                this,
                args
            );
        }

        if (expr instanceof Assignment) {

            const value =
                this.evaluate(expr.value);

            this.environment.assign(
                expr.name,
                value
            );

            return value;
        }

        if (expr instanceof UnaryExpression) {

            const right =
                this.evaluate(expr.right);

            switch (expr.operator) {

                case "MINUS":
                    return -right;

                default:
                    throw new Error(
                        "Unknown operator."
                    );
            }
        }

        if (expr instanceof BinaryExpression) {

            const left =
                this.evaluate(expr.left);

            const right =
                this.evaluate(expr.right);

            switch (expr.operator) {

                case "PLUS":
                    return left + right;

                case "MINUS":
                    return left - right;

                case "STAR":
                    return left * right;

                case "SLASH":
                    return left / right;

                case "EQUAL_EQUAL":
                    return left == right;

                case "BANG_EQUAL":
                    return left != right;

                case "GREATER":
                    return left > right;

                case "GREATER_EQUAL":
                    return left >= right;

                case "LESS":
                    return left < right;

                case "LESS_EQUAL":
                    return left <= right;

                default:
                    throw new Error(
                        "Unknown operator."
                    );
            }
        }


        console.log(expr);
        console.log(expr.constructor?.name);

        throw new Error(
            "Unknown expression."
        );
    }
}