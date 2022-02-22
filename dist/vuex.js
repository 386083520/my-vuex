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
    }

    let Vue;

    class Store {
        constructor (options = {}) {
            console.log('gsdoptions', options);

            this._modules = new ModuleCollection(options);
            console.log('gsd_modules', this._modules);
            const state = options.state;
            this._wrappedGetters = options.getters;

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

        }
        dispatch (_type, _payload) {

        }
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
