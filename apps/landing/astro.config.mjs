import node from '@astrojs/node';
import preact from "@astrojs/preact";
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        'react': 'preact/compat',
        'react-dom': 'preact/compat',
        'react-dom/test-utils': 'preact/compat',
        'react/jsx-runtime': 'preact/jsx-runtime',
      },
    },
  },

  devToolbar: {
    enabled: false,
  },

  integrations: [
    preact({
      compat: true,
    })
  ]
});