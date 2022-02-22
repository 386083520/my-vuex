import applyMixin from './mixin'
import { forEachValue } from './util'
import ModuleCollection from './module/module-collection'

let Vue

export class Store {
    constructor (options = {}) {
        console.log('gsdoptions', options)

        this._modules = new ModuleCollection(options)
        console.log('gsd_modules', this._modules)
        const state = options.state
        this._wrappedGetters = options.getters

        const store = this
        const { dispatch, commit } = this
        this.dispatch = function boundDispatch (type, payload) {
            return dispatch.call(store, type, payload)
        }
        this.commit = function boundCommit (type, payload, options) {
            return commit.call(store, type, payload, options)
        }

        resetStoreVM(this, state)
    }
    get state () {
        return this._vm._data.$$state
    }
    commit (_type, _payload, _options) {

    }
    dispatch (_type, _payload) {

    }
}

export function install (_Vue) {
    Vue = _Vue
    applyMixin(Vue)
}

function resetStoreVM (store, state, hot) {
    store.getters = {}
    const wrappedGetters = store._wrappedGetters
    const computed = {}
    forEachValue(wrappedGetters, (fn, key) => {
        computed[key] = () => {
            return fn(store.state)
        }
        Object.defineProperty(store.getters, key, {
            get: () => store._vm[key]
        })
    })


    store._vm = new Vue({
        data: {
            $$state: state
        },
        computed
    })
    console.log('gsdstore_vm', store)
}
