#!/usr/bin/env node
const fs = require("fs").promises

const { program } = require('commander');
program.version('0.0.1');
const parseJsdoc = require('../index.js')
const ParseJsdoc = parseJsdoc.ParseJsdoc

program
  .option('-c, --config <type>', 'configurations file')
  .action(() => console.log('Start parsing files..'))

program.parse(process.argv);

const configFile = fs.readFile(program.config, 'utf8', (err) => {
  if (err) throw new Err('Failed read config file'.err)
})

configFile
  .then(res => {
    const moguparser = new ParseJsdoc(JSON.parse(res))
    moguparser.writeHtmlFiles()
  })