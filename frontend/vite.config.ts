import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // The page's Content-Security-Policy lists the API address it may call. localhost is always allowed; a phone build
  // pointed at a computer on the local network (VITE_NODE_BASE_URL=http://192.168.x.x:5001) needs that address added.
  const apiOrigin = (() => { try { return new URL(loadEnv(mode, process.cwd(), 'VITE_').VITE_NODE_BASE_URL).origin; } catch { return ''; } })();

  return {
    plugins: [
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
      { name: 'csp-api-origin', transformIndexHtml: (html: string) => html.replace('__API_ORIGIN__', apiOrigin) },
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
        // Code the website shares with the phone app (API client, translations, theme tokens)
        '@curasense/shared': path.resolve(__dirname, '../packages/shared/src'),
      },
    },
    server: {
      host: '0.0.0.0',
      allowedHosts: true,
      // Transform the lazy pages and the 3D scenes when the server starts, so the first visit to each does not wait for Vite to compile it.
      warmup: { clientFiles: ['./src/app/features/site/pages/*.tsx', './src/app/scenes/**/*.{ts,tsx}', './src/app/components/intro/**/*.{ts,tsx}'] },
    },
  }
})
