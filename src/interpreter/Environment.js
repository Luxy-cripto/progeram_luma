export class Environment {
    constructor() {
        this.variables = new Map();
    }

    define(name, value) {
        this.variables.set(name, value);
    }

    get(name) {
        if (this.variables.has(name)) {
            return this.variables.get(name);
        } else {
            throw new Error(`Undefined variable '${name}'`);
        }
    }
}