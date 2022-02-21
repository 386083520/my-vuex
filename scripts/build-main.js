const { run } = require('./build')

const files = [
    'dist/vuex.common.js'
]

run('rollup.main.config.js', files)
