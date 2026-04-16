import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": dirname,
      "server-only": path.resolve(dirname, "tests/mocks/empty.ts"),
    },
  },
  test: {
    environment: "node",
    clearMocks: true,
    restoreMocks: true,
  },
});
