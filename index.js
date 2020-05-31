var http = require("http")
const path = require("path")
const fs = require("fs")
const docgen = require("vue-docgen-api")
const htmlCreator = require('html-creator')
const glob = require("glob")

// come gli passo un path che mi darà l'utente tramite settings della libreria?
const directoryPath = path.join(__dirname, "./src/components")

let allData = []
const template = require('./templates.js')

// docgen non riesce a parsare i file js che non siano mixin
glob.sync(directoryPath + '/**/*.{vue,js}')
  .forEach((file) => {
    allData.push(docgen
      .parse(file)
      .then((fileParsed) => fileParsed)
      .catch(err => console.log('parse err', err)))
  })

Promise.all(allData).then((res) => {
  const folder = path.join(__dirname, 'vueJsdoc')

  // Create a folder
  fs.mkdir(folder, { recursive: true }, (err) => {
    if (err) throw err
    fs.writeFile(`schema.json`, JSON.stringify(res, null, 1), function (err) {
      if (err) throw err

      let rawdata = fs.readFileSync('schema.json')
      let components = JSON.parse(rawdata)


      // We need to prepare sidebar menu here because it contains all components' links for navigation
      const prepareListTemplate = (currentComp) => {
        return components.map(item => {
          const isActive = item.displayName === currentComp ? 'active' : ''
          return {
            type: 'li',
            attributes: { className: "nav-item" },
            content: {
              type: 'a',
              attributes: { href: `${item.displayName}.html`, className: `nav-link ${isActive}` }
            }
          }
        })
      }
      components.forEach((component) => {
        const html = new htmlCreator(template.componentTemplate(component))

        html.document.findElementById('sideBarList').content = prepareListTemplate(component.displayName)

        fs.writeFile(`${folder}/${component.displayName}.html`, html.renderHTML(), function (err) {
          if (err) throw err
        })

        fs.writeFile(`${folder}/style.css`, template.css, function (err) {
          if (err) throw err
        })
      })

    })
  })
})
