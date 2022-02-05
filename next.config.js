const config = {
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        issuer: {
          and: [/\.(js|ts)x?$/]
        },
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              prettier: false,
              svgo: true,
              svgoConfig: { plugins: [{ removeViewBox: false }] },
              titleProp: true,
            },
          },
        ],
      });

      return config
},
};

module.exports = config;