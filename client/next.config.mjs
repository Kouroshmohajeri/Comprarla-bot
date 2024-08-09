import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias["@"] = join(__dirname, "app");
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8800/api/:path*",
      },
    ];
  },
};
