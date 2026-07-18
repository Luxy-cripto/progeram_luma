export class Environment {

    constructor(parent = null) {
        this.parent = parent;
        this.values = {};
    }

    define(name, value) {
        this.values[name] = value;
    }

    get(name) {

        if (name in this.values) {
            return this.values[name];
        }

        if (this.parent) {
            return this.parent.get(name);
        }

        throw new Error(
            `Variable '${name}' not defined.`
        );
    }

    assign(name, value) {

        if (name in this.values) {
            this.values[name] = value;
            return;
        }

        if (this.parent) {
            this.parent.assign(name, value);
            return;
        }

        throw new Error(
            `Variable '${name}' not defined.`
        );
    }
}