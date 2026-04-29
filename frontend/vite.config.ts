import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    // Provide a build-time default for the backend URL so that
    // import.meta.env.VITE_API_BASE_URL is always defined even when the
    // variable is not explicitly set.  On Railway the variable should be
    // configured as:  ${{ CuraSense.RAILWAY_PRIVATE_DOMAIN }}:8000
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
      process.env.VITE_API_BASE_URL || 'http://curasense.railway.internal:8000'
    ),
  },
  server: {
    allowedHosts: true,
  },
})