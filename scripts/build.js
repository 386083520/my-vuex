const execa = require('execa')

async function run(config, files) {
    await Promise.all([build(config), copy()])
}

async function build(config) {
    await execa('rollup', ['-c', config], { stdio: 'inherit' })
}

async function copy() {
}

module.exports = { run }
