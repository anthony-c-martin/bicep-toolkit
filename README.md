# bicep-toolkit
[![npm version](https://badge.fury.io/js/bicep-toolkit.svg)](https://badge.fury.io/js/bicep-toolkit)

Multi-purpose toolkit for working with Bicep files, supporting the following functionality:
* [Markdown documentation generation](#markdown-generation)
* [Batch compilation](#compiling)

## Usage
This tool can either be run standalone using `npx`, or installed as a global tool.

Usage via `npx`:
```sh
npx bicep-toolkit --help
```

Installation as a global tool:
```sh
npm install -g bicep-toolkit
```

Usage as a global tool:
```sh
bicep-toolkit --help
```

## Markdown Generation
The following will generate a `.md` file in the same directory as the bicep file:
```sh
bicep-toolkit markdown --bicep-file <path_to_bicep>
```

## Building
The following will build one or more `.bicep` files:
```sh
bicep-toolkit build --bicep-file <path_to_bicep>
```

## Help
To view command line options, run:
```sh
bicep-toolkit --help
```

## Customizing
Currently there are no options to tweak the format of the markdown output. However I'm very happy to take feature requests or contributions for this!