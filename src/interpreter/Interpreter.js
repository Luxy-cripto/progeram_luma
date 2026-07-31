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
import { NativeFunction } from "./NativeFunction.js";
import { input } from "./Input.js";
import { ArrayAssignment } from "../ast/ArrayAssignment.js";
import { ForStatement } from "../ast/ForStatement.js";
import { ForEachStatement } from "../ast/ForEachStatement.js";
import { BreakStatement } from "../ast/BreakStatement.js";
import { Break } from "./Break.js";
import { Continue } from "./Continue.js";
import { ContinueStatement } from "../ast/ContinueStatement.js";
import { ObjectLiteral } from "../ast/ObjectLiteral.js";
import { PropertyAccess } from "../ast/PropertyAccess.js";
import { PropertyAssignment } from "../ast/PropertyAssignment.js";
import { FunctionExpression } from "../ast/FunctionExpression.js";
import { ThisExpression } from "../ast/ThisExpression.js";
import { LumaClass } from "../runtime/LumaClass.js";
import { LumaInstance } from "../runtime/LumaInstance.js";
import { ClassDeclaration } from "../ast/ClassDeclaration.js";
import { SetProperty } from "../ast/SetProperty.js";
import { SuperExpression } from "../ast/SuperExpression.js";
import { ImportStatement } from "../ast/ImportStatement.js";

import fs from "fs";
import { Lexer } from "../lexer/Lexer.js";
import { Parser } from "../parser/Parser.js";
import { Resolver } from "../resolver/Resolver.js";


export class Interpreter {

    constructor() {

        this.globals =
            new Environment();

        this.environment =
            this.globals;

        this.locals =
            new Map();

        this.environment.define(
            "len",
            new NativeFunction(args => {
                return args[0].length;
            })
        );

        this.environment.define(
            "upper",
            new NativeFunction(args => {
                return String(args[0]).toUpperCase();
            })
        );


        this.environment.define(
            "trim",
            new NativeFunction(args => {

                return String(
                    args[0]
                ).trim();

            })
        );

        this.environment.define(
            "type",
            new NativeFunction(args => {

                const value = args[0];

                if (Array.isArray(value)) {
                    return "array";
                }

                return typeof value;

            })
        );
        this.environment.define(
            "clock",
            new NativeFunction(args => {

                return Date.now();

            })
        );
        this.environment.define(
            "random",
            new NativeFunction(args => {

                return Math.random();

            })
        );

        this.environment.define(
            "sqrt",
            new NativeFunction(args => {

                return Math.sqrt(args[0]);

            })
        );

        this.environment.define(
            "pow",
            new NativeFunction(args => {

                return Math.pow(
                    args[0],
                    args[1]
                );

            })
        );

        this.environment.define(
            "floor",
            new NativeFunction(args => {

                return Math.floor(args[0]);

            })
        );

        this.environment.define(
            "ceil",
            new NativeFunction(args => {

                return Math.ceil(args[0]);

            })
        );

        this.environment.define(
            "abs",
            new NativeFunction(args => {

                return Math.abs(args[0]);

            })
        );

        this.environment.define(
            "round",
            new NativeFunction(args => {

                return Math.round(
                    args[0]
                );

            })
        );

        this.environment.define(
            "min",
            new NativeFunction(args => {

                return Math.min(
                    ...args
                );

            })
        );

        this.environment.define(
            "max",
            new NativeFunction(args => {

                return Math.max(
                    ...args
                );

            })
        );

        this.environment.define(
            "lower",
            new NativeFunction(args => {

                return String(
                    args[0]
                ).toLowerCase();

            })
        );

        this.environment.define(
            "contains",
            new NativeFunction(args => {

                return String(
                    args[0]
                ).includes(
                    String(args[1])
                );

            })
        );

        this.environment.define(
            "replace",
            new NativeFunction(args => {

                return String(
                    args[0]
                ).replace(
                    String(args[1]),
                    String(args[2])
                );

            })
        );

        this.environment.define(
            "write",
            new NativeFunction(args => {

                fs.writeFileSync(
                    args[0],
                    String(args[1])
                );

                return null;

            })
        );

        this.environment.define(
            "read",
            new NativeFunction(args => {

                return fs.readFileSync(
                    args[0],
                    "utf8"
                );

            })
        );

        this.environment.define(
            "append",
            new NativeFunction(args => {

                fs.appendFileSync(
                    args[0],
                    String(args[1])
                );

                return null;

            })
        );

        this.environment.define(
            "sqrt",
            new NativeFunction(args => {
                return Math.sqrt(args[0]);
            })
        );

        this.environment.define(
            "floor",
            new NativeFunction(args => {
                return Math.floor(args[0]);
            })
        );

        this.environment.define(
            "ceil",
            new NativeFunction(args => {
                return Math.ceil(args[0]);
            })
        );

        this.environment.define(
            "abs",
            new NativeFunction(args => {
                return Math.abs(args[0]);
            })
        );

        this.environment.define(
            "exists",
            new NativeFunction(args => {

                return fs.existsSync(
                    args[0]
                );

            })
        );

        this.environment.define(
            "delete",
            new NativeFunction(args => {

                if (
                    fs.existsSync(args[0])
                ) {

                    fs.unlinkSync(
                        args[0]
                    );
                }

                return null;

            })
        );

        this.environment.define(
            "keys",
            new NativeFunction(args => {

                return Object.keys(
                    args[0]
                );

            })
        );

        this.environment.define(
            "values",
            new NativeFunction(args => {

                return Object.values(
                    args[0]
                );

            })
        );

        this.environment.define(
            "has",
            new NativeFunction(args => {

                return Object.prototype.hasOwnProperty.call(
                    args[0],
                    args[1]
                );

            })
        );

        this.environment.define(
            "split",
            new NativeFunction(args => {

                return String(args[0]).split(
                    args[1]
                );

            })
        );

        this.environment.define(
            "join",
            new NativeFunction(args => {

                return args[0].join(
                    args[1]
                );

            })
        );

        this.environment.define(
            "replace",
            new NativeFunction(args => {

                return String(args[0]).replace(
                    args[1],
                    args[2]
                );

            })
        );

        this.environment.define(
            "jsonParse",
            new NativeFunction(args => {

                return JSON.parse(
                    args[0]
                );

            })
        );

        this.environment.define(
            "jsonStringify",
            new NativeFunction(args => {

                return JSON.stringify(
                    args[0]
                );

            })
        );
        
        this.environment.define(
            "push",
            new NativeFunction(args => {

                args[0].push(args[1]);

                return null;

            })
        );

        this.environment.define(
            "pop",
            new NativeFunction(args => {

                return args[0].pop();

            })
        );

        this.environment.define(
            "first",
            new NativeFunction(args => {

                return args[0][0];

            })
        );

        this.environment.define(
            "last",
            new NativeFunction(args => {

                return args[0][args[0].length - 1];

            })
        );

        this.environment.define(
            "clear",
            new NativeFunction(args => {

                args[0].length = 0;

                return null;

            })
        );

        this.environment.define(
            "input",
            new NativeFunction(args => {

                return input();

            })
        );
    }

