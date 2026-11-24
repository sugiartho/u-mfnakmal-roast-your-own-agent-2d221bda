// Roast Your Own Agent (Node 22, standard library only).
//
// One line, at most 200 characters, roasting the entrant's own AI agent.
// The line lives in LINE.txt next to this file. This program carries it to
// the judge: it reads the file, makes sure it is exactly one line of real
// text within the limit, and writes it to /output/entry.txt.
//
// Local test (outside the grader's sandbox, /bot and /output are faked):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const inputPath = join(botDir, "LINE.txt");
const outputPath = join(outDir, "entry.txt");

if (!existsSync(inputPath)) {
  throw new Error(`cannot find ${inputPath}: the roast line is missing`);
}

const raw = readFileSync(inputPath);
const text = raw.toString("utf8");
if (Buffer.from(text, "utf8").length !== raw.length) {
  throw new Error("LINE.txt is not valid UTF-8 text");
}

const roast = text.replace(/\r?\n$/, "");
const size = [...roast].length;
if (size < 1 || size > 200) {
  throw new Error(`roast must be 1 to 200 characters, got ${size}`);
}
if (roast.trim() === "") {
  throw new Error("roast must not be only white space");
}
if (roast.includes("\n") || roast.includes("\r")) {
  throw new Error("roast must fit on a single line");
}
// No control characters: the judge reads plain text, and a stray control
// byte would make the roast unreadable instead of funny.
if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(roast)) {
  throw new Error("roast must not contain control characters");
}
// Tight wording starts here: no padding spaces around the line itself.
if (roast !== roast.trim()) {
  throw new Error("roast must not start or end with white space");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outputPath, roast, "utf8");
const written = readFileSync(outputPath);
if (!written.equals(Buffer.from(roast, "utf8"))) {
  throw new Error("output does not match the roast line byte for byte");
}
console.log(`roast (${size} chars): ${roast}`);
