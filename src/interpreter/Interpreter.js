import { Literal } from "../ast/Literal.js";
import { Identifier } from "../ast/Identifier.js";
import { BinaryExpression } from "../ast/BinaryExpression.js";
import { VariableDeclaration } from "../ast/VariableDeclaration.js";
import { SayStatement } from "../ast/SayStatement.js";
import { UnaryExpression } from "../ast/UnaryExpression.js";

export class Interpreter {

    constructor() {
        this.variables = {};
    }

    interpret(statements) {
        for (const statement of statements) {
            this.execute(statement);
        }
    }

    execute(statement) {

        console.log(statement);
        console.log(statement.constructor.name);

        if (statement instanceof VariableDeclaration) {
            const value = this.evaluate(statement.initializer);
            this.variables[statement.identifier] = value;
            return;
        }

        if (statement instanceof SayStatement) {
            const value = this.evaluate(statement.expression);
            console.log(value);
            return;
        }

        throw new Error("Unknown statement.");
    }
    evaluate(expr) {
        if (expr instanceof UnaryExpression) {
            const right = this.evaluate(expr.right);
            switch (expr.operator) {
                case "MINUS":
                    return -right;
                default:
                    throw new Error("Unknown operator.");
            }
        }
        if (expr instanceof Literal) {
            return expr.value;
        }

        if (expr instanceof Identifier) {

            if (!(expr.name in this.variables)) {
                throw new Error(`Variable '${expr.name}' not defined.`);
            }

            return this.variables[expr.name];
        }

        if (expr instanceof BinaryExpression) {

            const left = this.evaluate(expr.left);
            const right = this.evaluate(expr.right);

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
                    throw new Error("Unknown operator.");
            }
        }

        throw new Error("Unknown expression.");
    }
}