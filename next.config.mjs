import nextra from "nextra";

const withNextra = nextra({});

export default withNextra({
  // Next.js config
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ["**/node_modules/**", "**/.git/**", "**/.next/**"],
    };
    return config;
  },
});
