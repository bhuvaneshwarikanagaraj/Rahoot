const nextConfig = {
  // output: "standalone", // Disabled for Netlify deployment
  productionBrowserSourceMaps: false,
  transpilePackages: ["packages/*", "@t3-oss/env-nextjs"],
  // Netlify-specific configuration
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

export default nextConfig
