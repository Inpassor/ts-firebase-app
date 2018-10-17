const path = require('path');
const CleanWebpack = require('clean-webpack-plugin');
const DtsBundle = require('dts-bundle-webpack');
const nodeExternals = require('webpack-node-externals');
const __root = path.resolve(__dirname);

module.exports = {
    mode: 'production',
    context: __root,
    entry: './src/index.ts',
    target: 'node',
    externals: [
        nodeExternals(),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'index.js',
        path: __root + '/lib',
        libraryTarget: 'this',
    },
    watchOptions: {
        ignored: /node_modules/,
    },
    plugins: [
        new CleanWebpack(['lib']),
        new DtsBundle({
            name: '@inpassor/firebase-app',
            main: __root + '/src/index.d.ts',
            out: __root + '/lib/index.d.ts',
        }),
    ],
};
