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
}
