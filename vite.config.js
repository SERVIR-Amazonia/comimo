import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    origin: "http://127.0.0.1:8080",
  },
  build: {
    chunkSizeWarningLimit: 1000,
    manifest: true,
    plugins: [resolve(), babel({ exclude: "node_modules/**" })],
    rollupOptions: {
      preserveEntrySignatures: "exports-only",
      input: [
        "src/js/admin.jsx",
        "src/js/collect.jsx",
        "src/js/home.jsx",
        "src/js/login.jsx",
        "src/js/pageNotFound.jsx",
        "src/js/passwordRequest.jsx",
        "src/js/passwordReset.jsx",
        "src/js/register.jsx",
        "src/js/userAccount.jsx",
        "src/js/verifyUser.jsx",
      ],
      output: {
        dir: "dist/public",
      },
    },
  },
  plugins: [
    react({
      presets: ["@babel/preset-env", "@babel/preset-react", "@emotion/babel-preset-css-prop"],
      plugins: [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-transform-runtime",
        "babel-plugin-macros",
        "@emotion",
      ],
    }),
  ],
});
