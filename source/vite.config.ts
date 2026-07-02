import { defineConfig, loadEnv } from "vite";
import type { Plugin } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";

// Runs the Vercel serverless function during `vite dev`, where the Vercel
// runtime doesn't exist. Also keeps Vite's transform pipeline from trying to
// compile api/github.ts as a browser module when the page fetches /api/github.
function devApiGithub(): Plugin {
  return {
    name: "dev-api-github",
    apply: "serve",
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.root, "");
      if (env.GITHUB_TOKEN && !process.env.GITHUB_TOKEN) {
        process.env.GITHUB_TOKEN = env.GITHUB_TOKEN;
      }

      server.middlewares.use("/api/github", (req, res) => {
        void (async () => {
          try {
            const { default: handler } = (await server.ssrLoadModule(
              "/api/github.ts",
            )) as {
              default: (req: unknown, res: unknown) => Promise<void>;
            };

            const url = new URL(req.url ?? "/", "http://localhost");
            const query = { path: url.searchParams.get("path") ?? undefined };

            const shim = {
              status(code: number) {
                res.statusCode = code;
                return shim;
              },
              setHeader(name: string, value: string) {
                res.setHeader(name, value);
              },
              json(payload: unknown) {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(payload));
              },
            };

            await handler({ query }, shim);
          } catch {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "dev api handler failed" }));
          }
        })();
      });
    },
  };
}

export default defineConfig({
  plugins: [devApiGithub(), tailwindcss(), svelte()],
  build: {
    modulePreload: { polyfill: false },
  },
});
