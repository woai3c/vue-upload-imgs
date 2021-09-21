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

const pluginName = 'vueUploadImgs'

const plugins = [
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
    // uglify(),
]

const config = {
    plugins,
    input: resolveFile('src/index.js'),
}

module.exports = [
    {
        ...config,
        output: {
            file: resolveFile(`dist/${pluginName}.cjs.js`),
            format: 'cjs',
            name: pluginName,
        },
    },
    {
        ...config,
        output: {
            file: resolveFile(`dist/${pluginName}.esm.js`),
            format: 'esm',
            name: pluginName,
        },
    },
    {
        ...config,
        output: {
            file: resolveFile(`dist/${pluginName}.iife.js`),
            format: 'iife',
            name: pluginName,
            extend: true,
        },
    },
]