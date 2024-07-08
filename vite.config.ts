// vite.config.ts
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import dts from 'vite-plugin-dts'

export default defineConfig({
    build: {
        lib: {
            entry: './src/index.ts',  // Entry point of your library
            name: 'WernerSharedComponents',
            fileName: (format) => `werner-shared-components.${format}.js`,
        },
        rollupOptions: {
            // Ensure to externalize dependencies that you do not want to bundle into your library
            external: ['solid-js'],
            output: {
                // Provide global variables to use in the UMD build
                globals: {
                    'solid-js': 'Solid',
                },
            },
        },
    },
    plugins: [dts(), solidPlugin()],
});



