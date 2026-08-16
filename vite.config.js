import { copyFileSync, cpSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const root = process.cwd();
const pages = Object.fromEntries(
  readdirSync(root)
    .filter((file) => file.endsWith(".html"))
    .map((file) => [file.replace(/\.html$/, ""), resolve(root, file)]),
);

export default defineConfig({
  appType: "mpa",
  plugins: [
    {
      name: "copy-root-metadata",
      buildStart() {
        rmSync(resolve(root, "dist"), { recursive: true, force: true });
      },
      closeBundle() {
        for (const file of ["robots.txt", "sitemap.xml", "llms.txt", "humans.txt"]) {
          copyFileSync(resolve(root, file), resolve(root, "dist", "client", file));
        }

        cpSync(
          resolve(root, "assets", "downloads"),
          resolve(root, "dist", "client", "assets", "downloads"),
          { recursive: true },
        );

        mkdirSync(resolve(root, "dist", "server"), { recursive: true });
        copyFileSync(resolve(root, "worker.js"), resolve(root, "dist", "server", "index.js"));

        mkdirSync(resolve(root, "dist", ".openai"), { recursive: true });
        copyFileSync(
          resolve(root, ".openai", "hosting.json"),
          resolve(root, "dist", ".openai", "hosting.json"),
        );
      },
    },
  ],
  build: {
    outDir: "dist/client",
    emptyOutDir: true,
    rollupOptions: {
      input: pages,
    },
  },
});
