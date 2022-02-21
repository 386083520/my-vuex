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

    let Vue;

    class Store {
        constructor (options = {}) {
            console.log('gsdoptions', options);
            const state = options.state;
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
        store._vm = new Vue({
            data: {
                $$state: state
            }
        });
        console.log('gsdstore_vm', store._vm);
    }

    var index = {
        Store,
        install,
    };

    return index;

})));
