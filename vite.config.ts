import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js'
		}
	}
});
