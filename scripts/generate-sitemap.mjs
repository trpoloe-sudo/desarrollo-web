import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectDir = path.resolve(__dirname, '..')
const publicDir = path.join(projectDir, 'public')
const catalogPath = path.join(projectDir, 'server', 'data', 'catalog.json')

const toIsoDate = (value = new Date()) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? new Date().toISOString().slice(0, 10) : date.toISOString().slice(0, 10)
}

const normalizeUrl = (value) => String(value || 'http://localhost:5173').trim().replace(/\/$/, '')
const normalizeRouterMode = (value) => String(value || 'hash').trim().toLowerCase()
const isHashRouter = (routerMode) => routerMode !== 'history'

const parseEnvFile = async (filePath) => {
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return raw.split(/\r?\n/).reduce((accumulator, line) => {
      const trimmedLine = line.trim()

      if (!trimmedLine || trimmedLine.startsWith('#')) {
        return accumulator
      }

      const separatorIndex = trimmedLine.indexOf('=')

      if (separatorIndex <= 0) {
        return accumulator
      }

      const key = trimmedLine.slice(0, separatorIndex).trim()
      const value = trimmedLine.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '')

      if (key) {
        accumulator[key] = value
      }

      return accumulator
    }, {})
  } catch {
    return {}
  }
}

const loadEnv = async () => {
  const files = [
    path.join(projectDir, '.env'),
    path.join(projectDir, '.env.local')
  ]

  const values = {}

  for (const filePath of files) {
    Object.assign(values, await parseEnvFile(filePath))
  }

  return values
}

const readCatalogProducts = async () => {
  try {
    const raw = await fs.readFile(catalogPath, 'utf8')
    const parsed = JSON.parse(raw)

    if (Array.isArray(parsed?.managedProducts)) {
      return parsed.managedProducts
    }

    if (Array.isArray(parsed?.items)) {
      return parsed.items
    }

    if (Array.isArray(parsed)) {
      return parsed
    }

    return []
  } catch {
    return []
  }
}

const buildSitemapXml = ({ siteUrl, products, lastmod, routerMode }) => {
  const staticRoutes = [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/products', changefreq: 'daily', priority: '0.9' }
  ]

  const productRoutes = products
    .map((product) => {
      const id = String(product?.id || '').trim()
      return id ? { path: `/product/${encodeURIComponent(id)}`, changefreq: 'weekly', priority: '0.7' } : null
    })
    .filter(Boolean)

  const routes = [...staticRoutes, ...productRoutes]

  const urlEntries = routes.map((route) => {
    const loc = isHashRouter(routerMode) && route.path !== '/'
      ? `${siteUrl}/#${route.path}`
      : `${siteUrl}${route.path}`

    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${route.changefreq}</changefreq>`,
      `    <priority>${route.priority}</priority>`,
      '  </url>'
    ].join('\n')
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urlEntries,
    '</urlset>',
    ''
  ].join('\n')
}

const buildRobotsTxt = ({ siteUrl }) => {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /dashboard',
    'Disallow: /auth',
    'Disallow: /checkout',
    'Disallow: /cart',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    ''
  ].join('\n')
}

const main = async () => {
  const env = await loadEnv()
  const siteUrl = normalizeUrl(process.env.VITE_SITE_URL || env.VITE_SITE_URL)
  const routerMode = normalizeRouterMode(process.env.VITE_ROUTER_MODE || env.VITE_ROUTER_MODE)
  const products = await readCatalogProducts()
  const lastmod = toIsoDate()

  await fs.mkdir(publicDir, { recursive: true })
  await fs.writeFile(
    path.join(publicDir, 'sitemap.xml'),
    buildSitemapXml({ siteUrl, products, lastmod, routerMode }),
    'utf8'
  )
  await fs.writeFile(
    path.join(publicDir, 'robots.txt'),
    buildRobotsTxt({ siteUrl }),
    'utf8'
  )

  console.log(`Sitemap generado para ${siteUrl} con ${products.length} productos en modo ${routerMode}.`)
}

main().catch((error) => {
  console.error('No se pudo generar el sitemap:', error)
  process.exitCode = 1
})
