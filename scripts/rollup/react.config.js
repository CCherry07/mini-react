import { getPackagesJSON, getBaseRollupPlugins, resolvePkgPatch } from './utils'

const { name, module } = getPackagesJSON('react')
const pkgPath = resolvePkgPatch(name)
const pkgDistPath = resolvePkgPatch(name, true)
export default [
  // react
  {
    input: `${pkgPath}/${module}`,
    output: {
      file: `${pkgDistPath}/index.js`,
      name: 'index.js',
      formate: 'umd',
    },
    plugins: getBaseRollupPlugins()
  },

  // jsx-runtime
  {
    input: `${pkgPath}/src/jsx.ts`,
    output: [
      // pro
      {
        file: `${pkgDistPath}/jsx-runtime.js`,
        name: 'jsx-runtime.js',
        formate: 'umd',
      },
      //dev
      {
        file: `${pkgDistPath}/jsx-dev-runtime.js`,
        name: 'jsx-dev-runtime.js',
        formate: 'umd',
      }
    ],
    plugins: getBaseRollupPlugins()
  }
]
