const path = require('path');
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
        filename: 'lib/index.js',
        path: __root,
        libraryTarget: 'this',
    },
    watchOptions: {
        ignored: /node_modules/,
    },
};
