import { merge } from 'webpack-merge';
import base from './base';
import path from 'node:path';
import {generateHeader} from "../plugins/userscript.plugin";
import fs from "fs";

// Create loader userscript for loaders (e.g. tampermonkey) to load generated userscript.
const header = generateHeader();
const lines = header.split("\n");
// Append @require for index.prod.user.js above end header comment
lines.splice(lines.length - 2, 0, `// @require     file://${path.resolve(".", "userscripts", "index.dev.user.js")}`);
const userscript = lines.join("\n");
// Add instructions comment under end header comment
const instructions = [
    "// Copy this file to your userscript manager (e.g. tampermonkey) to install this userscript.",
    "// No extra code is needed, since your userscript manager will load the generated userscript automatically.",
    "// This userscript is just a loader for the generated userscript.",
].join("\n");
// Write loader userscript to userscripts/loader.user.js
fs.writeFileSync(path.resolve(".", "userscripts", "loader.dev.user.js"), `${userscript}\n\n${instructions}`);

export default merge(base, {
    mode: 'development',
    cache: {
        type: 'filesystem',
        name: 'dev',
    },
    output: {
        path: path.resolve(".", "userscripts"),
        filename: "index.dev.user.js",
    },
    devtool: 'eval-source-map',
    watch: true,
    watchOptions: {
        ignored: /node_modules/,
    },
});