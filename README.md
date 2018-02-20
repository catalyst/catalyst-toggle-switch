# &lt;catalyst-toggle-switch&gt;

[![Travis](https://img.shields.io/travis/catalyst/catalyst-toggle-switch.svg?style=flat-square)](https://travis-ci.org/catalyst/catalyst-toggle-switch)
[![David](https://img.shields.io/david/catalyst/catalyst-toggle-switch.svg?style=flat-square)](https://david-dm.org/catalyst/catalyst-toggle-switch)
[![David](https://img.shields.io/david/dev/catalyst/catalyst-toggle-switch.svg?style=flat-square)](https://david-dm.org/catalyst/catalyst-toggle-switch?type=dev)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg?style=flat-square)](https://www.webcomponents.org/element/catalyst/catalyst-toggle-switch)
[![Polymer 2 not supported](https://img.shields.io/badge/Polymer_2-not_supported-red.svg?style=flat-square)]()
[![Polymer 3 support pending](https://img.shields.io/badge/Polymer_3-support_pending-yellow.svg?style=flat-square)]()

[Live Demo ↗](https://catalyst.github.io/CatalystElements/#/elements/catalyst-toggle-switch/demos/basic)
|
[API documentation ↗](https://catalyst.github.io/CatalystElements/#/elements/catalyst-toggle-switch)

`<catalyst-toggle-switch>` is a web component toggle switch, part of the `Catalyst Elements Collection`. It is essentially a checkbox.

It extends [`<catalyst-toggle-button>`](https://gitlab.wgtn.cat-it.co.nz/CatalystElements/catalyst-toggle-button)

<!---
```
<custom-element-demo>
  <template>
    <script type="module" src="dist/catalyst-toggle-switch.module.js"></script>
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<catalyst-toggle-switch></catalyst-toggle-switch>
```

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

Import the module on each page that uses the component.

```html
<script type="module" src="node_modules/@catalyst-elements/catalyst-toggle-switch/dist/catalyst-toggle-switch.module.js"></script>
```

Then simply use it like any other tag.

### As a script

Import the script for the component on each page that it is uses on.

Note: you will also have to import the dependancies the component uses first.

```html
<!-- Import dependencies -->
<script src="node_modules/@catalyst-elements/catalyst-toggle-button/dist/catalyst-toggle-button.js"></script>

<!-- Import the element -->
<script src="node_modules/@catalyst-elements/catalyst-toggle-switch/dist/catalyst-toggle-switch.js"></script>
```

The element can then be use it like any other tag.

## Browser Compatibility

See details on the Catalyst Elements' wiki: [Browser Compatibility](https://github.com/catalyst/CatalystElements/wiki/Browser-Compatibility)

## Contributions

Contributions are most welcome.

Please read our [contribution guidelines](./CONTRIBUTING.md).
