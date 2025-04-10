import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      name: "react-payments-js",
      entry: "./src/index.ts",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "@payjp/payments-js"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
