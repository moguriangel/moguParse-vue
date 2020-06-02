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
  sidebarListFile.scripts.push({ name: baseNoExt, path: `scripts/${basename}.html` })

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




Promise.all(vueParsedFiles).then((parsedComponents) => {

  fs.writeFile(`schema.json`, JSON.stringify(parsedComponents, null, 1), function (err) {
    if (err) throw err
  })


  parsedComponents.forEach((component) => {

    const pugCompiledFunction = pug.compileFile(path.join(__dirname, './templates/component.pug'))
    const pugHtml = pugCompiledFunction({ component, sidebarListFile })

    const folder = path.join(__dirname, 'vueJsdoc/components')

    fs.writeFile(`${folder}/${component.name}.html`, pugHtml, function (err) {
      if (err) throw err
    })
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
