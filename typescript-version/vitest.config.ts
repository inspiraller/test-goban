import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html', 'clover', 'json'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts*'], 
      exclude: ['node_modules', 'redis','__tests__', 'src/types/*'],
    },
    include: ['__tests__/**/*.{test,spec}.{js,ts,jsx,tsx}'], // Include test files in __tests__ folder
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});