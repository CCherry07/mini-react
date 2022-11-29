import { getPackagesJSON, getBaseRollupPlugins, resolvePkgPatch } from './utils'
import generatePackageJson from 'rollup-plugin-generate-package-json';
import alias from '@rollup/plugin-alias';
const { name, module } = getPackagesJSON('react-dom')
const pkgPath = resolvePkgPatch(name)
const pkgDistPath = resolvePkgPatch(name, true)
export default [
  // react-dom
  {
    input: `${pkgPath}/${module}`,
    output: [{
      file: `${pkgDistPath}/index.js`,
      name: 'index.js',
      formate: 'umd',
    }, {
      file: `${pkgDistPath}/client.js`,
      name: 'client.js',
      formate: 'umd',
    }],
    plugins: [...getBaseRollupPlugins(),
    alias({
      entries: {
        hostConfig: `${pkgPath}/src/hostConfig.ts`
      }
    }),
    generatePackageJson({
      inputFolder: pkgPath,
      outputFolder: pkgDistPath,
      baseContents: ({ name, description, version }) => ({
        name, description, version,
        peerDependencies: {
          react: version
        },
        main: 'index.js'
      })
    })]
  },
]
