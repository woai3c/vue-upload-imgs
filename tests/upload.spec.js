/**
 * @jest-environment jsdom
 */

const { mount } = require('@vue/test-utils')
const { VueUploadImgs } = require('../dist/vue3/VueUploadImgs.cjs')

const factory = (params) => mount(VueUploadImgs, { ...params })

const fileData = 'data:image/test'

// 重写 File
window.File = function () {}

// 重写 FileReader
window.FileReader = function () {
    this.readAsDataURL = function () {
        this.onload
            && this.onload({
                target: {
                    result: fileData,
                },
            })
    }
}

describe('VueUploadImgs', () => {
    const file = new File()
    const event = { target: { files: [file] } }
    file.type = 'image/png'
    file.name = 'test.png'
    file.size = 1024

    it('before-read', () => {
        const beforeRead = jest.fn(() => false)
        const afterRead = jest.fn()
        const wrapper = factory({
            propsData: {
                modelValue: [],
                beforeRead,
                afterRead,
            },
        })

        wrapper.vm.fileChangeHandler(event)
        expect(beforeRead).toHaveBeenCalledTimes(1)
        expect(afterRead).toHaveBeenCalledTimes(0)
    })

    it('after-read', () => {
        const afterRead = jest.fn()
        const wrapper = factory({
            propsData: {
                modelValue: [],
                afterRead,
            },
        })

        wrapper.vm.fileChangeHandler(event)
        expect(afterRead).toHaveBeenCalledTimes(1)
    })

    it('before-remove', () => {
        const beforeRemove = jest.fn()
        const wrapper = factory({
            propsData: {
                modelValue: [{ url: fileData }],
                beforeRemove,
            },
        })

        wrapper.find('.icon-shanchu1').trigger('click')
        expect(beforeRemove).toHaveBeenCalledTimes(1)
    })

    it('disabled', () => {
        const beforeRemove = jest.fn()
        const wrapper = factory({
            propsData: {
                modelValue: [{ url: fileData }],
                disabled: true,
                beforeRemove,
            },
        })

        wrapper.find('.icon-shanchu1').trigger('click')
        expect(beforeRemove).toHaveBeenCalledTimes(0)
    })

    it('file content', (done) => {
        const wrapper = factory({
            propsData: {
                modelValue: [],
                afterRead: (files) => {
                    expect(files[0].url).toEqual(fileData)
                    done()
                },
            },
        })

        wrapper.vm.fileChangeHandler(event)
    })

    it('max-size', () => {
        const afterRead = jest.fn()
        const wrapper = factory({
            propsData: {
                modelValue: [],
                maxSize: 100,
                afterRead,
            },
        })

        wrapper.vm.fileChangeHandler(event)
        expect(afterRead).toHaveBeenCalledTimes(0)
    })

    it('type', () => {
        const wrapper = factory({
            propsData: {
                modelValue: [],
            },
        })

        const wrapper2 = factory({
            propsData: {
                modelValue: [],
                type: 1,
            },
        })

        const wrapper3 = factory({
            propsData: {
                modelValue: [],
                type: 2,
            },
        })
        
        expect(wrapper.text()).toBe('')
        expect(wrapper.find('.upload-main-list').exists()).toBe(false)
        expect(wrapper2.find('.upload-main-list').element.tagName).toBe('DIV')
        expect(wrapper3.text()).toBe('点击上传')
    })

    it('access', () => {
        const wrapper = factory({
            propsData: {
                modelValue: [],
            },
        })

        const access = 'image/png'
        const wrapper2 = factory({
            propsData: {
                access,
                modelValue: [],
            },
        })

        expect(wrapper.vm.access).toBe('image/*')
        expect(wrapper2.vm.access).toBe(access)
    })

    it('label', () => {
        const wrapper = factory({
            propsData: {
                modelValue: [],
            },
        })

        const label = '测试上传'
        const wrapper2 = factory({
            propsData: {
                label,
                modelValue: [],
            },
        })

        expect(wrapper.vm.label).toBe('点击上传')
        expect(wrapper2.vm.label).toBe(label)
    })

    it('limit', () => {
        const afterRead = jest.fn()
        const wrapper = factory({
            propsData: {
                modelValue: [],
                afterRead,
            },
        })

        const afterRead2 = jest.fn()
        const wrapper2 = factory({
            propsData: {
                modelValue: [],
                limit: 1,
                afterRead: afterRead2,
            },
        })

        const event2 = { target: { files: [file, file] } }
        wrapper.vm.fileChangeHandler(event2)
        wrapper2.vm.fileChangeHandler(event2)
        expect(afterRead).toHaveBeenCalledTimes(1)
        expect(afterRead2).toHaveBeenCalledTimes(0)
    })
})
