<template>
    <div class="vue-upload-imgs" :class="disabled? 'vue-upload-disabled' : ''">
        <template v-if="type == 1">
            <label :for="id" class="upload-label-upload">{{ label }}</label>
            <slot></slot>
            <div class="upload-main-list">
                <div class="upload-div-img-list" v-for="(item, index) in files" v-show="item" :key="index">
                    <div class="upload-list-img-container">
                        <img :src="item.url">
                    </div>
                    <span class="upload-list-span">{{ item.name }}</span>
                    <span class="iconfont icon-shanchu" @click="remove(index)"></span>
                </div>
            </div>
        </template>
        
        <template v-else>
            <label :for="id" class="upload-label-upload" v-if="type == 2">{{ label }}</label>
            <slot></slot>
            <div class="upload-main">
                <div class="upload-div-img" v-for="(item, index) in files" v-show="item" :key="index">
                    <img :src="item.url">
                    <div class="upload-bg-img">
                        <span class="iconfont icon-icon-test" @click="preview(index)"></span>
                        <span class="iconfont icon-shanchu1" @click="remove(index)"></span>
                    </div>
                </div>
                <label class="upload-div-add-img" :for="id" v-show="!(limit !== 0 && limit == files.length)">
                    <span class="iconfont icon-icon-test"></span>
                </label>
            </div>
        </template>

        <input ref="vueUploadImg" :disabled="disabled" type="file" :id="id" :accept="access" hidden @change="fileChangeHandler" :multiple="multiple">
    </div>
</template>

<script>
export default {
    model: {
        prop: 'files',
        event: 'change',
    },
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        type: {
            type: Number,
            default: 0, // 0 预览模式 1 列表模式 2 预览模式 + 上传按钮
        },
        access: {
            type: String,
            default: 'image/*',
        },
        files: {
            type: Array,
            default: () => [], // 图片
            required: true,
        },
        label: {
            type: String,
            default: '点击上传', // 按钮文字
        },
        limit: {
            type: Number,
            default: 0, // 限制上传的图片数， 0 为不限制
        },
        maxSize: {
            type: Number,
            default: null, // 图片最大尺寸，超过将不添加并触发 oversize 事件
        },
        multiple: {
            type: Boolean,
            default: false, // 是否多选
        },
        compress: {
            type: Boolean,
            default: false, // 是否开启压缩
        },
        quality: {
            type: Number,
            default: 0.8, // 默认压缩质量
        },
        beforeRead: { // 读取前钩子函数
            type: Function,
            default: null,
        },
        afterRead: { // 读取后钩子函数
            type: Function,
            default: null,
        },
        beforeRemove: { // 移除前钩子函数
            type: Function,
            default: null,
        },
    },
    data() {
        return {
            id: 'file' + Math.random().toString(16).slice(-13).replace(/\./g, ''),
        }
    },
    methods: {
        remove(index) {
            if (this.disabled) return
            if (this.beforeRemove && !this.beforeRemove(index, this.files[index])) return
            const files = this.files.slice()
            files.splice(index, 1)
            this.$emit('change', files)
        },

        preview(index) {
            this.$emit('preview', index, this.files[index])
        },

        fileChangeHandler(e) {
            const newFiles = e.target.files
            if (this.beforeRead && !this.beforeRead(newFiles)) {
                this.$refs.vueUploadImg.value = ''
                return
            }

            if (!this.verify(this.files.length + newFiles.length)) return 
            this.readFiles(newFiles)
        },

        readFiles(newFiles) {
            let canvas, ctx
            if (this.compress) {
                canvas = document.createElement('canvas')
                ctx = canvas.getContext('2d')
            }

            const oldFiles = [...this.files]
            const result = []
            for (let i = 0, len = newFiles.length; i < len; i++) {
                const file = newFiles[i]
                if (file.type.includes('image')) {
                    const reader = new FileReader()
                    reader.onload = (res) => {
                        const fileResult = res.target.result 
                        if (!this.compress) {
                            this.fileLoaded(file, fileResult, result, len, oldFiles)
                        } else {
                            const img = new Image()
                            img.onload = () => {
                                const w = img.width
                                const h = img.height
                                canvas.setAttribute('width', w)
                                canvas.setAttribute('height', h)
                                ctx.drawImage(img, 0, 0, w, h)
                                const base64 = canvas.toDataURL(file.type, this.quality)
                                this.fileLoaded(file, base64, result, len, oldFiles)
                            }

                            img.src = fileResult
                        }
                    }

                    reader.readAsDataURL(file)
                }
            }
        },

        fileLoaded(file, content, result, len, oldFiles) {
            if (this.maxSize !== null && this.isOverSize(file)) {
                this.$emit('oversize', file)
                return
            }

            result.push({
                name: file.name,
                url: content,
                type: file.type,
                size: file.size,
            })

            if (len == result.length) {
                this.$emit('change', oldFiles.concat(result))
                this.afterRead && this.afterRead(result)
                this.$refs.vueUploadImg.value = ''
            }
        },

        isOverSize(file) {
            return file.size > this.maxSize
        },

        verify(len) {
            if (/^\d+$/.test(this.limit) && this.limit !== 0) {
                if (this.limit < len) {
                    this.$emit('exceed')
                    return false
                }
            }

            return true
        }
    },
}
</script>

