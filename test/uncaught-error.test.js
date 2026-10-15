import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("Luma menampilkan pesan TypeError yang tidak tertangkap", () => {
    const result = spawnSync(
        "luma",
        ["test/uncaught-error.luma"],
        {
            encoding: "utf8",
            cwd: process.cwd(),
        }
    );

    assert.equal(result.status, 1);

    assert.match(
        result.stderr,
        /\[Luma Error\]\s*Tipe data tidak sesuai/
    );

    assert.doesNotMatch(
        result.stderr,
        /at .*:\d+:\d+/
    );
});
