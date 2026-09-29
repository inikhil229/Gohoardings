

const nextConfig = { 
   // next.config.js

  i18n: {
    locales: ['en', 'in', 'ae'], // Add the languages your app supports
    defaultLocale: 'en', // Default language (if no language is selected or set)
    // localeDetection: true, // Automatically detect user language (optional)
  },

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

    return config;
  },
};

module.exports = nextConfig;
