export class Store {
    constructor (options = {}) {
        console.log('gsdoptions', options)
    }
}

export function install (_Vue) {
    console.log('gsdinstall', _Vue)
}
