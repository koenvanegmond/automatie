/** @type {import('next').NextConfig} */
const nextConfig = {
  // Markdown-content (blog, branchepagina's) wordt bij ISR op runtime gelezen: meenemen in de serverless bundel.
  experimental: {
    outputFileTracingIncludes: {
      "/**/*": ["./content/**/*"],
      // TTF-versies van de huisfonts voor de OG-beelden van /voorbeelden (next/og leest geen woff2).
      "/voorbeelden/**/*": ["./src/fonts/og/**/*"],
    },
  },

  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },

  async rewrites() {
    // Klikdemo is een losse statische pagina in public/demo.
    return [{ source: "/demo", destination: "/demo/index.html" }];
  },

  async redirects() {
    return [
      // Productie-host op vercel.app naar het eigen domein. Alleen exact deze host: preview-URL's blijven werken.
      { source: "/:path*", has: [{ type: "host", value: "automatie.vercel.app" }], destination: "https://appmaatje.com/:path*", permanent: true },
      { source: "/oplossingen/vastgoed", destination: "/oplossingen/advies-vastgoed", permanent: true },
      { source: "/oplossingen/uitzendbureaus", destination: "/oplossingen/handel-personeel", permanent: true },
      { source: "/oplossingen/horeca", destination: "/oplossingen/horeca-zorg-sport", permanent: true },
      { source: "/oplossingen/zorg", destination: "/oplossingen/horeca-zorg-sport", permanent: true },
    ];
  },
};

export default nextConfig;
