var http = require("http");
const path = require("path");
const fs = require("fs");
const docgen = require("vue-docgen-api");
const htmlCreator = require('html-creator');
const glob = require("glob")

const directoryPath = path.join(__dirname, "./src/components");

let allData = [];


glob.sync(directoryPath + '/**/*.vue').forEach((file) => {
  allData.push(docgen.parse(file).then((res) => res));
});



Promise.all(allData).then((res) => {
  const folder = path.join(__dirname, 'test')
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

          const html = new htmlCreator([
            {
              type: 'head',
              content: [{ type: 'title', content: component.displayName }]
            },
            {
              type: 'body',
              attributes: { style: 'padding: 1rem' },
              content: [
                {
                  type: 'div',
                  content: [
                    {
                      type: 'span',
                      content: 'A Button Span Deluxe',
                      attributes: { className: 'button' },
                    },
                    {
                      type: 'a',
                      content: 'Click here',
                      attributes: { href: '/path-to-infinity', target: '_blank' },
                    },
                  ],
                },
              ],
            },
          ]);
          fs.writeFile(`${folder}/${component.displayName}.html`, html.renderHTML(), function (err) {
            if (err) throw err
          })
        })

      });
    });
});
