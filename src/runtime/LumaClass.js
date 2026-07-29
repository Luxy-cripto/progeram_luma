import { LumaInstance } from "./LumaInstance.js";

export class LumaClass {

    constructor(name, methods, superclass = null, staticMethods = {}) {

        this.name = name;
        this.superclass = superclass;
        this.methods = methods;

        this.staticMethods = staticMethods;
    }

    findMethod(name) {
       if (name in this.methods) {
           return this.methods[name];
       }

       if (this.superclass) {
           return this.superclass.findMethod(name);
       }
       return null;
    }

    findStaticMethod(name) {

        if (name in this.staticMethods) {
            return this.staticMethods[name];
        }

        if (this.superclass) {
            return this.superclass
                .findStaticMethod(name);
        }

        return null;
    }

    arity() {

        const initializer =
            this.findMethod("init");

        if (!initializer) {
            return 0;
        }

        return initializer.arity();
    }

    call(interpreter, args) {

        const instance =
            new LumaInstance(this);

        const initializer =
            this.findMethod("init");

        if (initializer) {

            initializer
                .bind(instance)
                .call(
                    interpreter,
                    args
                );
        }

        return instance;
    }
}