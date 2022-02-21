import applyMixin from './mixin'

let Vue

export class Store {
    constructor (options = {}) {
        console.log('gsdoptions', options)
        const state = options.state
        resetStoreVM(this, state)
    }
    get state () {
        return this._vm._data.$$state
    }
}

export function install (_Vue) {
    Vue = _Vue
    applyMixin(Vue)
}

function resetStoreVM (store, state, hot) {
    store._vm = new Vue({
        data: {
            $$state: state
        }
    })
    console.log('gsdstore_vm', store._vm)
}
