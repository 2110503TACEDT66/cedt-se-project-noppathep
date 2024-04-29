import { defineConfig } from "cypress";

export default defineConfig({
  defaultCommandTimeout: 25000,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
