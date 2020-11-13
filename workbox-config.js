module.exports = {
    // a directory should be the same as "reactSnap.destination",
    // which default value is `build`
    globDirectory: "build/",
    globPatterns: [
      "static/css/*.css",
      "static/js/*.js",
      "shell.html",
      "index.html"
    ],
    // there is "reactSnap.include": ["/shell.html"] in package.json
    navigateFallback: "/shell.html",
    // Ignores URLs starting from /__ (useful for Firebase):
    // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
    navigateFallbackAllowlist: [/^(?!\/__).*/],
    // configuration specific to this experiment
    runtimeCaching: [
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'images'
        }
      },
      {
        urlPattern: /\.(?:js)$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'scripts'
        }
      },
      {
        urlPattern: /api/,
        handler: "StaleWhileRevalidate"
      }
    ],
    swDest: 'build/service-worker.js',
    globIgnores: [
      "../workbox-config.js"
    ]
  };
  