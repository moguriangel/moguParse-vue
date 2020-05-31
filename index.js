const path = require("path")
const fs = require("fs")
const htmlCreator = require('html-creator')
const glob = require("glob")

const vuedoc = require("@vuedoc/parser");


// come gli passo un path che mi darà l'utente tramite settings della libreria?
const directoryPath = path.join(__dirname, "./src/components")

let allParsedComponents = []
const template = require('./templates.js')

glob.sync(directoryPath + '/**/*.{vue,js}')
  .forEach((file) => {
    const options = {
      filename: file
    }
    allParsedComponents.push(
      vuedoc
        .parse(options)
        .then((fileParsed) => fileParsed)
        .catch(err => console.log('parse err', err)))
  })

Promise.all(allParsedComponents).then(parsedComponents => {
  fs.writeFile(`schema.json`, JSON.stringify(parsedComponents, null, 1), function (err) {
    if (err) throw err
  })

  // Create a folder
  const folder = path.join(__dirname, 'vueJsdoc')
  fs.mkdir(folder, { recursive: true }, (err) => {
    if (err) throw err
  })

  // We need to prepare sidebar menu here because it contains all components' links for navigation
  const prepareListTemplate = (currentComp) => {
    return parsedComponents.map(item => {

      const isActive = item.name === currentComp ? 'active' : ''
      return {
        type: 'li',
        attributes: { class: "nav-item" },
        content: [
          {
            type: 'a',
            attributes: { href: `${item.name}.html`, class: `nav-link ${isActive}` },
            content: item.name
          }
        ]
      }
    })
  }
  // Create template html for each component
  parsedComponents.forEach((component) => {
    const html = new htmlCreator(template.componentTemplate(component, prepareListTemplate(component.name)))


    fs.writeFile(`${folder}/${component.name}.html`, html.renderHTML(), function (err) {
      if (err) throw err
    })
    // html.document.findElementById('sideBarList').content = prepareListTemplate(component.name)

    fs.writeFile(`${folder}/style.css`, template.css, function (err) {
      if (err) throw err
    })
  })

})








  // Promise.all(allData).then((res) => {

    // console.log('BUU', res)
    // Create a folder
    // fs.mkdir(folder, { recursive: true }, (err) => {
    //   if (err) throw err
    //   fs.writeFile(`schema.json`, JSON.stringify(res, null, 1), function (err) {
    //     if (err) throw err

    //     let rawdata = fs.readFileSync('schema.json')
    //     let components = JSON.parse(rawdata)


    //     // We need to prepare sidebar menu here because it contains all components' links for navigation
    //     const prepareListTemplate = (currentComp) => {
    //       return components.map(item => {
    //         const isActive = item.displayName === currentComp ? 'active' : ''
    //         return {
    //           type: 'li',
    //           attributes: { className: "nav-item" },
    //           content: {
    //             type: 'a',
    //             attributes: { href: `${item.displayName}.html`, className: `nav-link ${isActive}` }
    //           }
    //         }
    //       })
    //     }
    //     components.forEach((component) => {
    //       const html = new htmlCreator(template.componentTemplate(component))

    //       html.document.findElementById('sideBarList').content = prepareListTemplate(component.displayName)

    //       fs.writeFile(`${folder}/${component.displayName}.html`, html.renderHTML(), function (err) {
    //         if (err) throw err
    //       })

    //       fs.writeFile(`${folder}/style.css`, template.css, function (err) {
    //         if (err) throw err
    //       })
    //     })

    //   })
    // })
  // })

