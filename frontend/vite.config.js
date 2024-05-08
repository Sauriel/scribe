import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import loadVersion from "vite-plugin-package-version";
import i18nResources from "vite-plugin-i18n-resources";
import markdown, { Mode } from "vite-plugin-markdown";
import { resolve } from "path";

const path = require("path")

function graphQlFile() {
  return {
    name: 'graphql-file',
    transform(src, id) {
      if (id.endsWith(".graphql") || id.endsWith(".gql")) {
        const str = JSON.stringify(src)
        return {
          code: "import gql from 'graphql-tag';const doc="+str+"; export default gql`${doc}`",
          map: null 
        }
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    i18nResources({
      path: resolve(__dirname, "./src"),
    }),
    loadVersion(),
    graphQlFile(),
    markdown({ mode: Mode.HTML })
  ],
  server: {
    port: 8080
  },
	resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "src")
      }
    ]
  }
})