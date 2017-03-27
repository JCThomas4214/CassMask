"use strict";

const { FuseBox, ReplacePlugin, TypeScriptHelpers, JSONPlugin, UglifyJSPlugin } = require('fuse-box');
const path = require('path');

const fuseBox = FuseBox.init({
    package: {
    	name: 'cassmask',
    	main: 'index.ts'
    },
    globals: { 'cassmask': '*' },
    homeDir: './',
    outFile: `index.js`,
    plugins: [
        TypeScriptHelpers(),
        JSONPlugin(),
        UglifyJSPlugin()
    ]
}).bundle('>[src/index.ts]');