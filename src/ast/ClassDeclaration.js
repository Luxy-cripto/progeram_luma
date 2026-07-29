export class ClassDeclaration {

    constructor(
        name,
        superclass,
        methods,
        staticMethods = []
    ) {

        this.name =
            name;

        this.superclass =
            superclass;

        this.methods =
            methods;

        this.staticMethods =
            staticMethods;
    }

}