import pkg from './package.json'
export function createEntries(configs) {
    return configs.map((c) => createEntry(c))
}

const banner = `/*!
 * vuex v${pkg.version}
 * (c) ${new Date().getFullYear()} Evan You
 * @license MIT
 */`

function createEntry(config) {
    const c = {
        input: config.input,
        output: {
            banner,
            file: config.file,
            format: config.format
        },
    }
    if (config.format === 'umd') {
        c.output.name = c.output.name || 'Vuex'
    }
    return c
}
