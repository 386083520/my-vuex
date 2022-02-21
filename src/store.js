import applyMixin from './mixin'

let Vue

export class Store {
    constructor (options = {}) {
        console.log('gsdoptions', options)
    }
}

export function install (_Vue) {
    Vue = _Vue
    applyMixin(Vue)
}
