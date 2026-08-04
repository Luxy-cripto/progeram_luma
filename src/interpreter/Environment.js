export class Environment {

    constructor(parent = null) {

        this.parent = parent;

        this.values = {};

        this.constants =
            new Set();
    }

    define(name, value) {
        this.values[name] = value;
    }

    defineConst(name, value) {
        this.define(name, value);
        this.constants.add(name);
    }

    get(name, expr = null) {

        if (name in this.values) {
            return this.values[name];
        }

        if (this.parent) {
            return this.parent.get(name, expr);
        }

        if (expr) {

        throw new Error(
                `[Line ${expr.line}, Column ${expr.column}] ` +
                `Variable '${name}' not defined.`
            );
        }

        throw new Error(
            `Variable '${name}' not defined.`
        );
    }

    assign(name, value, expr = null) {

        if (name in this.values) {

            if (
                this.constants.has(name)
            ) {

                throw new Error(
                    `Cannot assign to constant '${name}'.`
                );
            }

            this.values[name] = value;
            return;
        }

        if (this.parent) {
            this.parent.assign(name, value, expr);
            return;
        }

       if (expr) {

        throw new Error(
                `[Line ${expr.line}, Column ${expr.column}] ` +
                `Variable '${name}' not defined.`
            );
        }

        throw new Error(
            `Variable '${name}' not defined.`
        );
    }

    ancestor(distance) {

        let env = this;

        for (
            let i = 0;
            i < distance;
            i++
        ) {

            env = env.parent;
        }

        return env;
    }

  getAt(distance, name) {

        const env =
            this.ancestor(distance);
        return env.values[name];
    }

    assignAt(distance, name, value) {

        this.ancestor(distance)
            .values[name] = value;
    }
}