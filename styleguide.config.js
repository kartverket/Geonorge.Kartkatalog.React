const path = require('path')
module.exports = {
    title: "Kartkatalogen",
    styleguideDir: "docs",
    webpackConfig: require('react-scripts/config/webpack.config.js'),
    contextDependencies: [path.resolve(__dirname, 'src/components')],
    styleguideComponents: {
        Wrapper: path.join(__dirname, 'src/styleguide/Wrapper')
    },
    dangerouslyUpdateWebpackConfig(webpackConfig, env) {
        webpackConfig.output = {
            ...webpackConfig.output,
            publicPath: process.env.PUBLIC_URL || ''
        };
        return webpackConfig;
    },
    require: [
        path.join(__dirname, 'src/styleguide/styleguide.js')
    ],
    sections: [
        {
            name: 'Introduction',
            content: './src/styleguide/introduction.md'
        },
        {
            name: 'Components',
            content: './src/styleguide/introduction.md',
            sections: [
                {
                    name: 'Routes',
                    components: './src/components/routes/**/*.js'
                },
                {
                    name: 'Partials',
                    components: './src/components/partials/**/*.js'
                }
            ]
        },

    ],
    template: {
        head: {
            links: [
                {
                    rel: 'stylesheet',
                    href: 'src/styleguide/styleguide.css'
                }
            ]
        },
        favicon: 'src/styleguide/favicon.ico'
    },
    theme: {
        fontFamily: {
            base: '"Open Sans", sans-serif'
        }
    }
};