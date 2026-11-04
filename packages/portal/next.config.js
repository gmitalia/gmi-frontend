/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  output: "export",
  turbopack: {
    root: __dirname,
  },
  transpilePackages: ["refractor"],
  env: {
    NEXT_PUBLIC_MAINTENANCE_MODE:
      process.env.NEXT_PUBLIC_MAINTENANCE_MODE || "false",
  },
};
