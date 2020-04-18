<template>
    <div class="vue-upload-img">
        <template v-if="type == 2">
            <label :for="id" class="label-upload">{{ label }}</label>
            <slot></slot>
            <div class="upload-main2">
                <div class="div-upload-img2" v-for="(item, index) in fileList" v-show="item" :key="index">
                    <div>
                        <img :src="item.url">
                    </div>
                    <p>{{ item.name }}</p>
                </div>
            </div>
        </template>
        
        <template v-else>
            <label :for="id" class="label-upload" v-if="type == 1">{{ label }}</label>
            <slot></slot>
            <div class="upload-main">
                <div class="div-upload-img" v-for="(item, index) in fileList" v-show="item" :key="index">
                    <img :src="item.url">
                    <div class="upload-bg-img">
                        <span class="iconfont icon-icon-test" @click="preview(index)"></span>
                        <span class="iconfont icon-shanchu" @click="remove(index)"></span>
                    </div>
                </div>
                <label class="div-add-img" :for="id">
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
        fileList: {
            type: Array,
            default: () => [], // 图片
        },
        label: {
            type: String,
            default: '点击上传', // 按钮文字
        },
        limit: {
            type: Number,
            default: 0, // 限制图片数， 0 为不限制
        },
        multiple: {
            type: Boolean,
            default: false, // 是否多选
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

            const oldLen = this.fileList.length
            const result = [...this.fileList]
            if (!this.verify(oldLen + files.length)) return 

            for (let i = 0, len = files.length; i < len; i++) {
                const reader = new FileReader()
                const file = files[i]
                reader.readAsDataURL(file)
                reader.onload = (res) => {
                    result.push({ name: file.name, url: res.target.result, type: file.type, size: file.size })
                    if (len + oldLen == result.length) {
                        this.$emit('change', result)
                        e.target.value = ''
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
.vue-upload-img .div-upload-img .icon-shanchu {
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
</style>