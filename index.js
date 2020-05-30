var http = require("http");
const path = require("path");
const fs = require("fs");
const docgen = require("vue-docgen-api");
const htmlCreator = require('html-creator');
const glob = require("glob")

const directoryPath = path.join(__dirname, "./src/components");

let allData = [];
const template = require('./templates.js');

glob.sync(directoryPath + '/**/*.vue').forEach((file) => {
  allData.push(docgen.parse(file).then((res) => res));
});



Promise.all(allData).then((res) => {
  const folder = path.join(__dirname, 'vueJsdoc')
  fs.mkdir(folder,
    { recursive: true }, (err) => {
      if (err) {
        return console.error(err);
      }
      fs.writeFile(`schema.json`, JSON.stringify(res, null, 1), function (err) {
        if (err) throw err

        let rawdata = fs.readFileSync('schema.json');
        let components = JSON.parse(rawdata)

        components.forEach((component) => {


          fs.writeFile(`${folder}/${component.displayName}.html`, template.component.renderHTML(), function (err) {
            if (err) throw err
          })
          fs.writeFile(`${folder}/style.css`, template.css, function (err) {
            if (err) throw err
          })
        })

      });
    });
});
