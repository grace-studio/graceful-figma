# @grace-studio/graceful-figma

[![npm version](https://badge.fury.io/js/@grace-studio%2Fgraceful-figma.svg)](https://badge.fury.io/js/@grace-studio%2Fgraceful-figma)

# Graceful Figma

A tool to generate React icons from Figma designs.

## Installation

### Global Installation

For global access to the tool, install it with:

```bash
npm i -g @grace-studio/graceful-figma
# or
yarn global add @grace-studio/graceful-figma
```

### Local Installation

It can also be installed locally in a project with:

```bash
npm i -D @grace-studio/graceful-figma
# or
yarn add -D @grace-studio/graceful-figma
```

## Usage

The React icons generated by this tool depend on [@grace-studio/graceful-next](https://www.npmjs.com/package/@grace-studio/graceful-next) to work properly.

### Using CLI Parameters

Run the following command with the appropriate parameters:

```bash
graceful-figma react-icons \
  --key <project-key> \
  --page <page-name> \
  --section <section-name> or <section-name,other-section-name> \
  --out <./output/dir> \
  --force
```

### Using Configuration File

You can also use a configuration file `.gracefulrc.json`:

```json
{
  "token": "optional place for your access token",
  "react-icons": {
    "key": "project-key",
    "page": "page-name",
    "section": "section-name", // or ["section-name", "other-section-name"] or "section-name,other-section-name"
    "out": "./output/dir",
    "force": true // optional, will show confirm dialog otherwise. Useful in pipelines.
  }
}
```

Then run the command:

```bash
graceful-figma react-icons
```

## Optional .env File

The access token can be placed in a `.env` file:

```properties
#.env
FIGMA_ACCESS_TOKEN=your-secret-access-token
```

## Additional Instructions

### Generating Icons

1. **Prepare your Figma project**: Ensure your Figma project is organized with pages and sections that you want to export as React icons.
2. **Obtain your Figma project key**: This can be found in the URL of your Figma project.
3. **Run the command**: Use the CLI or configuration file method to generate the icons.

### Example

Assuming you have a Figma project with the key `abc123`, a page named `Icons`, and sections named `Primary` and `Secondary`, you can generate the icons as follows:

#### Using CLI Parameters

```bash
graceful-figma react-icons \
  --key abc123 \
  --page Icons \
  --section Primary,Secondary \
  --out ./icons \
  --force
```

#### Using Configuration File

Create a `.gracefulrc.json` file:

```json
{
  "token": "your-secret-access-token",
  "react-icons": {
    "key": "abc123",
    "page": "Icons",
    "section": "Primary,Secondary",
    "out": "./icons",
    "force": true
  }
}
```

Then run:

```bash
graceful-figma react-icons
```

### Troubleshooting

- **Missing Access Token**: Ensure your access token is correctly placed in the `.env` file or provided in the configuration file.
- **Invalid Project Key**: Double-check the project key from your Figma URL.
- **Output Directory Issues**: Ensure the specified output directory exists or can be created by the tool.
