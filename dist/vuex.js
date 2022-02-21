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

    class Store {
        constructor (options = {}) {
            console.log('gsdoptions', options);
        }
    }

    function install (_Vue) {
        console.log('gsdinstall', _Vue);
    }

    var index = {
        Store,
        install,
    };

    return index;

})));
