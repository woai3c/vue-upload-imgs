const path = require('path')
const json = require('@rollup/plugin-json')
const vue = require('rollup-plugin-vue')
const postcss = require('rollup-plugin-postcss')
const resolve = require('@rollup/plugin-node-resolve').default
const { uglify } = require('rollup-plugin-uglify')

const resolveFile = function (filePath) {
    return path.join(__dirname, filePath)
}

const pluginName = 'VueUploadImgs'

function getPlugin(isCompress = false) {
    const result = [
        resolve(),
        vue(),
        json({
            compact: true,
        }),
        postcss({
            extensions: ['.css'],
            minimize: true,
        }),
    ]

    if (isCompress) {
        result.push(uglify())
    }

    return result
}

function getBaseConfig(mode, isCompress = false) {
    const result = {
        input: resolveFile('src/index.js'),
        output: {
            file: resolveFile(`dist/vue3/${pluginName}.${mode}.js`),
            format: mode,
            name: pluginName,
        },
        plugins: getPlugin(isCompress),
        external: ['vue'],
    }

    if (mode === 'iife') {
        result.output.extend = true
        result.output.globals = {
            vue: 'Vue',
        }
    }

    if (isCompress) {
        result.output.file = resolveFile(`dist/vue3/${pluginName}.${mode}.min.js`)
    }

    return result
}

function getFinalConfig() {
    const arr = ['esm', 'cjs', 'iife']
    return [
        ...arr.map(mode => getBaseConfig(mode)),
        ...arr.map(mode => getBaseConfig(mode, true)),
    ]
}

module.exports = getFinalConfig()