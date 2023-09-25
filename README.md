# @grace-studio/graceful-figma

[![npm version](https://badge.fury.io/js/@grace-studio%2Fgraceful-figma.svg)](https://badge.fury.io/js/@grace-studio%2Fgraceful-figma)

## Installation

For global access of the tool install it with
`npm i -g @grace-studio/graceful-figma` or `yarn global add @grace-studio/graceful-figma`

It can also be installed locally in a project with `npm i -D @grace-studio/graceful-figma` or `yarn add -D @grace-studio/graceful-figma`

## Usage

With cli-parameters:

```bash
graceful-figma react-icons \
--key <project-key> \
--page <page-name> \
--section <section-name> \
--out <./output/dir>
```

Using config file `.gracefulrc.json`

```json
{
  "token": "optional place for your access token",
  "react-icons": {
    "key": "project-key",
    "page": "page-name",
    "section": "section-name",
    "out": "./output/dir"
  }
}
```

```bash
graceful-figma react-icons
```

## Optional .env

The access token can be placed in the `.env` file

```properties
#.env
FIGMA_ACCESS_TOKEN=your-secret-access-token
```
