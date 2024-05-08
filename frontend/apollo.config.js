// apollo.config.js
module.exports = {
  client: {
    service: {
      name: "scribe",
      url: import.meta.env.VITE_GRAPHQL_URL,
    },
    // Files processed by the extension
    includes: [
      "src/**/*.vue",
      "src/**/*.ts",
      "src/**/*.js",
    ],
  },
}