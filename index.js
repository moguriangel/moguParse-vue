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
    const folderComponents = './vueJsdoc'
    await rimraf.sync(folderComponents)
  }
  async creatFolders() {
    await this.deleteFolder()


    await fs.promises.mkdir('./vueJsdoc/components', { recursive: true }, (err) => {
      if (err) throw new Err('failed create folder', err)
    })

    await fs.promises.mkdir('./vueJsdoc/mixin', { recursive: true }, (err) => {
      if (err) throw new Err('failed create folder', err)
    })

    await fs.promises.mkdir('./vueJsdoc/scripts', { recursive: true }, (err) => {
      if (err) throw new Err('failed create folder', err)
    })
  }

  /**
   * Retrive all directory from options 
   */
  async getPaths() {
    let vueDirs = []
    let jsDirs = []
    const patternExclude = `${this.options.excludedDirectories}/**/*`

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

    let vueParsed = []
    for (const file of files.vueDirs) {
      const parseOne = await vuedoc.parse({ filename: file })

      /**
       * Push vue components path into ours sidebar
       */
      _sidebarListFile.get(this).components.push({ name: parseOne.name, path: `components/${parseOne.name}.html` })

      /**
       * Push parsed Vue Files object
       */
      vueParsed.push(parseOne)
    }
    let mixinParsed = []
    let scriptParsed = []

    for (const file of files.jsDirs) {
      const getJsdocData = await jsdocApi.explain({ files: file })
      /**
       * We parse all .js files with jsdocApi
       * If property kind === mixin we can parse these file with vuedoc
       */
      if (getJsdocData[0].kind === 'mixin') {
        const parseOne = await vuedoc.parse({ filename: file })

        /**
         * Push mixins path into our sidebar
         */
        _sidebarListFile.get(this).mixin.push({ name: parseOne.name, path: `mixin/${parseOne.name}.html` })

        /**
         * Push parsed mixin object
         */
        mixinParsed.push(parseOne)
      } else {
        /**
         * Here we know that all .js are plain javascript files
         */
        const basename = path.basename(file)
        const baseNoExt = basename.replace(path.extname(file), '')

        const parsePlainJs = jsdocParse(getJsdocData)
        /** 
         * if parsed javascript has some jsdoc
         */
        if (parsePlainJs.length) {

          /** 
           * Push scripts path into ours sidebar
           */
          _sidebarListFile.get(this).scripts.push({ name: baseNoExt, path: `scripts/${baseNoExt}.html` })

          /**
           * Push parsed javascript object
           */
          scriptParsed.push(parsePlainJs)

        }
      }
    }

    return { mixinParsed, scriptParsed, vueParsed }
  }
  /**
   * Write html file based on pug templates
   */
  async writeHtmlFiles() {
    await this.creatFolders()

    // generate global css file
    const style = require('./templates/style.js')
    fs.promises.writeFile('./vueJsdoc/style.css', style.css, function (err) {
      if (err) throw err
    })

    this.getParsedFiles()
      .then(parsedComponents => {
        // generate index.html
        const pugCompiledFunction = pug.compileFile(path.join(__dirname, './templates/index.pug'))
        const pugHtml = pugCompiledFunction({ sidebarListFile: _sidebarListFile.get(this) })

        fs.promises.writeFile('./vueJsdoc/index.html', pugHtml, function (err) {
          if (err) throw err
        })

        // Generate html for all .vue files
        parsedComponents.vueParsed.forEach((component) => {
          const pugCompiledFunction = pug.compileFile(path.join(__dirname, './templates/component.pug'))
          const pugHtml = pugCompiledFunction({ component, sidebarListFile: _sidebarListFile.get(this) })

          const folder = './vueJsdoc/components'

          fs.promises.writeFile(`${folder}/${component.name}.html`, pugHtml, function (err) {
            if (err) throw new Err('failed write file', err)
          })
        })

        // Generate html for Mixin files
        parsedComponents.mixinParsed.forEach((component) => {

          const pugCompiledFunction = pug.compileFile(path.join(__dirname, './templates/component.pug'))
          const pugHtml = pugCompiledFunction({ component, sidebarListFile: _sidebarListFile.get(this) })

          const folder = './vueJsdoc/mixin'

          fs.writeFile(`${folder}/${component.name}.html`, pugHtml, function (err) {
            if (err) throw new Err('failed write file', err)
          })
        })

        // Generate html for all plain javascript files
        parsedComponents.scriptParsed.forEach((script) => {
          if (script.length) {
            const basename = script[0].meta.filename
            const baseNoExt = basename.replace(path.extname(basename), '')

            const pugCompiledFunction = pug.compileFile(path.join(__dirname, './templates/scripts.pug'))
            const pugHtml = pugCompiledFunction({ script, sidebarListFile: _sidebarListFile.get(this), baseNoExt })


            const folder = './vueJsdoc/scripts'

            fs.writeFile(`${folder}/${baseNoExt}.html`, pugHtml, function (err) {
              if (err) throw new Err('failed write file', err)
            })
          }
        })
      })
  }
}
module.exports = {
  ParseJsdoc: ParseJsdoc
}