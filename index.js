const path = require("path")
const fs = require("fs")

const htmlCreator = require('html-creator')
const glob = require("glob")

const vuedoc = require("@vuedoc/parser")
const jsdocParse = require('jsdoc-parse')
const jsdocApi = require('jsdoc-api')

const pug = require('pug')
const { NameEntry } = require('@vuedoc/parser/lib/entity/NameEntry')


// come gli passo un path che mi darà l'utente tramite settings della libreria?
// --- variabili settabili dall'utente ---
const directoryPath = './src/components'
const excludedDirectories = './src/components/SVGs'
// --------------------------------------

let vueParsedFiles = []
let mixinParsedFiles = []
let scriptsParsedFiles = []

let allParsedJs = []

const vueFiles = glob.sync(`${directoryPath}/**/*.vue`, {
  ignore: `${excludedDirectories}/*`
}
)
const scriptFiles = glob.sync(`${directoryPath}/**/*.js`, {
  ignore: `${excludedDirectories}/*`
}
)
const sidebarListFile = {
  components: [],
  mixin: [],
  scripts: [],
}

// Parse all .vue files
vueFiles.forEach((file) => {

  vueParsedFiles.push(
    vuedoc
      .parse({ filename: file })
      .then((fileParsed) => {
        sidebarListFile.components.push({ name: fileParsed.name, path: `components/${fileParsed.name}.html` })
        return fileParsed
      })
      .catch(err => console.log('parse err', err)))
})

// Parse all .js file and separate mixin from pure scripts
scriptFiles.forEach((file) => {
  const getJsdocData = jsdocApi.explainSync({ files: file })

  if (getJsdocData[0].kind === 'mixin') {

    return mixinParsedFiles.push(
      vuedoc
        .parse({ filename: file })
        .then(fileParsed => {
          sidebarListFile.mixin.push({ name: fileParsed.name, path: `mixin/${fileParsed.name}.html` })
          return fileParsed
        })
        .catch(err => console.log('parse err', err))
    )
  }
  const basename = path.basename(file)
  const baseNoExt = basename.replace(path.extname(file), '')
  sidebarListFile.scripts.push({ name: baseNoExt, path: `scripts/${baseNoExt}.html` })

  scriptsParsedFiles.push(jsdocParse(getJsdocData))

})


// Create folders
const folderComponents = path.join(__dirname, 'vueJsdoc/components')
fs.mkdir(folderComponents, { recursive: true }, (err) => {
  if (err) throw err
})
const folderMixin = path.join(__dirname, 'vueJsdoc/mixin')
fs.mkdir(folderMixin, { recursive: true }, (err) => {
  if (err) throw err
})
const folderScripts = path.join(__dirname, 'vueJsdoc/scripts')
fs.mkdir(folderScripts, { recursive: true }, (err) => {
  if (err) throw err
})


//generate css file
const style = require('./templates/style.js')

fs.writeFile('vueJsdoc/style.css', style.css, function (err) {
  if (err) throw err
})



// Componets
Promise.all(vueParsedFiles).then((parsedComponents) => {

  parsedComponents.forEach((component) => {

    const pugCompiledFunction = pug.compileFile(path.join(__dirname, './templates/component.pug'))
    const pugHtml = pugCompiledFunction({ component, sidebarListFile })

    const folder = path.join(__dirname, 'vueJsdoc/components')

    fs.writeFile(`${folder}/${component.name}.html`, pugHtml, function (err) {
      if (err) throw err
    })
  })
})
// Mixin
Promise.all(mixinParsedFiles).then((parsedComponents) => {

  parsedComponents.forEach((component) => {

    const pugCompiledFunction = pug.compileFile(path.join(__dirname, './templates/component.pug'))
    const pugHtml = pugCompiledFunction({ component, sidebarListFile })

    const folder = path.join(__dirname, 'vueJsdoc/mixin')

    fs.writeFile(`${folder}/${component.name}.html`, pugHtml, function (err) {
      if (err) throw err
    })
  })
})

// Scripts
Promise.all(scriptsParsedFiles).then((parsedScripts) => {

  fs.writeFile(`schema.json`, JSON.stringify(parsedScripts, null, 1), function (err) {
    if (err) throw err
  })


  parsedScripts.forEach((script) => {
    const basename = script[0].meta.filename
    const baseNoExt = basename.replace(path.extname(basename), '')

    const pugCompiledFunction = pug.compileFile(path.join(__dirname, './templates/scripts.pug'))
    const pugHtml = pugCompiledFunction({ script, sidebarListFile, baseNoExt })


    const folder = path.join(__dirname, 'vueJsdoc/scripts')

    fs.writeFile(`${folder}/${baseNoExt}.html`, pugHtml, function (err) {
      if (err) throw err
    })
  })
})

