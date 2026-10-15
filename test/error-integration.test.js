import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

test("Luma menangani TypeError melalui throw dan try/catch", () => {
    const output = execFileSync(
        "luma",
        ["test/error-integration.luma"],
        {
            encoding: "utf8",
            cwd: process.cwd(),
        }
    );

    assert.equal(
        output.trim(),
        "Tipe tidak sesuai\nTypeError"
    );
});
