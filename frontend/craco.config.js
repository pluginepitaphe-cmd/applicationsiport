// Load configuration from environment or config file
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      // Add postcss-preset-env to handle CSS features and potential calc issues
      webpackConfig.module.rules.push({
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('postcss-preset-env')({
                    stage: 3,
                    features: {
                      'nesting-rules': true,
                      'custom-properties': true,
                      // 'calc': true, // Disabling calc processing here for now
                    },
                  }),
                ],
              },
            },
          },
        ],
      });

      return webpackConfig;
    },
  },
};