<style>
@import '../assets/iconfont/iconfont.css';

.upload-label-upload {
    border-radius: 5px;
    font-size: 16px;
    padding: 6px 26px;
    background: #3594f2;
    color: #fff;
    font-weight: normal;
    cursor: pointer;
    display: inline-block;
}
.upload-main {
    font-size: 0;
}
.upload-div-add-img,
.upload-div-img {
    min-width: 148px;
    width: 148px;
    height: 148px;
    border-radius: 6px;
    border: 1px solid #c0ccda;
    overflow: hidden;
    position: relative;
    margin-right: 6px;
    margin-top: 5px;
    transition: opacity .3s;
    display: inline-block;
    font-size: 14px;
}
.upload-div-add-img {
    background-color: #fbfdff;
    border-style: dashed;
    cursor: pointer;
}
.upload-div-add-img .iconfont {
    font-size: 28px;
    color: #8c939d;
    font-weight: normal;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
.upload-div-img img {
    width: 100%;
    height: 100%;
}
.upload-div-img .iconfont {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    color: #fff;
    z-index: 1;
    cursor: pointer;
    font-size: 20px;
}
.upload-div-img .icon-icon-test {
    left: 40%;
}
.upload-div-img .icon-shanchu1 {
    left: 60%;
}
.upload-bg-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
    display: none;
}
.upload-div-img:hover {
    opacity: .8;
}
.upload-div-img:hover .upload-bg-img {
    display: block;
}
.upload-div-img-list {
    margin-top: 10px;
    border: 1px solid #c0ccda;
    padding: 8px;
    box-sizing: border-box;
    width: 212px;
    border-radius: 5px;
}
.upload-div-img-list .icon-shanchu {
    margin-left: 10px;
    cursor: pointer;
    color: #8c939d;
}
.upload-list-img-container {
    width: 50px;
    overflow: hidden;
    border-radius: 3px;
    border: 1px solid #c0ccda;
}
.upload-list-img-container img {
    width: 100%;
    height: 100%;
}
.upload-list-img-container,
.upload-list-span {
    display: inline-block;
    line-height: 50px;
    height: 50px;
    font-size: 14px;
    vertical-align: top;
}
.upload-list-span {
    width: 100px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.vue-upload-disabled .upload-label-upload {
    background-color: #F5F7FA;
    border-color: #E4E7ED;
    color: #C0C4CC;
    cursor: not-allowed;
}
.vue-upload-disabled .upload-div-add-img {
    cursor: not-allowed;
}
.vue-upload-disabled .icon-shanchu,
.vue-upload-disabled .icon-shanchu1 {
    cursor: not-allowed;
}
</style>