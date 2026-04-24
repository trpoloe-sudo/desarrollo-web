import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectDir = path.resolve(__dirname, '..')

const textFiles = [
  '.env.example',
  'README.md',
  'index.html',
  'package.json',
  'render.yaml',
  'src/App.vue',
  'src/config/google.js',
  'src/router/index.js',
  'src/services/googleAuth.js',
  'src/services/pixelTracking.js',
  'server/index.js',
  'server/routes/auth.js'
]

const forbiddenPatterns = [
  {
    description: 'Google Client ID hardcodeado',
    pattern: /830570310646-ogjq785e6i3skd9hnv13mm3f797lj4gi\.apps\.googleusercontent\.com/
  },
  {
    description: 'Google Sheets API key hardcodeada',
    pattern: /AIza[0-9A-Za-z\-_]{20,}/
  },
  {
    description: 'Placeholder de tracking sin reemplazar',
    pattern: /YOUR_[A-Z0-9_]+/
  }
]

const issues = []

const main = async () => {
  for (const relativePath of textFiles) {
    const absolutePath = path.join(projectDir, relativePath)

    try {
      const content = await fs.readFile(absolutePath, 'utf8')

      if (content.includes('\u0000')) {
        issues.push(`${relativePath}: contiene bytes nulos`)
      }

      for (const rule of forbiddenPatterns) {
        if (rule.pattern.test(content)) {
          issues.push(`${relativePath}: ${rule.description}`)
        }
      }
    } catch (error) {
      issues.push(`${relativePath}: no se pudo leer (${error.message})`)
    }
  }

  if (issues.length > 0) {
    console.error('Lint de mantenimiento falló:\n')

    for (const issue of issues) {
      console.error(`- ${issue}`)
    }

    process.exitCode = 1
    return
  }

  console.log('Lint de mantenimiento OK.')
}

main().catch((error) => {
  console.error('No se pudo ejecutar el lint de mantenimiento:', error)
  process.exitCode = 1
})
