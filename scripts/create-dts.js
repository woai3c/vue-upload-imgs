const fs = require('fs')
const path = require('path')

function resolveFile(filepath) {
    return path.resolve(__dirname, filepath)
}

const content = fs.readFileSync(resolveFile('../types/vue3.d.ts'))

fs.writeFileSync(resolveFile('../dist/vue3/VueUploadImgs.cjs.d.ts'), content)
fs.writeFileSync(resolveFile('../dist/vue3/VueUploadImgs.esm.d.ts'), content)