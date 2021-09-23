const path = require('path')
const json = require('@rollup/plugin-json')
const { babel } = require('@rollup/plugin-babel')
const commonjs = require('@rollup/plugin-commonjs')
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
        commonjs(),
        vue(),
        json({
            compact: true,
        }),
        babel({
            extensions: ['.js', '.vue'],
            babelHelpers: 'runtime',
            plugins: ['@babel/plugin-transform-runtime'],
            presets: [
                [
                    '@vue/cli-plugin-babel/preset',
                    {
                        useBuiltIns: false,
                        targets: {
                            browsers: [
                                '> 1%',
                                'last 2 versions',
                                'not ie <= 8',
                            ],
                        },
                    },
                ],
            ],
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
            file: resolveFile(`dist/${pluginName}.${mode}.js`),
            format: mode,
            name: pluginName,
        },
        plugins: getPlugin(isCompress),
    }

    if (mode === 'iife') {
        result.output.extend = true
    }

    if (isCompress) {
        result.output.file = resolveFile(`dist/${pluginName}.${mode}.min.js`)
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