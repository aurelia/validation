# aurelia-validation

[![npm Version](https://img.shields.io/npm/v/aurelia-validation.svg)](https://www.npmjs.com/package/aurelia-validation)
[![ZenHub](https://raw.githubusercontent.com/ZenHubIO/support/master/zenhub-badge.png)](https://zenhub.io)
[![Join the chat at https://gitter.im/aurelia/discuss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/discuss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![CircleCI](https://circleci.com/gh/aurelia/validation.svg?style=shield)](https://circleci.com/gh/aurelia/validation)

This library is part of the [Aurelia](http://www.aurelia.io/) platform and contains a plugin that provides validation capabilities.

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.aurelia.io/) and [our email list](http://eepurl.com/ces50j). We also invite you to [follow us on twitter](https://twitter.com/aureliaeffect). If you have questions, please [join our community on Gitter](https://gitter.im/aurelia/discuss) or use [stack overflow](http://stackoverflow.com/search?q=aurelia). Documentation can be found [in our developer hub](http://aurelia.io/hub.html). If you would like to have deeper insight into our development process, please install the [ZenHub](https://zenhub.io) Chrome or Firefox Extension and visit any of our repository's boards.

## Enhancements

* First class TypeScript support
* Asynchronous validation
* Entity validation
* Multiple controllers per view.
* Drop validate.js
* Errors that aren't specific to a particular property/element
* Conditional validation
* Make it easier to define custom rules
* Make it easier to customize error messages / I18N
* Keyed message resources
* Use binding engine to render message templates
* Improve renderer API to make animation scenarios and "success" scenarios possible

## Under Consideration

* Enable specifying rules for nested properties: `ValidationRules.ensure('foo.bar.baz').required();`
* Validation sequencing: add an option or change the standard behavior such that rules specific to a particular property are validated sequentially. The first validation error cancels the remaining validation work for the property. Side-effect: properties would never have more than one error. Benefit: expensive rules could be validated only when everything else is valid.

## Known Issues

* `& validate` does not work with two-way custom attributes because it's unable to locate the associated DOM element.
* Rule property decorators missing. `@required`, etc

## Building

```shell
npm run build
```

## Tests

```shell
npm run test
```

## Developing

```shell
npm run test-watch
```
