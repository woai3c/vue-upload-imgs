import './assets/iconfont/iconfont.css'
import VueUploadImgs from './components/VueUploadImgs.vue'

const install = function (Vue) {
    Vue.component('VueUploadImgs', VueUploadImgs)
}

const API = {
    install,
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export { VueUploadImgs }
export default API
