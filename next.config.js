/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["react-photo-album.com", "source.unsplash.com"],
  },
  compiler: {
    styledComponents: true,
  },
  transpilePackages: ["@mui/material", "@mui/lab", "@mui/icons-material"],
};

const withNextIntl = require("next-intl/plugin")(
  // This is the default (also the `src` folder is supported out of the box)
  "./i18n.ts"
);

module.exports = withNextIntl(nextConfig);
