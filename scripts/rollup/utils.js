/* eslint-disable no-undef */
import path from 'path'
import fs from 'fs'
import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';
const pakPath = path.resolve(__dirname, '../../packages')
const distPath = path.resolve(__dirname, '../../dist/node_modules')

export function resolvePkgPatch(pkgName, isDist) {
  if (isDist) {
    return `${distPath}/${pkgName}`
  }
  return `${pakPath}/${pkgName}`
}

export function getPackagesJSON(pkgName) {
  const path = `${resolvePkgPatch(pkgName)}/package.json`
  const str = fs.readFileSync(path, {
    encoding: 'utf-8',
  })
  return JSON.parse(str)
}

export function getBaseRollupPlugins({
  typescript = {}
} = {}) {
  return [cjs(), ts(typescript)]
}
