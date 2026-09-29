const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const nextConfig = {
  reactStrictMode: true, // Show all warning for better production build
  swcMinify: true, // minify js file
  images: {
     remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true, // Enable img optimization
       
  },

  webpack: (
    config,
    {dev,isServer,defaultLoaders}
  ) => {
    // Important: return the modified config
    config.module.rules.push({
      test: /\.mdx/,
      use: [
        defaultLoaders.babel, // Use default Babel loader
        {
          loader: "@mdx-js/loader",
          options: {
            // Specify any necessary options for the @mdx-js/loader
         
          },
        },
      ],
    });

    if (!dev && !isServer) {
      const optimization = {
        ...config.optimization,
        minimize: true,
        minimizer: [
          ...config.optimization.minimizer,
          new OptimizeCSSAssetsPlugin({
            cssProcessorPluginOptions: {
              preset: ["default", { discardComments: { removeAll: true } }], // minify css && scss file
            },
          }),
          new CssMinimizerPlugin(),
        ],
      };
      config.optimization = optimization;
    }
    return config;
  },
};

module.exports = nextConfig;
