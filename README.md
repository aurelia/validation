<p>
  <a href="https://aurelia.io/" target="_blank">
    <img alt="Aurelia" src="https://aurelia.io/styles/images/aurelia.svg">
  </a>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm Version](https://img.shields.io/npm/v/aurelia-validation.svg)](https://www.npmjs.com/package/aurelia-validation)
![ci](https://github.com/aurelia/validation/actions/workflows/main.yml/badge.svg)
[![Discourse status](https://img.shields.io/discourse/https/meta.discourse.org/status.svg)](https://discourse.aurelia.io)
[![Twitter](https://img.shields.io/twitter/follow/aureliaeffect.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=aureliaeffect)
[![Discord Chat](https://img.shields.io/discord/448698263508615178.svg)](https://discord.gg/RBtyM6u)


# aurelia-validation

This library is part of the [Aurelia](http://www.aurelia.io/) platform and contains a plugin that provides validation capabilities.

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.aurelia.io/) and [our email list](http://eepurl.com/ces50j). We also invite you to [follow us on twitter](https://twitter.com/aureliaeffect). If you have questions look around our [Discourse forums](https://discourse.aurelia.io/), chat in our [community on Discord](https://discord.gg/RBtyM6u) or use [stack overflow](http://stackoverflow.com/search?q=aurelia). Documentation can be found [in our developer hub](http://aurelia.io/docs).

## Documentation

Check out the [docs](http://aurelia.io/docs/plugins/validation) on the Aurelia Hub.

## Reporting Issues

Please refer to the [issue template](ISSUE_TEMPLATE.md). Accompany any bug report with a demo of the issue using a [runnable Gist](https://gist.run/?id=381fdb1a4b0865a4c25026187db865ce).


## Building The Code

To build the code, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

  ```shell
  npm install
  ```
3. To build the code, you can now run:

  ```shell
  npm run build
  ```
4. You will find the compiled code in the `dist` folder, available in three module formats: AMD, CommonJS and ES6.

## Running The Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. You can now run the tests with this command:

  ```shell
  npm run test
  ```

  You can optionally run either of the following:
  ```shell
  npm run test:watch
  # OR
  npm run test:debugger
  ```

  to have better development experience, with watch/debuging capabilities


## Publishing

Refer to `./doc/MAINTAINER.md` for details.