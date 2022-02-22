import applyMixin from './mixin'
import { forEachValue } from './util'
import ModuleCollection from './module/module-collection'

let Vue

export class Store {
    constructor (options = {}) {
        console.log('gsdoptions', options)
        this._actions = Object.create(null)
        this._mutations = Object.create(null)
        this._wrappedGetters = Object.create(null)

        this._modules = new ModuleCollection(options)
        console.log('gsd_modules', this._modules)
        const state = this._modules.root.state
        installModule(this, state, [], this._modules.root)

        console.log('gsdabc', this._actions)
        console.log('gsdabc1', this._mutations)
        console.log('gsdabc2', this._wrappedGetters)
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

function installModule (store, rootState, path, module, hot) {
    const namespace = ''
    const local = {
        state: rootState
    }
    module.forEachMutation((mutation, key) => {
        const namespacedType = namespace + key
        registerMutation(store, namespacedType, mutation, local)
    })
    module.forEachAction((action, key) => {
        const type = namespace + key
        const handler = action.handler || action
        registerAction(store, type, handler, local)
    })
    module.forEachGetter((getter, key) => {
        const namespacedType = namespace + key
        registerGetter(store, namespacedType, getter, local)
    })
    module.forEachChild((child, key) => {
        installModule(store, rootState, path.concat(key), child, hot)
    })
}

function registerMutation (store, type, handler, local) {
    const entry = store._mutations[type] || (store._mutations[type] = [])
    entry.push(function wrappedMutationHandler (payload) {
        handler.call(store, local.state, payload)
    })
}

function registerAction (store, type, handler, local) {
    const entry = store._actions[type] || (store._actions[type] = [])
    entry.push(function wrappedActionHandler (payload) {
        let res = handler.call(store, {}, payload)
    })
}

function registerGetter (store, type, rawGetter, local) {
    if (store._wrappedGetters[type]) {
        console.error(`[vuex] duplicate getter key: ${type}`)
        return
    }
    store._wrappedGetters[type] = function wrappedGetter (store) {
        return rawGetter()
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
