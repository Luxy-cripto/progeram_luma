import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

test("Luma menangani ValueError dan Error melalui try/catch", () => {
    const output = execFileSync(
        "luma",
        ["test/error-types.luma"],
        {
            encoding: "utf8",
            cwd: process.cwd(),
        }
    );

    assert.equal(
        output.trim(),
        "Nilai tidak valid\nValueError\nKesalahan umum\nError"
    );
});
