# aurelia-validation

[![Join the chat at https://gitter.im/aurelia/validation](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/validation?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A validation plugin for [Aurelia](http://aurelia.io) that uses a fluent API.

``` javascript
this.validation = validation.on(this)
                      .ensure('awesomeLevel')
                            .min(9000)
                      .ensure('readMe')
                            .notEmpty()
                            .minLength(5)
                      .ensure('usage')
                            .equals('simple');
```

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.durandal.io/). If you have questions, we invite you to join us on [our Gitter Channel](https://gitter.im/aurelia/discuss).

##Documentation
- [Installing the plugin](https://github.com/aurelia/validation/blob/master/doc/Intro.md#installation)
- [Getting started](https://github.com/aurelia/validation/blob/master/doc/Intro.md#getting-started)
- [Validation types](https://github.com/aurelia/validation/blob/master/doc/Intro.md#validation-types)
  - [notEmpty()](https://github.com/aurelia/validation/blob/master/doc/Intro.md#notempty)
  - [between(minimumValue, maximumValue)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#betweenminimumvalue-maximumvalue)
  - [betweenLength(minimumLength, maximumLength)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#betweenlengthminimumlength-maximumlength)
  - [email()](https://github.com/aurelia/validation/blob/master/doc/Intro.md#email)
  - [equals(otherValue, otherValueLabel)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#equalsothervalue-othervaluelabel)
  - [in(collection)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#incollection)
  - [isAlphanumeric()](https://github.com/aurelia/validation/blob/master/doc/Intro.md#isalphanumeric)
  - [isAlphanumericOrWhitespace()](https://github.com/aurelia/validation/blob/master/doc/Intro.md#isalphanumericorwhitespace)
  - [isDigit()](https://github.com/aurelia/validation/blob/master/doc/Intro.md#isdigit)
  - [isStrongPassword(minimumComplexityLevel)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#isstrongpasswordminimumcomplexitylevel)
  - [isNumeric()](https://github.com/aurelia/validation/blob/master/doc/Intro.md#isnumeric)
  - [minLength(minimumLength)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#minlengthminimumlength)
  - [minimum(minimumValue)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#minimumminimumvalue)
  - [matches(regex)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#matchesregex)
  - [matchesRegex(regexString)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#matchesregexregexstring)
  - [maxLength(maximumLength)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#maxlengthmaximumlength)
  - [maximum(maximumValue)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#maximummaximumvalue)
  - [notEquals(otherValue, otherValueLabel)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#notequalsothervalue-othervaluelabel)
  - [passes(customFunction, threshold)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#passescustomfunction-threshold)
  - [passesRule(validationRule)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#passesrulevalidationrule)
  - [withMessage(message)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#withmessagemessage)
- [Logical Operators](https://github.com/aurelia/validation/blob/master/doc/Intro.md#logical-operators)
  - [if(conditionalExpression)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#ifconditionalexpression)
  - [switch(conditionalExpression)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#switchconditionalexpression)
- [I18N](https://github.com/aurelia/validation/blob/master/doc/Intro.md#i18n)
- [Custom Validation](https://github.com/aurelia/validation/blob/master/doc/Intro.md#custom-validation)
- [Customizing visualization](https://github.com/aurelia/validation/blob/master/doc/Intro.md#customizing-the-visualization)
- [ValidationResult](https://github.com/aurelia/validation/blob/master/doc/Intro.md#validationresult)

## Dependencies


* [aurelia-binding](https://github.com/aurelia/binding)
* [aurelia-templating](https://github.com/aurelia/templating)

## Used By

This library isn't used by Aurelia. It is an optional plugin.

## Platform Support

This library can be used in the **browser**.

## Building The Code

To build the code, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

	```shell
	npm install
	```
3. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

	```shell
	npm install -g gulp
	```
4. To build the code, you can now run:

	```shell
	gulp build
	```
5. You will find the compiled code in the `dist` folder, available in three module formats: AMD, CommonJS and ES6.

6. See `gulpfile.js` for other tasks related to generating the docs and linting.

## Running The Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. Ensure that the [Karma](http://karma-runner.github.io/) CLI is installed. If you need to install it, use the following command:

	```shell
	npm install -g karma-cli
	```
2. Ensure that [jspm](http://jspm.io/) is installed. If you need to install it, use the following commnand:

	```shell
	npm install -g jspm
	```
3. Download the [SystemJS](https://github.com/systemjs/systemjs) module loader:

	```shell
	jspm dl-loader
	```

4. You can now run the tests with this command:

	```shell
	karma start
	```
