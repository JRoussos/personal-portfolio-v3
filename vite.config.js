import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react()
    ],
    resolve: {
        alias: {
            '@':            path.resolve(__dirname, './src'),
            '@components':  path.resolve(__dirname, './src/components'),
            '@pages':       path.resolve(__dirname, './src/pages'),
            '@contexts':    path.resolve(__dirname, './src/contexts'),
            '@hooks':       path.resolve(__dirname, './src/hooks'),
            '@assets':      path.resolve(__dirname, './src/assets'),
            '@styles':      path.resolve(__dirname, './src/styles'),
            '@routes':      path.resolve(__dirname, './src/routes'),
            '@utils':       path.resolve(__dirname, './src/utils'),
        },
    },
})
