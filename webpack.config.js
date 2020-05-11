module.exports = {
    mode: 'development',
    entry: {
        index: './src/js/index.js',
        result: './src/js/result.js',
        common: './src/js/common.js',
        slider: './src/js/slider.js'
    },
    devtool: 'source-map',
    output: {
        filename: '[name].bundle.js',
        path: __dirname + '/dist/bundle'
    }
};

