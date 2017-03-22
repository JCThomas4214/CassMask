"use strict";

const { FuseBox, ReplacePlugin, TypeScriptHelpers, JSONPlugin, UglifyJSPlugin } = require('fuse-box');
const path = require('path');

const fuseBox = FuseBox.init({
    package: 'cassmask',
    globals: { 'cassmask': '*' },
    homeDir: './',
    outFile: `index.js`,
    plugins: [
        TypeScriptHelpers(),
        JSONPlugin(),
        UglifyJSPlugin()
    ]
}).bundle('>[index.ts]');