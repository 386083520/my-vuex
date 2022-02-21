export default function (Vue) {
    Vue.mixin({ beforeCreate: vuexInit })
}

function vuexInit () {
    const options = this.$options
    if (options.store) {
        this.$store = options.store
    } else if (options.parent && options.parent.$store) {
        this.$store = options.parent.$store
    }
}
