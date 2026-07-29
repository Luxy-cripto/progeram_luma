export class LumaInstance {

    constructor(klass) {

        this.klass = klass;
        this.fields = {};
    }

    get(name) {

        if (name in this.fields) {
            return this.fields[name];
        }

        const method =
            this.klass.findMethod(name);

        if (method) {
            return method.bind(this);
        }

        throw new Error(
            `Undefined property '${name}'.`
        );
    }

    set(name, value) {

        this.fields[name] =
            value;
    }

    arity() {

        return this.declaration.params.length;
    }
}