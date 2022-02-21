import applyMixin from './mixin'
import { forEachValue } from './util'

let Vue

export class Store {
    constructor (options = {}) {
        console.log('gsdoptions', options)
        const state = options.state
        this._wrappedGetters = options.getters
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
    store.getters = {}
    const wrappedGetters = store._wrappedGetters
    forEachValue(wrappedGetters, (fn, key) => {
        Object.defineProperty(store.getters, key, {
            get: () => fn(store.state)
        })
    })


    store._vm = new Vue({
        data: {
            $$state: state
        }
    })
    console.log('gsdstore_vm', store)
}
