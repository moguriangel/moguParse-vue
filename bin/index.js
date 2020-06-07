#!/usr/bin/env node
const fs = require("fs").promises

const { program } = require('commander');
program.version('0.0.1');
const parseJsdoc = require('../index.js')
const ParseJsdoc = parseJsdoc.ParseJsdoc

program.option('-c, --config <type>', 'configurations file');

program.parse(process.argv);

const configFile = fs.readFile(program.config, 'utf8', (err) => {
  if (err) throw err
})


// configFile
//   .then(res => {
//     return greet.getPaths(JSON.parse(res))
//   })
//   .then(res1 => console.log('BIN', res1))

configFile
  .then(res => {
    const moguparser = new ParseJsdoc(JSON.parse(res))
    moguparser.writeHtmlFiles()
  })