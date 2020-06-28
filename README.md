# MoguParse for Vue


Parse JSDOC for documentation export.

It generates html files

It detects if files .js are mixins

## Caveat

- Always set `name`for a .vue file otherwise the .html for that component, will not displayed
- Give always an unique `name` for components
- @vuedoc/parser not expose code inside vue hooks (mounted, updated..) 


## Install

```
yarn add https://github.com/moguriangel/moguParse-vue.git
```
or 
```
npm install https://github.com/moguriangel/moguParse-vue.git
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
## TODO

- give possibility to add an array of folders to exclude
- Include more checks(if user not provide config file, if folder in config file not exist..)
- Get rid of all sync code