    resolve(expr, depth) {

        this.locals.set(
            expr,
            depth
        );
    }

    lookupVariable(name, expr) {

        const distance =
            this.locals.get(expr);

        if (distance !== undefined) {
            return this.environment.getAt(
                distance,
                name
            );
        }

        return this.globals.get(name);
    }

 


   interpret(statements) {

        try {

            for (const statement of statements) {
                this.execute(statement);
            }

        } catch (error) {

            if (error instanceof Break) {
                throw new Error(
                    "Cannot use break outside loop."
                );
            }

            if (error instanceof Continue) {
                throw new Error(
                    "Cannot use continue outside loop."
                );
            }

            if (error instanceof Return) {
                throw new Error(
                    "Cannot use return outside function."
                );
            }

            throw error;
        }
    }

    executeClassDeclaration(stmt) {


        for (const method of stmt.methods) {

          
        }

        let superclass = null;

        if (stmt.superclass) {

            superclass =
                this.environment.get(
                    typeof stmt.superclass === "string"
                        ? stmt.superclass
                        : stmt.superclass.name
                );

            if (
                !(superclass instanceof LumaClass)
            ) {

                throw new Error(
                    "Superclass must be a class."
                );
            }


        }

        const previousEnv =
            this.environment;

        if (superclass) {

            this.environment =
                new Environment(
                    this.environment
                );

            this.environment.define(
                "super",
                superclass
            );

            
        }

 
        const methods = {};
        const staticMethods = {};

        for (const method of stmt.staticMethods) {

            staticMethods[method.name] =
                new LumaFunction(
                    method,
                    this.environment
                );

            
        }

        for (const method of stmt.methods) {

            methods[method.name] =
                new LumaFunction(
                    method,
                    this.environment
                );

            
        }


        const klass =
            new LumaClass(
                stmt.name,
                methods,
                superclass,
                staticMethods,
                
            );

 
        if (superclass) {

            this.environment =
                previousEnv;
        }

   
        this.environment.define(
            stmt.name,
            klass
        );

       
    }

