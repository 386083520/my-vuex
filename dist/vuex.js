/*!
 * vuex v1.0.0
 * (c) 2022 Evan You
 * @license MIT
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vuex = factory());
}(this, (function () { 'use strict';

    function applyMixin (Vue) {
        Vue.mixin({ beforeCreate: vuexInit });
    }

    function vuexInit () {
        const options = this.$options;
        if (options.store) {
            this.$store = options.store;
        } else if (options.parent && options.parent.$store) {
            this.$store = options.parent.$store;
        }
    }

    function forEachValue (obj, fn) {
        Object.keys(obj).forEach(key => fn(obj[key], key));
    }

    class Module {
        constructor (rawModule, runtime) {
            this.runtime = runtime;
            this._children = Object.create(null);
            this._rawModule = rawModule;
            const rawState = rawModule.state;
            this.state = rawState;
        }
        getChild (key) {
            return this._children[key]
        }
        addChild (key, module) {
            this._children[key] = module;
        }

        forEachChild (fn) {
            forEachValue(this._children, fn);
        }

        forEachGetter (fn) {
            if (this._rawModule.getters) {
                forEachValue(this._rawModule.getters, fn);
            }
        }

        forEachAction (fn) {
            if (this._rawModule.actions) {
                forEachValue(this._rawModule.actions, fn);
            }
        }

        forEachMutation (fn) {
            if (this._rawModule.mutations) {
                forEachValue(this._rawModule.mutations, fn);
            }
        }

        get namespaced () {
            return !!this._rawModule.namespaced
        }
    }

    class ModuleCollection {
        constructor (rawRootModule) {
            this.register([], rawRootModule, false);
        }
        get (path) {
            return path.reduce((module, key) => {
                return module.getChild(key)
            }, this.root)
        }
        register (path, rawModule, runtime = true) {
            const newModule = new Module(rawModule, runtime);
            if (path.length === 0) {
                this.root = newModule;
            }else {
                const parent = this.get(path.slice(0, -1));
                parent.addChild(path[path.length - 1], newModule);
            }
            if (rawModule.modules) {
                forEachValue(rawModule.modules, (rawChildModule, key) => {
                    this.register(path.concat(key), rawChildModule, runtime);
                });
            }
        }
        getNamespace (path) {
            let module = this.root;
            return path.reduce((namespace, key) => { // [a, b]
                module = module.getChild(key);
                console.log('gsdmodule', module);
                return namespace + (module.namespaced ? key + '/' : '')
            }, '')
        }
    }

    let Vue;

    class Store {
        constructor (options = {}) {
            console.log('gsdoptions', options);
            this._actions = Object.create(null);
            this._mutations = Object.create(null);
            this._wrappedGetters = Object.create(null);

            this._modules = new ModuleCollection(options);
            console.log('gsd_modules', this._modules);
            const state = this._modules.root.state;
            installModule(this, state, [], this._modules.root);

            console.log('gsdabc', this._actions);
            console.log('gsdabc1', this._mutations);
            console.log('gsdabc2', this._wrappedGetters);
            console.log('gsdabc3', state);
            const store = this;
            const { dispatch, commit } = this;
            this.dispatch = function boundDispatch (type, payload) {
                return dispatch.call(store, type, payload)
            };
            this.commit = function boundCommit (type, payload, options) {
                return commit.call(store, type, payload, options)
            };

            resetStoreVM(this, state);
        }
        get state () {
            return this._vm._data.$$state
        }
        commit (_type, _payload, _options) {
            const entry = this._mutations[_type];
            if (!entry) {
                console.error(`[vuex] unknown mutation type: ${type}`);
                return
            }
            entry.forEach(function commitIterator (handler) {
                handler(_payload);
            });
        }
        dispatch (_type, _payload) {

        }
    }

    function getNestedState (state, path) {
        return path.reduce((state, key) => state[key], state)
    }

    function installModule (store, rootState, path, module, hot) {
        const isRoot = !path.length;
        const namespace = store._modules.getNamespace(path);
        console.log('gsdnamespace', namespace);
        if (!isRoot) {
            const parentState = getNestedState(rootState, path.slice(0, -1));
            const moduleName = path[path.length - 1];
            Vue.set(parentState, moduleName, module.state);
        }

        const local = {
            state: rootState
        };
        module.forEachMutation((mutation, key) => {
            const namespacedType = namespace + key;
            registerMutation(store, namespacedType, mutation, local);
        });
        module.forEachAction((action, key) => {
            const type = namespace + key;
            const handler = action.handler || action;
            registerAction(store, type, handler);
        });
        module.forEachGetter((getter, key) => {
            const namespacedType = namespace + key;
            registerGetter(store, namespacedType, getter, local);
        });
        module.forEachChild((child, key) => {
            installModule(store, rootState, path.concat(key), child);
        });
    }

    function registerMutation (store, type, handler, local) {
        const entry = store._mutations[type] || (store._mutations[type] = []);
        entry.push(function wrappedMutationHandler (payload) {
            handler.call(store, local.state, payload);
        });
    }

    function registerAction (store, type, handler, local) {
        const entry = store._actions[type] || (store._actions[type] = []);
        entry.push(function wrappedActionHandler (payload) {
            handler.call(store, {}, payload);
        });
    }

    function registerGetter (store, type, rawGetter, local) {
        if (store._wrappedGetters[type]) {
            console.error(`[vuex] duplicate getter key: ${type}`);
            return
        }
        store._wrappedGetters[type] = function wrappedGetter (store) {
            return rawGetter(local.state)
        };
    }

    function install (_Vue) {
        Vue = _Vue;
        applyMixin(Vue);
    }

    function resetStoreVM (store, state, hot) {
        store.getters = {};
        const wrappedGetters = store._wrappedGetters;
        const computed = {};
        forEachValue(wrappedGetters, (fn, key) => {
            computed[key] = () => {
                return fn(store.state)
            };
            Object.defineProperty(store.getters, key, {
                get: () => store._vm[key]
            });
        });


        store._vm = new Vue({
            data: {
                $$state: state
            },
            computed
        });
        console.log('gsdstore_vm', store);
    }

    var index = {
        Store,
        install,
    };

    return index;

})));
