import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// Two modes:
//  - `vite` / `vite build` with LIB unset -> runs the demo playground (index.html)
//  - `LIB=1 vite build`                   -> builds the distributable library
const isLib = process.env.LIB === "1";

export default defineConfig(
  isLib
    ? {
        plugins: [react(), dts({ rollupTypes: true, include: ["src"] })],
        build: {
          lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "PhoneUI",
            fileName: "phone-ui",
          },
          rollupOptions: {
            external: ["react", "react-dom", "react/jsx-runtime"],
            output: {
              globals: {
                react: "React",
                "react-dom": "ReactDOM",
                "react/jsx-runtime": "jsxRuntime",
              },
            },
          },
        },
      }
    : {
        plugins: [react()],
        // Served under /phone-ui/ on GitHub Pages; root locally.
        base: process.env.GHPAGES ? "/phone-ui/" : "/",
        // Demo site build (e.g. for GitHub Pages); kept separate from the library dist/.
        build: { outDir: "demo-dist" },
      },
);
