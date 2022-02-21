import { createEntries } from './rollup.config'

export default createEntries([
    { input: 'src/index.js', file: 'dist/vuex.js', format: 'umd', env: 'development' },
])
