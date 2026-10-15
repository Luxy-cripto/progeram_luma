import test from "node:test";
import assert from "node:assert/strict";

import { LumaError } from "../src/runtime/LumaError.js";
import { LumaTypeError } from "../src/runtime/LumaTypeError.js";
import { LumaValueError } from "../src/runtime/LumaValueError.js";
import { LumaFileError } from "../src/runtime/LumaFileError.js";

test("LumaError menyimpan pesan dan tipe default", () => {
    const error = new LumaError("Terjadi kesalahan");

    assert.equal(error.message, "Terjadi kesalahan");
    assert.equal(error.name, "Error");
    assert.equal(error.type, "Error");
});

test("LumaTypeError memiliki tipe yang benar", () => {
    const error = new LumaTypeError("Tipe tidak sesuai");

    assert.ok(error instanceof LumaError);
    assert.equal(error.message, "Tipe tidak sesuai");
    assert.equal(error.name, "TypeError");
    assert.equal(error.type, "TypeError");
});

test("LumaValueError memiliki tipe yang benar", () => {
    const error = new LumaValueError("Nilai tidak valid");

    assert.ok(error instanceof LumaError);
    assert.equal(error.message, "Nilai tidak valid");
    assert.equal(error.name, "ValueError");
    assert.equal(error.type, "ValueError");
});

test("LumaFileError memiliki tipe yang benar", () => {
    const error = new LumaFileError("File tidak ditemukan");

    assert.ok(error instanceof LumaError);
    assert.equal(error.message, "File tidak ditemukan");
    assert.equal(error.name, "FileError");
    assert.equal(error.type, "FileError");
});
