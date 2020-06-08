# vue-jsdoc-parse


Parse JSDOC for documentation export.

It generates html files

It detects if files .js are mixins

## Warnings

- Always set `name`for a .vue file otherwise the .html for that component, will not displayed
- Give always an unique `name` for components
- 

## Install

```
yarn add https://github.com/moguriangel/moguParse-vue-jsdoc.git
```
or 
```
npm install https://github.com/moguriangel/moguParse-vue-jsdoc.git
```
`yarn start`

## Configuration file

For now package needs a configuration JSON file in the root folder, that must has included directories (Array) and excluded directories (String)

```
// config.json  or whatever name you want
{
  "includeDirectories": [
    "./src/components",
    "./src/mixin"
  ],
  "excludedDirectories": "./src/components/SVGs"
}
```

Then add a script in your package.json

```
"scripts" : {
  "moguparser": "moguparser -c config.json"
}
```

## Start parsing

In console lunch the script

```
yarn moguparser

or

npm run moguparser
```
