import { Environment } from "./Environment.js";
import { Return } from "./Return.js";

export class LumaFunction {

    constructor(
        declaration,
        closure
    ) {
        this.declaration =
            declaration;

        this.closure =
            closure;

        this.boundThis = null;
    }


    bind(instance) {


        const bound =
            new LumaFunction(
                this.declaration,
                this.closure
            );

        bound.boundThis =
            instance;

        return bound;
    }
    arity() {
        
        return this.declaration.params.length;
    }

    call(interpreter, args) {

        const previous =
            interpreter.environment;

        const local =
            new Environment(
                this.closure
            );

        if (
            this.boundThis !== null
        ) {

            local.define(
                "this",
                this.boundThis
            );
        }

        for (
            let i = 0;
            i < this.declaration.params.length;
            i++
        ) {

            local.define(
                this.declaration.params[i],
                args[i]
            );
        }

        interpreter.environment =
            local;

         try {

        for ( const stmt of
            this.declaration.body.statements
        ) {
            interpreter.execute(stmt);
        }

        } catch (returned) {

            if (
                returned instanceof Return
            ) {
                return returned.value;
            }

            throw returned;

        } finally {

            interpreter.environment =
                previous;
        }

        return null;
    }
}