    visitClassDeclaration(stmt) {

       

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

        if ( statement instanceof PropertyAssignment
        ) {

            const object =
                this.evaluate(
                    statement.object
                );

            const value =
                this.evaluate(
                    statement.value
                );

            object.set(
                statement.property,
                value
            );

            return;
        }

        if (statement instanceof ClassDeclaration) {

            this.executeClassDeclaration(
                statement
            );

            return;
        }

        if (statement instanceof ForStatement) {

            const start =
                this.evaluate(
                    statement.start
                );

            const end =
                this.evaluate(
                    statement.end
                );

            for (
            let i = start;
            i <= end;
            i++
        ) {

            this.environment.define(
                statement.variable,
                i
            );

            try {

                this.execute(
                    statement.body
                );

            } catch (error) {

                if (error instanceof Continue) {
                    continue;
                }

                throw error;
            }
        }

            return;
        }

        if (statement instanceof ForEachStatement) {

            const iterable =
                this.evaluate(
                    statement.iterable
                );

            for (const item of iterable) {

                this.environment.define(
                    statement.variable,
                    item
                );

                try {

                    this.execute(
                        statement.body
                    );

                } catch (error) {

                    if (error instanceof Break) {
                        break;
                    }

                    throw error;
                }
            }

            return;
        }

        if (statement instanceof BreakStatement) {
            throw new Break();
        }

        if (statement instanceof ContinueStatement) {
            throw new Continue();
        }

        if (statement instanceof ReturnStatement) {

            const value =
                this.evaluate(statement.value);

            throw new Return(value);
        }

        if (statement instanceof FunctionDeclaration) {

            const fn =
                new LumaFunction(
                    statement,
                    this.environment
                );

            this.environment.define(
                statement.name,
                fn
            );

            return;
        }

        if (statement instanceof SayStatement) {

            let value =
                this.evaluate(
                    statement.expression
                );

            if (typeof value === "string") {
                value =
                    this.interpolate(value);
            }

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
                this.evaluate(statement.condition)
            ) {

                try {

                    this.execute(
                        statement.body
                    );

                } catch (error) {

                    if (error instanceof Break) {
                        break;
                    }

                    throw error;
                }
            }

            return;
        }

        if (
            statement instanceof ImportStatement
        ) {

            const source =
                fs.readFileSync(
                    statement.path,
                    "utf8"
                );

            const lexer =
                new Lexer(source);

            const tokens =
                lexer.scanTokens();

            const parser =
                new Parser(tokens);

            const statements =
                parser.parse();

            const resolver =
                new Resolver(this);

            resolver.resolve(
                statements
            );

            this.interpret(
                statements
            );

            return;
        }


        if (statement instanceof BlockStatement) {


            const previous =
                this.environment;

            this.environment =
                new Environment(previous);

            try {

                for (const stmt of statement.statements) {

                    if (stmt == null) {
                        continue;
                    }

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

    interpolate(text) {

        return text.replace(
            /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g,
            (_, name) => {

                try {

                    return this.environment.get(
                        name
                    );

                } catch {

                    return `{${name}}`;

                }

            }
        );
    }

    evaluate(expr) {


        if (expr instanceof Literal) {
            return expr.value;
        }

            if (expr instanceof Identifier) {

                return this.lookupVariable(
                    expr.name,
                    expr
                );
        }

        if (expr instanceof SuperExpression) {

            let superclass;

            try {

                superclass =
                    this.environment.get("super");

            } catch {

                throw new Error(
                    "Cannot use 'super' outside a subclass."
                );
            }

            const thisValue =
                this.environment.get(
                    "this"
                );

            let method = null;

            if (
                thisValue instanceof LumaClass
            ) {

                method =
                    superclass.findStaticMethod(
                        expr.method
                    );

            } else {

                method =
                    superclass.findMethod(
                        expr.method
                    );
            }

            if (!method) {

                throw new Error(
                    "Undefined superclass method '" +
                    expr.method +
                    "'."
                );
            }

            return method.bind(
                thisValue
            );
        }
        
        if (expr instanceof ThisExpression) {

            try {
                return this.environment.get("this");
            } catch {

                throw new Error(
                    "Cannot use 'this' outside a class method."
                );
            }
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
        
        if (expr instanceof FunctionExpression) {

            const declaration = {
                params: expr.params,
                body: expr.body
            };

            return new LumaFunction(
                declaration,
                this.environment
            );
        }

        if (expr instanceof PropertyAssignment) {

            const object =
                this.evaluate(
                    expr.object
                );

            const value =
                this.evaluate(
                    expr.value
                );

            object.set(
                expr.property,
                value
            );

            return value;
        }

        if (expr instanceof ArrayAssignment) {

            const array =
                this.evaluate(expr.array);

            const index =
                this.evaluate(expr.index);

            const value =
                this.evaluate(expr.value);

            array[index] = value;

            return value;
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

        if (expr instanceof ObjectLiteral) {

            const object = {};

            for (
                const property
                of expr.properties
            ) {

                object[property.key] =
                    this.evaluate(
                        property.value
                    );
            }

            return object;
        }


        if (expr instanceof PropertyAccess) {

            const object =
                this.evaluate(
                    expr.object
                );

            if (
                object instanceof LumaInstance
            ) {

                return object.get(
                    expr.property
                );
            }

            if (
                object instanceof LumaClass
            ) {

                if (expr.property in object) {
                    return object[expr.property];
                }

                const method =
                    object.findStaticMethod(
                        expr.property
                    );

                if (method) {

                    // PENTING
                    return method.bind(
                        object
                    );
                }

                throw new Error(
                    `Undefined static method '${expr.property}'.`
                );
            }

            if (
                typeof object === "object" &&
                object !== null
            ) {

                return object[
                    expr.property
                ];
            }

            throw new Error(
                "Only instances and classes have properties."
            );
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

                case "PERCENT":
                    return left % right;

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


      
       if (expr === null) {
            return null;
        }
        throw new Error(
            "Unknown expression."
        );
    }
}