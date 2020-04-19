<template>
    <div class="vue-upload-img">
        <template v-if="type == 1">
            <label :for="id" class="label-upload">{{ label }}</label>
            <slot></slot>
            <div class="upload-main-list">
                <div class="div-upload-img-list" v-for="(item, index) in files" v-show="item" :key="index">
                    <div class="list-img-container">
                        <img :src="item.url">
                    </div>
                    <span class="list-span">{{ item.name }}</span>
                    <span class="iconfont icon-shanchu" @click="remove(index)"></span>
                </div>
            </div>
        </template>
        
        <template v-else>
            <label :for="id" class="label-upload" v-if="type == 2">{{ label }}</label>
            <slot></slot>
            <div class="upload-main">
                <div class="div-upload-img" v-for="(item, index) in files" v-show="item" :key="index">
                    <img :src="item.url">
                    <div class="upload-bg-img">
                        <span class="iconfont icon-icon-test" @click="preview(index)"></span>
                        <span class="iconfont icon-shanchu1" @click="remove(index)"></span>
                    </div>
                </div>
                <label class="div-add-img" :for="id" v-show="!(limit !== 0 && limit == files.length)">
                    <span class="iconfont icon-icon-test"></span>
                </label>
            </div>
        </template>

        <input type="file" :id="id" :accept="access" hidden @change="fileChangeHandler" :multiple="multiple">
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: Number,
            default: 0, // 0 只显示图片 1 图片按钮都显示 2 另一种显示模式
        },
        access: {
            type: String,
            default: 'image/png, image/jpeg',
        },
        files: {
            type: Array,
            default: () => [], // 图片
        },
        label: {
            type: String,
            default: '点击上传', // 按钮文字
        },
        limit: {
            type: Number,
            default: 1, // 限制上传的图片数， 0 为不限制
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
        beforeUpload: { // 上传前回调函数
            type: Function,
            default: null,
        },
    },
    data() {
        return {
            id: 'file' + Math.random().toString(16).slice(-13).replace(/\./g, ''),
            fileEle: null,
        }
    },
    mounted() {
        this.fileEle = document.querySelector('#' + this.id)
    },
    methods: {
        remove(index) {
            this.$emit('remove', index)
        },

        preview(index) {
            this.$emit('preview', index)
        },

        fileChangeHandler(e) {
            const files = this.fileEle.files
            if (this.beforeUpload && !this.beforeUpload(files)) {
                e.target.value = ''
                return
            }

            const oldLen = this.files.length
            const result = [...this.files]
            if (!this.verify(oldLen + files.length)) return 

            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            for (let i = 0, len = files.length; i < len; i++) {
                const file = files[i]
                if (file.type.includes('image')) {
                    const reader = new FileReader()
                    reader.readAsDataURL(file)
                    reader.onload = (res) => {
                        const fileResult = res.target.result 
                        if (!this.compress) {
                            result.push({
                                name: file.name,
                                url: fileResult,
                                type: file.type,
                                size: file.size,
                            })

                            if (len + oldLen == result.length) {
                                this.$emit('change', result)
                                e.target.value = ''
                            }
                        } else {
                            const img = new Image()
                            img.src = fileResult
                            img.onload = () => {
                                const w = img.width
                                const h = img.height
                                canvas.setAttribute("width", w)
                                canvas.setAttribute("height", h)
                                ctx.drawImage(img, 0, 0, w, h)
                                const base64 = canvas.toDataURL(file.type, this.quality)
                                result.push({
                                    name: file.name,
                                    url: base64,
                                    type: file.type,
                                    size: file.size,
                                })

                                if (len + oldLen == result.length) {
                                    this.$emit('change', result)
                                    e.target.value = ''
                                }
                            }
                        }
                    }
                }
            }
        },

        verify(len) {
            if (/^\d+$/.test(this.limit) && this.limit != 0) {
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

.vue-upload-img .label-upload {
    border-radius: 5px;
    font-size: 16px;
    padding: 6px 26px;
    background: #3594f2;
    color: #fff;
    font-weight: normal;
    cursor: pointer;
    display: inline-block;
    margin-bottom: 10px;
}
.vue-upload-img .upload-main {
    font-size: 0;
}
.vue-upload-img .div-add-img,
.vue-upload-img .div-upload-img {
    min-width: 148px;
    width: 148px;
    height: 148px;
    border-radius: 6px;
    border: 1px solid #c0ccda;
    overflow: hidden;
    position: relative;
    margin-right: 6px;
    margin-bottom: 5px;
    transition: opacity .3s;
    display: inline-block;
    font-size: 14px;
}
.vue-upload-img .div-add-img {
    background-color: #fbfdff;
    border-style: dashed;
    cursor: pointer;
}
.vue-upload-img .div-add-img .iconfont {
    font-size: 28px;
    color: #8c939d;
    font-weight: normal;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
.vue-upload-img .div-upload-img img {
    width: 100%;
    height: 100%;
}
.vue-upload-img .div-upload-img .iconfont {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    color: #fff;
    z-index: 1;
    cursor: pointer;
    font-size: 20px;
}
.vue-upload-img .div-upload-img .icon-icon-test {
    left: 40%;
}
.vue-upload-img .div-upload-img .icon-shanchu1 {
    left: 60%;
}
.vue-upload-img .upload-bg-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
    display: none;
}
.vue-upload-img .div-upload-img:hover {
    opacity: .8;
}
.vue-upload-img .div-upload-img:hover .upload-bg-img {
    display: block;
}
.vue-upload-img .div-upload-img-list {
    margin-top: 10px;
    border: 1px solid #c0ccda;
    padding: 8px;
    box-sizing: border-box;
    width: 212px;
    border-radius: 5px;
}
.vue-upload-img .div-upload-img-list .icon-shanchu {
    margin-left: 10px;
    cursor: pointer;
    color: #8c939d;
}
.vue-upload-img .list-img-container {
    width: 50px;
    overflow: hidden;
    border-radius: 3px;
    border: 1px solid #c0ccda;
}
.vue-upload-img .list-img-container img {
    width: 100%;
    height: 100%;
}
.vue-upload-img .list-img-container,
.vue-upload-img .list-span {
    display: inline-block;
    line-height: 50px;
    height: 50px;
    font-size: 14px;
    vertical-align: top;
}
.vue-upload-img .list-span {
    width: 100px;
    text-align: center;
}
</style>