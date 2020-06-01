const path = require("path")
const fs = require("fs")

const htmlCreator = require('html-creator')
const glob = require("glob")

const vuedoc = require("@vuedoc/parser")
const jsdocParse = require('jsdoc-parse')
const jsdocApi = require('jsdoc-api')

const pug = require('pug')


// come gli passo un path che mi darà l'utente tramite settings della libreria?
// --- variabili settabili dall'utente ---
const directoryPath = './src/components'
const excludedDirectories = './src/components/SVGs'
// --------------------------------------

let vueParsedFiles = []
let mixinParsedFiles = []
let scriptsParsedFiles = []

let allParsedJs = []
const template = require('./templates.js')

const vueFiles = glob.sync(`${directoryPath}/**/*.vue`, {
  ignore: `${excludedDirectories}/*`
}
)
const scriptFiles = glob.sync(`${directoryPath}/**/*.js`, {
  ignore: `${excludedDirectories}/*`
}
)
const basenameFiles = {
  components: {
    path: [],
    name: [],
  },
  mixin: {
    path: [],
    name: [],
  },
  scripts: {
    path: [],
    name: [],
  },
}
// Parse all .vue files
vueFiles.forEach((file) => {

  const basename = path.basename(file)
  const baseNoExt = basename.replace(path.extname(file), '')
  basenameFiles.components.path.push(`components/${basename}`)
  basenameFiles.components.name.push(baseNoExt)

  vueParsedFiles.push(
    vuedoc
      .parse({ filename: file })
      .then((fileParsed) => fileParsed)
      .catch(err => console.log('parse err', err)))
})

// Parse all .js file and separate mixin from pure scripts
scriptFiles.forEach((file) => {
  const getJsdocData = jsdocApi.explainSync({ files: file })

  const basename = path.basename(file)
  const baseNoExt = basename.replace(path.extname(file), '')

  if (getJsdocData[0].kind === 'mixin') {

    basenameFiles.mixin.path.push(`mixin/${basename}`)
    basenameFiles.mixin.name.push(baseNoExt)

    return mixinParsedFiles.push(
      vuedoc
        .parse({ filename: file })
        .then(fileParsed => fileParsed)
        .catch(err => console.log('parse err', err))
    )
  }

  basenameFiles.scripts.path.push(`scripts/${basename}`)
  basenameFiles.scripts.name.push(baseNoExt)

  scriptsParsedFiles.push(jsdocParse(getJsdocData))

})
console.log('BASE', basenameFiles)

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







Promise.all(vueParsedFiles).then((val) => {
  fs.writeFile(`schema.json`, JSON.stringify(val, null, 1), function (err) {
    if (err) throw err
  })
})


// Promise.all(vueParsedFiles).then(parsedComponents => {
//   fs.writeFile(`schema.json`, JSON.stringify(parsedComponents, null, 1), function (err) {
//     if (err) throw err
//   })

//   // Create a folder
//   const folder = path.join(__dirname, 'vueJsdoc')
//   fs.mkdir(folder, { recursive: true }, (err) => {
//     if (err) throw err
//   })

//   // We need to prepare sidebar menu here because it contains all components' links for navigation
//   const prepareListTemplate = (currentComp) => {
//     return parsedComponents.map(item => {

//       const isActive = item.name === currentComp ? 'active' : ''
//       return {
//         type: 'li',
//         attributes: { class: "nav-item" },
//         content: [
//           {
//             type: 'a',
//             attributes: { href: `/components/${item.name}.html`, class: `nav-link ${isActive}` },
//             content: item.name
//           }
//         ]
//       }
//     })
//   }

//   // generate css file
//   fs.writeFile(`${folder}/style.css`, template.css, function (err) {
//     if (err) throw err
//   })

//   const pugCompiledFunction = pug.compileFile(path.join(__dirname, './templates/test.pug'))
//   const pugHtml = pugCompiledFunction({ name: 'CIAO' })

//   // fs.writeFile(`${folder}/testPug.html`, pugHtml, function (err) {
//   //   if (err) throw err
//   // })
//   // // Create template html for each component
//   // parsedComponents.forEach((component) => {
//   //   const html = new htmlCreator(template.componentTemplate(component, prepareListTemplate(component.name)))


//   //   fs.writeFile(`${folder}/${component.name}.html`, html.renderHTML(), function (err) {
//   //     if (err) throw err
//   //   })
//   //   // html.document.findElementById('sideBarList').content = prepareListTemplate(component.name)


//   // })

// })
