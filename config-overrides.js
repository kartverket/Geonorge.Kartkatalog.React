const CompressionPlugin = require('compression-webpack-plugin');

module.exports = function override(config, env) {
    config.plugins.push(new CompressionPlugin());

    // Use the modern Sass JS API to remove legacy API deprecation warnings
    config.module.rules.forEach(rule => {
        const oneOf = rule.oneOf;
        if (!oneOf) return;
        oneOf.forEach(r => {
            const use = r.use;
            if (!use) return;
            use.forEach(loader => {
                if (
                    loader.loader &&
                    loader.loader.includes('sass-loader') &&
                    loader.options
                ) {
                    loader.options.api = 'modern';
                }
            });
        });
    });

    return config;
};
