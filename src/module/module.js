import { forEachValue } from '../util'
export default class Module {
    constructor (rawModule, runtime) {
        this.runtime = runtime
        this._children = Object.create(null)
        this._rawModule = rawModule
        const rawState = rawModule.state
        this.state = rawState
    }
    getChild (key) {
        return this._children[key]
    }
    addChild (key, module) {
        this._children[key] = module
    }

    forEachChild (fn) {
        forEachValue(this._children, fn)
    }

    forEachGetter (fn) {
        if (this._rawModule.getters) {
            forEachValue(this._rawModule.getters, fn)
        }
    }

    forEachAction (fn) {
        if (this._rawModule.actions) {
            forEachValue(this._rawModule.actions, fn)
        }
    }

    forEachMutation (fn) {
        if (this._rawModule.mutations) {
            forEachValue(this._rawModule.mutations, fn)
        }
    }
}
