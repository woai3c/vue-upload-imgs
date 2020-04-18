import VueUploadImg from './components/VueUploadImg.vue'

const install = function(Vue, opts = {}) {
    Vue.component('VueUploadImg', VueUploadImg)
}

const API = {
    install,
    version: '0.0.1',
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default API
