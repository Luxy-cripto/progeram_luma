export class NativeFunction {

    constructor(fn) {
        this.fn = fn;
    }

    call(interpreter, args) {
        return this.fn(args);
    }
}