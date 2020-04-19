import VueUploadImgs from './components/VueUploadImgs.vue'

const install = function(Vue, opts = {}) {
    Vue.component('VueUploadImgs', VueUploadImgs)
}

const API = {
    install,
    version: '0.0.1',
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default API
