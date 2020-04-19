# vue 图片上传组件
组件保存的是图片的 base64 码

## demo

## 文档
|字段|类型|描述|默认值|值类型|
|-|-|-|-|-|
|type|属性值|组件显示模式 0.图片预览 1.图片列表 2.带有上传按钮的图片预览|0|Number|
|disabled|属性值|禁用组件|false|Boolean|
|access|属性值|组件允许上传的图片类型|'image/png,image/jpeg'|String|
|files|属性值|组件图片数据|[]|Array|
|label|属性值|上传按钮|'点击上传'|String|
|limit|属性值|限制上传的图片数量，0 为不限制|1|Number|
|multiple|属性值|是否允许多选|false|Boolean|
|compress|属性值|是否开启压缩|false|Boolean|
|quality|属性值|压缩质量|0.8|Number|
|beforeUpload|函数|上传前回调函数|null|Function|
|change|事件|图片改变时触发|null|Function|
|remove|事件|图片移除时触发|null|Function|
|exceed|事件|图片超出限制个数时触发|null|Function|
|preview|事件|点击图片上的 + 号触发预览事件|null|Function|

## 使用
### 在单文件组件中引用
```
npm i vue-upload-imgs
```

```
import Vue from 'vue'
import VueUploadImgs from 'vue-upload-imgs'

Vue.use(VueUploadImgs)
```
```
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

```js
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
