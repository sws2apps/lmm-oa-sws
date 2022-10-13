import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
		APP_VERSION: JSON.stringify(process.env.npm_package_version),
	},
  plugins: [react(), eslint()],
  server: {
    port: 4000,
    host: true,
	},
	preview: {
    port: 4000,
	},
})
