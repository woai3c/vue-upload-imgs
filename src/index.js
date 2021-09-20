import './assets/iconfont/iconfont.css'
import VueUploadImgs from './components/VueUploadImgs.vue'

const install = function (Vue, opts = {}) {
    Vue.component('VueUploadImgs', VueUploadImgs)
}

const API = {
    install,
    version: '1.1.0',
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export { VueUploadImgs }
export default API
