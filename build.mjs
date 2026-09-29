import * as esbuild from 'esbuild'
import { cpSync, mkdirSync, writeFileSync } from 'fs'

const prod = process.env.NODE_ENV === 'production'

const define = {
  __SUPABASE_URL__:      JSON.stringify(process.env.SUPABASE_URL      ?? ''),
  __SUPABASE_ANON_KEY__: JSON.stringify(process.env.SUPABASE_ANON_KEY ?? ''),
  __APP_ENV__:           JSON.stringify(process.env.APP_ENV            ?? 'development'),
}

mkdirSync('dist/styles', { recursive: true })

await esbuild.build({
  entryPoints: ['src/main.js'],
  bundle:      true,
  minify:      prod,
  sourcemap:   !prod,
  outfile:     'dist/app.js',
  format:      'esm',
  define,
  logLevel: 'info',
})

// Copia assets estáticos
cpSync('public',     'dist',         { recursive: true, force: true })
cpSync('src/styles', 'dist/styles',  { recursive: true, force: true })

// Service Worker copiado como arquivo standalone (não bundlado)
import { copyFileSync } from 'fs'
copyFileSync('src/sw.js', 'dist/sw.js')

console.log('Build concluído.')
