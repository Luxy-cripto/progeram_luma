import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";

test("FileLibrary mendukung write, append, read, exists, dan delete", () => {
    const filename = "test-file-library.txt";

    try {
        const output = execFileSync(
            "luma",
            ["test/file-library.luma"],
            {
                encoding: "utf8",
                cwd: process.cwd(),
            }
        );

        // Hapus kode warna ANSI dari output terminal.
        const cleanOutput = output.replace(
            /\x1B\[[0-9;]*m/g,
            ""
        );

        assert.equal(
            cleanOutput.trim(),
            "Baris pertama\nBaris kedua\n\ntrue\nfalse"
        );

        assert.equal(fs.existsSync(filename), false);
    } finally {
        if (fs.existsSync(filename)) {
            fs.unlinkSync(filename);
        }
    }
});
