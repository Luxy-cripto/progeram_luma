export class Namespace {

    constructor() {

        this.values = {};
    }

    define(name, value) {

        this.values[name] = value;

    }

    get(name) {

        if (!(name in this.values)) {

            throw new Error(

                `Namespace member '${name}' not found.`

            );
        }

        return this.values[name];
    }

}