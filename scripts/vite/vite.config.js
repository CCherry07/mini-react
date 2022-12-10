import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import replace from '@rollup/plugin-replace'
import { resolvePkgPatch } from '../rollup/utils'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
  replace({ __DEV__: true, preventAssignment: true }),
  ],
  resolve: {
    alias: [
      {
        find: 'react',
        replacement: resolvePkgPatch('react'),
      },
      {
        find: 'react-dom',
        replacement: resolvePkgPatch('react-dom'),
      },
      {
        find: 'hostConfig',
        replacement: path.resolve(
          resolvePkgPatch('react-dom'),
          './src/hostConfig.ts'
        )
      }
    ]
  }
})
