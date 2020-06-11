const fs = require("fs")
const path = require("path")
const appRoot = require('app-root-path');

const glob = require("glob")
const rimraf = require("rimraf");

// parsers
const vuedoc = require("@vuedoc/parser")
const jsdocParse = require('jsdoc-parse')
const jsdocApi = require('jsdoc-api')

const pug = require('pug')

const _sidebarListFile = new WeakMap

class ParseJsdoc {
  constructor(options) {
    this.options = options
    this.scriptsFiles = {}
    _sidebarListFile.set(this, {
      components: [],
      mixin: [],
      scripts: [],
    })
  }
  async deleteFolder() {
    const folderComponents = path.join(__dirname, '../../vueJsdoc')
    await rimraf.sync(folderComponents)
  }
  async creatFolders() {
    await this.deleteFolder()

    const folderComponents = path.join(__dirname, '../../vueJsdoc/components')

    await fs.promises.mkdir(folderComponents, { recursive: true }).catch(console.log)

    const folderMixin = path.join(__dirname, '../../vueJsdoc/mixin')
    await fs.promises.mkdir(folderMixin, { recursive: true }, (err) => {
      if (err) throw new Err('failed create folder', err)
    })

    const folderScripts = path.join(__dirname, '../../vueJsdoc/scripts')
    await fs.promises.mkdir(folderScripts, { recursive: true }, (err) => {
      if (err) throw new Err('failed create folder', err)
    })
  }

  /**
   * Retrive all directory from options 
   */
  async getPaths() {
    let vueDirs = []
    let jsDirs = []
    const patternExclude = `${this.options.excludedDirectories}/*`

    this.options.includeDirectories.map(dir => {
      const patternInclude = `${dir}/**/*.vue`

      const matches = glob.sync(patternInclude, {
        ignore: patternExclude
      })
      vueDirs.push(...matches)
    })

    this.options.includeDirectories.map(dir => {
      const patternInclude = `${dir}/**/*.js`

      const matches = glob.sync(patternInclude, {
        ignore: patternExclude
      })
      jsDirs.push(...matches)
    })

    return { vueDirs, jsDirs }
  }

  /**
   * Parse files and split vue mixin from plain js
   */
  async getParsedFiles() {
    const files = await this.getPaths()
    console.log(files)

    let vueParsed = []
    for (const file of files.vueDirs) {
      const parseOne = await vuedoc.parse({ filename: file })
      _sidebarListFile.get(this).components.push({ name: parseOne.name, path: `components/${parseOne.name}.html` })
      vueParsed.push(parseOne)
    }
    let mixinParsed = []
    let scriptParsed = []

    for (const file of files.jsDirs) {

      const getJsdocData = await jsdocApi.explain({ files: file })
      if (getJsdocData[0].kind === 'mixin') {

        const parseOne = await vuedoc.parse({ filename: file })
        _sidebarListFile.get(this).mixin.push({ name: parseOne.name, path: `mixin/${parseOne.name}.html` })
        mixinParsed.push(parseOne)
      } else {
        const basename = path.basename(file)
        const baseNoExt = basename.replace(path.extname(file), '')
        _sidebarListFile.get(this).scripts.push({ name: baseNoExt, path: `scripts/${baseNoExt}.html` })
        scriptParsed.push(jsdocParse(getJsdocData))
      }
    }

    return { mixinParsed, scriptParsed, vueParsed }
  }
  /**
   * Write html file based on pug templates
   */
  writeHtmlFiles() {
    this.creatFolders()
      .then(() => {
        console.log('appRoot', appRoot.resolve('/node_modules'))
        console.log('dirname', __dirname)

        //generate css file
        const style = require('./templates/style.js')
        fs.promises.writeFile('../../vueJsdoc/style.css', style.css, function (err) {
          if (err) throw err
        })
        this.getParsedFiles()
          .then(parsedComponents => {
            // Components
            parsedComponents.vueParsed.forEach((component) => {
              const pugCompiledFunction = pug.compileFile(path.join(__dirname, './templates/component.pug'))
              const pugHtml = pugCompiledFunction({ component, sidebarListFile: _sidebarListFile.get(this) })

              const folder = path.join(__dirname, '../../vueJsdoc/components')

              fs.promises.writeFile(`${folder}/${component.name}.html`, pugHtml, function (err) {
                if (err) throw new Err('failed write file', err)
              })
            })
            // Mixin
            parsedComponents.mixinParsed.forEach((component) => {

              const pugCompiledFunction = pug.compileFile(path.join(__dirname, './templates/component.pug'))
              const pugHtml = pugCompiledFunction({ component, sidebarListFile: _sidebarListFile.get(this) })

              const folder = path.join(__dirname, '../../vueJsdoc/mixin')

              fs.writeFile(`${folder}/${component.name}.html`, pugHtml, function (err) {
                if (err) throw new Err('failed write file', err)
              })
            })
            // Scripts
            parsedComponents.scriptParsed.forEach((script) => {
              const basename = script[0].meta.filename
              const baseNoExt = basename.replace(path.extname(basename), '')

              const pugCompiledFunction = pug.compileFile(path.join(__dirname, './templates/scripts.pug'))
              const pugHtml = pugCompiledFunction({ script, sidebarListFile: _sidebarListFile.get(this), baseNoExt })


              const folder = path.join(__dirname, '../../vueJsdoc/scripts')

              fs.writeFile(`${folder}/${baseNoExt}.html`, pugHtml, function (err) {
                if (err) throw new Err('failed write file', err)
              })
            })

          })
        console.log('Done')
      })

  }


}
module.exports = {
  ParseJsdoc: ParseJsdoc
}