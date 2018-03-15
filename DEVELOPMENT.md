# Development

## Getting the code

1.  Fork the repo.
2.  Clone your fork.
3.  Install [Node](https://nodejs.org/en/download/). It comes bundled with [yarn](https://yarnpkg.com/).
4.  Install the [dependencies](#dependencies)

## Dependencies

Project dependencies are managed through [Yarn](https://yarnpkg.com/lang/en/docs/install).

Install dependencies with:

```sh
yarn
```

## Viewing the element

First analyze the projcet then start up the included local webserver:

```sh
yarn run analyze
yarn run serve
```

Then visit http://127.0.0.1:8081/components/@catalyst-elements/catalyst-toggle-switch to load up un unbuilt version of the docs.
Select the element and choose a demo to see the element in action.

Please note that as this is an unbuild version of the docs, not all browser will be able to view the page. To view the built version of the docs see [Docs](#docs)

## Building

The build process will create the following versions of the component in the distribution folder (`./dist`):

* an es6 module version
* an es5 minified script version

[Gulp](https://gulpjs.com) is used to run the build process.

Build with:

```sh
yarn run build
```

## Coding Style

This project uses [ESLint](http://eslint.org) to lint JavaScript and [Sass Lint](https://github.com/sasstools/sass-lint) to lint Sass.

To test if your code is compliant, run:

```sh
yarn run lint
```

## Docs

Note: This repo does not have it's own GitHub pages. Docs are hosted on the [Catalyst Elements Bundle](https://github.com/catalyst/CatalystElements)'s [GitHub pages](https://catalyst.github.io/CatalystElements).

Docs are build with [Polymer](https://www.polymer-project.org), the [Polymer Build Tool](https://github.com/Polymer/polymer-build) and the [Polymer Analyzer](https://github.com/Polymer/polymer-analyzer).

To build the docs, first run the analyzer which will update `./analysis.json`. This file contains all the infomation about the element the docs will use.

```sh
yarn run analyze
yarn run build-docs
```

The docs will be located under `./docs/`.

To view the docs, first start up a local webserver:

```sh
yarn run serve
```

Then visit http://127.0.0.1:8081/docs/

## Testing

Testing is done using the [web-component-tester](https://github.com/Polymer/web-component-tester).

Note: Test are run against the built version of the element. Make sure you build the element before testing or else your changes won't be present. See [Building](#building).

### Running Tests On The Command Line

```sh
yarn run test
```

### Running Tests In The Browser

First start up a local webserver:

```sh
yarn run serve
```

Then visit http://127.0.0.1:8081/test/ to see the tests in action.
