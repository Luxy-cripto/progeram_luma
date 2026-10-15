import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("FileError menampilkan pesan yang jelas saat file tidak ditemukan", () => {
    const result = spawnSync(
        "luma",
        ["test/file-error.luma"],
        {
            encoding: "utf8",
            cwd: process.cwd(),
        }
    );

    assert.equal(result.status, 1);

    assert.match(
        result.stderr,
        /File tidak ditemukan: file-yang-tidak-ada\.txt/
    );

    assert.doesNotMatch(
        result.stderr,
        /at .*:\d+:\d+/
    );
});
