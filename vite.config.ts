import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
  plugins: [remix({
    routes(defineRoutes) {
      return defineRoutes((route) => {
        route("/", "routes/_index.tsx");
        route("/webapi", "routes/webapi/layout.tsx", () => {
          route("", "routes/webapi/route.tsx")
          route("test", "routes/webapi/test.tsx")
        })
      });
    }
  }), tsconfigPaths()],
});
