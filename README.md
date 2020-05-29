# vue 图片上传组件
组件保存的是图片的 base64 码，如果有 BUG，请提 [issues](https://github.com/woai3c/vue-upload-imgs/issues)

## 在线 demo
* [预览模式](http://jsrun.net/HMfKp/edit)
* [列表模式](http://jsrun.net/5MfKp/edit)
* [禁用](http://jsrun.net/DMfKp/edit)

## 文档
|字段|类型|描述|默认值|值类型|
|-|-|-|-|-|
|type|属性值|组件显示模式 0.图片预览 1.图片列表 2.带有上传按钮的图片预览|0|Number|
|disabled|属性值|禁用组件|false|Boolean|
|access|属性值|组件允许上传的图片类型|image/*|String|
|files|属性值|组件图片数据|[]|Array|
|label|属性值|上传按钮|'点击上传'|String|
|limit|属性值|限制上传的图片数量，0 为不限制|1|Number|
|max-size|属性值|允许上传图片的最大尺寸，单位字节|null|Number|
|multiple|属性值|是否允许多选|false|Boolean|
|compress|属性值|是否开启压缩|false|Boolean|
|quality|属性值|压缩质量|0.8|Number|
|before-read|属性值|读取文件前的钩子函数|null|Function，返回值为 true 则继续读取图片，为 false 则不进行任何操作|
|after-read|属性值|读取文件后的钩子函数|null|Function，参数为读取后的图片|
|before-remove|属性值|移除文件前的钩子函数|null|Function，返回值为 true 则删除图片，为 false 则不进行任何操作|
|oversize|事件|图片大小超过 max-size 时触发|null|Function，参数为超过尺寸大小的图片|
|exceed|事件|图片超出限制个数时触发|null|Function|
|preview|事件|点击图片上的 + 号触发预览事件|null|Function，参数为要预览的图片索引值 index 和图片 file|

## 使用
### 在单文件组件中引用
```
npm i vue-upload-imgs
```

```js
import Vue from 'vue'
import VueUploadImgs from 'vue-upload-imgs'

Vue.use(VueUploadImgs)
```
```html
<template>
    <div>
        <VueUploadImgs 
            multiple
            compress
            :files="files"
            :before-upload="beforeUpload"
            :limit="limit"
            :type="type"
            @change="change"
            @remove="remove"
            @preview="preview"
            @exceed="exceed"
        >
        </VueUploadImgs>
    </div>
</template>
```

### 在HTML文件中直接引用

```html
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="../dist/vue-upload-imgs.js"></script>
```

```html
<div id="app">
    <vue-upload-imgs 
        multiple
        compress
        :files="files"
        :before-upload="beforeUpload"
        :limit="limit"
        :type="type"
        @change="change"
        @remove="remove"
        @preview="preview"
        @exceed="exceed"
    >
    </vue-upload-imgs>
</div>
```
