const CompressionPlugin = require('compression-webpack-plugin');
module.exports = function override(config, env) {
    config.plugins.push(new CompressionPlugin())
    return config;
};
