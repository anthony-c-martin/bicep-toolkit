# bicep-markdown
Tool to generate markdown documentation for a Bicep file.

[![npm version](https://badge.fury.io/js/bicep-markdown.svg)](https://badge.fury.io/js/bicep-markdown)

## Example
See [here](test/files/sample.md) for an example of the documentation it generates.

## Usage
### Without installing
The following will generate a `.md` file in the same directory as the bicep file:
```sh
npx bicep-markdown --bicep-file <path_to_bicep>
```

### Install as a global tool
#### Installation
```sh
npm install -g bicep-markdown
```

#### Usage
The following will generate a `.md` file in the same directory as the bicep file:
```sh
bicep-markdown --bicep-file <path_to_bicep>
```

### Help
To view command line options, run:
```sh
bicep-markdown --help
```

## Customizing
Currently there are no options to tweak the format of the output. However I'm very happy to take feature requests or contributions for this!