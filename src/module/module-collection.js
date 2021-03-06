import Module from './module'
import { forEachValue } from '../util'
export default class ModuleCollection {
    constructor (rawRootModule) {
        this.register([], rawRootModule, false)
    }
    get (path) {
        return path.reduce((module, key) => {
            return module.getChild(key)
        }, this.root)
    }
    register (path, rawModule, runtime = true) {
        const newModule = new Module(rawModule, runtime)
        if (path.length === 0) {
            this.root = newModule
        }else {
            const parent = this.get(path.slice(0, -1))
            parent.addChild(path[path.length - 1], newModule)
        }
        if (rawModule.modules) {
            forEachValue(rawModule.modules, (rawChildModule, key) => {
                this.register(path.concat(key), rawChildModule, runtime)
            })
        }
    }
    getNamespace (path) {
        let module = this.root
        return path.reduce((namespace, key) => { // [a, b]
            module = module.getChild(key)
            console.log('gsdmodule', module)
            return namespace + (module.namespaced ? key + '/' : '')
        }, '')
    }
}
