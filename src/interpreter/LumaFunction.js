import { Environment } from "./Environment.js";
import { Return } from "./Return.js";

export class LumaFunction {

    constructor(declaration) {
        this.declaration = declaration;
    }

    call(interpreter, args) {

        const previous =
            interpreter.environment;

        const local =
            new Environment(previous);

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

            interpreter.execute(
                this.declaration.body
            );

        } catch (returned) {

            if (returned instanceof Return) {
                return returned.value;
            }

            throw returned;

        } finally {

            interpreter.environment =
                previous;
        }
    }
}