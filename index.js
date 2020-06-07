const fs = require("fs")
const path = require("path")

const Glob = require("glob").Glob

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
  async creatFolders() {
    const folderComponents = path.join(__dirname, 'vueJsdoc/components')
    await fs.promises.mkdir(folderComponents, { recursive: true }, (err) => {
      if (err) throw err
    })
    const folderMixin = path.join(__dirname, 'vueJsdoc/mixin')
    await fs.promises.mkdir(folderMixin, { recursive: true }, (err) => {
      if (err) throw err
    })
    const folderScripts = path.join(__dirname, 'vueJsdoc/scripts')
    await fs.promises.mkdir(folderScripts, { recursive: true }, (err) => {
      if (err) throw err
    })

    const style = require('./templates/style.js')
    //generate css file
    await fs.promises.writeFile('vueJsdoc/style.css', style.css, function (err) {
      if (err) throw err
    })

  }

  /**
   * Retrive all directory from options 
   */
  async getPaths() {
    const patternVueInclude = `${this.options.includeDirectories}/**/*.vue`
    const patternJsInclude = `${this.options.includeDirectories}/**/*.js`
    const patternExclude = `${this.options.excludedDirectories}/*`

    const vueFiles = await new Promise((resolve, reject) => {
      new Glob(patternVueInclude, { ignore: patternExclude }, function (err, matches) {
        if (err) {
          reject(new Error('failed to get .vue files', err))
        }
        resolve(matches)

      })
    })
    const scriptFiles = await new Promise((resolve, reject) => {
      new Glob(patternJsInclude, { ignore: patternExclude }, function (err, matches) {
        if (err) {
          reject(new Error('failed to get .js files', err))
        }
        resolve(matches)

      })
    })
    return { vueFiles, scriptFiles }
  }
  /**
   * Parse only vue files with vueParse
   */
  async getVueParsedFiles() {
    // Parse all .vue files


  }
  /**
   * Parse files and split vue mixin from plain js
   */
  async getParsedFiles() {
    const files = await this.getPaths()

    let vueParsed = []
    for (const file of files.vueFiles) {
      const parseOne = await vuedoc.parse({ filename: file })
      _sidebarListFile.get(this).components.push({ name: parseOne.name, path: `components/${parseOne.name}.html` })
      vueParsed.push(parseOne)
    }
    let mixinParsed = []
    let scriptParsed = []

    for (const file of files.scriptFiles) {

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
    this.creatFolders().then(() => {
      this.getParsedFiles()
        .then(parsedComponents => {

          // Components
          parsedComponents.vueParsed.forEach((component) => {
            const pugCompiledFunction = pug.compileFile(path.join(__dirname, './templates/component.pug'))
            const pugHtml = pugCompiledFunction({ component, sidebarListFile: _sidebarListFile.get(this) })

            const folder = path.join(__dirname, 'vueJsdoc/components')

            fs.promises.writeFile(`${folder}/${component.name}.html`, pugHtml, function (err) {
              if (err) throw err
            })
          })
          // Mixin
          parsedComponents.mixinParsed.forEach((component) => {

            const pugCompiledFunction = pug.compileFile(path.join(__dirname, './templates/component.pug'))
            const pugHtml = pugCompiledFunction({ component, sidebarListFile: _sidebarListFile.get(this) })

            const folder = path.join(__dirname, 'vueJsdoc/mixin')

            fs.writeFile(`${folder}/${component.name}.html`, pugHtml, function (err) {
              if (err) throw err
            })
          })
          // Scripts
          parsedComponents.scriptParsed.forEach((script) => {
            const basename = script[0].meta.filename
            const baseNoExt = basename.replace(path.extname(basename), '')

            const pugCompiledFunction = pug.compileFile(path.join(__dirname, './templates/scripts.pug'))
            const pugHtml = pugCompiledFunction({ script, sidebarListFile: _sidebarListFile.get(this), baseNoExt })


            const folder = path.join(__dirname, 'vueJsdoc/scripts')

            fs.writeFile(`${folder}/${baseNoExt}.html`, pugHtml, function (err) {
              if (err) throw err
            })
          })

        })
    })

  }


}
module.exports = {
  ParseJsdoc: ParseJsdoc
}