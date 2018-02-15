# &lt;catalyst-toggle-switch&gt;

[![License](https://img.shields.io/badge/license-BSD%203--Clause-blue.svg)](LICENSE)
[![Not published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-unpublished-red.svg)](https://gitlab.wgtn.cat-it.co.nz/CatalystElements/catalyst-toggle-switch)

[Live Demo ↗](https://catalyst.github.io/CatalystElements/#/elements/catalyst-toggle-switch/demos/basic)
|
[API documentation ↗](https://catalyst.github.io/CatalystElements/#/elements/catalyst-toggle-switch)

`<catalyst-toggle-switch>` is a web component toggle switch, part of the `Catalyst Elements Collection`. It is essentially a checkbox.

It extends [`<catalyst-toggle-button>`](https://gitlab.wgtn.cat-it.co.nz/CatalystElements/catalyst-toggle-button)

## Installation

Install with npm:

```sh
npm install --save @catalyst-elements/catalyst-toggle-switch
```

Install with yarn:

```sh
yarn add @catalyst-elements/catalyst-toggle-switch
```

## Usage

### As a Module (Recommend)

Import the module on each page that uses the component, then register the element.

```html
<script type="module">
  // Import the component.
  import { CatalystToggleSwitch } from './node_modules/@catalyst-elements/catalyst-toggle-switch/dist/catalyst-toggle-switch.module.js';

  // If not using web component polyfills or if polyfills are ready, register the element.
  if (window.WebComponents === undefined || window.WebComponents.ready) {
    CatalystToggleSwitch.register();
  }
  // Otherwise wait until the polyfills are ready, then register the element.
  else {
    window.addEventListener('WebComponentsReady', () => {
      CatalystToggleSwitch.register();
    });
  }
</script>
```

Then simply use it like any other tag:

```html
<catalyst-toggle-switch></catalyst-toggle-switch>
```

### As a script

Import the script for the component on each page that it is uses on.

Note: you will also have to import the dependancies the component uses first.

```html
<!-- Import dependencies -->
<script src="node_modules/@catalyst-elements/catalyst-toggle-button/dist/catalyst-toggle-button.js"></script>

<!-- Import the element -->
<script src="node_modules/@catalyst-elements/catalyst-toggle-switch/dist/catalyst-toggle-switch.js"></script>
```

The element can then be use it like any other tag:

```html
<catalyst-toggle-switch></catalyst-toggle-switch>
```

## Browser Compatibility

See details on the Catalyst Elements' wiki: [Browser Compatibility](https://github.com/catalyst/CatalystElements/wiki/Browser-Compatibility)

## Contributions

Contributions are most welcome.

Please read our [contribution guidelines](./CONTRIBUTING.md).

## Development

### Dependencies

Project dependencies are managed through [Yarn](https://yarnpkg.com/lang/en/docs/install).

Install dependencies with:

```sh
yarn
```

### Building

The build process will create the following versions of the component in the distribution folder (`./dist`):

* an es6 module version
* an es6 script version
* an es6 minified script version
* an es5 minified script version

[Gulp](https://gulpjs.com) is used to run the build process.

Build with:

```sh
yarn run build
```

### Coding Style

This project uses [ESLint](http://eslint.org) to lint JavaScript and [Sass Lint](https://github.com/sasstools/sass-lint) to lint Sass.

To test if your code is compliant, run:

```sh
yarn run lint
```

### Docs

Note: This repo does not have it's own GitHub pages. Docs are hosted on the [Catalyst Elements Bundle](https://github.com/catalyst/CatalystElements)'s [GitHub pages](https://catalyst.github.io/CatalystElements).

Docs are build with [Polymer](https://www.polymer-project.org), the [Polymer Build Tool](https://github.com/Polymer/polymer-build) and the [Polymer Analyzer](https://github.com/Polymer/polymer-analyzer).

To build the docs, first run the analyzer which will update `./analysis.json`. The docs are then built from this file.

```sh
yarn run analyze
yarn run build-docs
```

The docs will be located under `./docs/`.

In order to view the docs in a web browser, the files need to be served from a web server (they cannot be open using the `file:///` protocall).

### Testing

Testing is done using the [web-component-tester](https://github.com/Polymer/web-component-tester).

#### Running Tests On The Command Line

```sh
yarn run test
```

#### Running Tests In The Browser

First start up a local server:

```sh
python -m SimpleHTTPServer 8000
```

Then visit http://0.0.0.0:8000/test/ to see the tests in action.
