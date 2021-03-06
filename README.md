# MoguParse for Vue


Parse JSDOC for documentation export.

It generates html files

It detects if files .js are mixins

## Caveat

- Always set `name`for a .vue file otherwise the .html for that component, will not displayed
- Give always an unique `name` for components
- @vuedoc/parser not expose code inside vue hooks (mounted, updated..)
- for better detect a mixin add `mixin` tag AFTER imports in your mixin file
``` 
// myMixin.js  
import isEmpty from 'lodash/isEmpty'
import somethingElse form 'Something'
...

/**
 * @mixin
 */

 export default {
   props: { ... }
   methods: { ...}
   computed: {...}
 }
 ```  
- Always export default in mixins. Do not export named mixin because @vuedoc/parser cannot parse it 

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

This package needs a configuration JSON file, that must includes `includeDirectories` key (Array) and an optional `excludedDirectories` key (String)

```
// moguparseConfig.json  or whatever name you want
{
  "includeDirectories": [ // Required
    "./src/components",
    "./src/mixin"
  ],
  "excludedDirectories": "./src/components/SVGs" // Optional
}
```

Then add a script in your package.json

```
"scripts" : {
  "moguparse": "moguparse -c moguparseConfig.json"
}
```

## Start parsing

In console lunch the script

```
yarn moguparse

or

npm run moguparse
```

## Start the example in lib
Download this project

Start install dependencies
```
yarn
```

Then start to parse folders in example
```
yarn start
``` 
Now you should found `VueJsdoc` folder inside root filled with all html files

## TODO

- give possibility to add an array of folders to exclude
- Include more checks(if user not provide config file, if folder in config file not exist..)
- Get rid of all sync code
- Set default folders if no config will provide
- Write tests