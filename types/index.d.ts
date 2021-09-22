import { PluginFunction } from 'vue'

export interface UploadOptions {
    disabled?: boolean
    type?: number
    access?: string
    files: Array<any>
    label?: string
    limit?: number
    maxSize?: number
    multiple?: boolean
    compress?: boolean
    quality?: number
    beforeRead?: Function
    afterRead?: Function
    beforeRemove?: Function
}

declare module VueUploadImgs {
  export const install: PluginFunction<{}>
  export const version: string
}

export default VueUploadImgs
