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

    let Vue;

    class Store {
        constructor (options = {}) {
            console.log('gsdoptions', options);
            const state = options.state;
            this._wrappedGetters = options.getters;
            resetStoreVM(this, state);
        }
        get state () {
            return this._vm._data.$$state
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
