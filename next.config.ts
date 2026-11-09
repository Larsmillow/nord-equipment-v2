import type { NextConfig } from "next";

const legacyPages = [
  ["about.html", "/about"],
  ["account.html", "/account"],
  ["article.html", "/articles"],
  ["blog.html", "/articles"],
  ["cart.html", "/cart"],
  ["catalog.html", "/catalog"],
  ["category.html", "/category"],
  ["contacts.html", "/contacts"],
  ["delivery.html", "/delivery"],
  ["favorites.html", "/favorites"],
  ["index.html", "/"],
  ["product.html", "/product"],
  ["rent.html", "/rent"],
  ["warranty.html", "/warranty"],
] as const;

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return legacyPages.map(([source, destination]) => ({
      source: `/${source}`,
      destination,
      permanent: false,
    }));
  },
};

export default nextConfig;
