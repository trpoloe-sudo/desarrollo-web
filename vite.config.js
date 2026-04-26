import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = String(env.VITE_SITE_URL || 'https://ztartech.webcindario.com').replace(/\/$/, '')
  const hubspotPortalId = String(env.VITE_HUBSPOT_PORTAL_ID || '').trim()
  const hubspotScript = hubspotPortalId
    ? `<script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/${hubspotPortalId}.js"></script>`
    : ''

  return {
    plugins: [
      vue(),
      {
        name: 'inject-site-url',
        transformIndexHtml(html) {
          return html
            .replaceAll('__SITE_URL__', siteUrl)
            .replace('__HUBSPOT_SCRIPT__', hubspotScript)
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      port: 5173,
      open: true,
      proxy: {
        "/api": "http://localhost:3001"
      }
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            framework: ['vue', 'vue-router', 'pinia'],
            ui: ['lucide-vue-next'],
            http: ['axios']
          }
        }
      }
    }
  }
})
