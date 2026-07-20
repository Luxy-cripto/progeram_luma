import readlineSync from "readline-sync";

export function input() {
    return readlineSync.question("");
}