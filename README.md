# aurelia-validation

[![Join the chat at https://gitter.im/aurelia/discuss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/discuss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A validation plugin for [Aurelia](http://aurelia.io) that uses a fluent API.

``` javascript
this.validation = validation.on(this)
                      .ensure('awesomeLevel')
                            .isGreaterThan(9000)
                      .ensure('readMe')
                            .isNotEmpty()
                            .hasMinLength(5)
                      .ensure('usage')
                            .isEqualTo('simple');
```

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.durandal.io/). If you have questions, we invite you to join us on [our Gitter Channel](https://gitter.im/aurelia/discuss).

##Documentation
*Important note*: both the documentation and the samples reflect the latest version of the sources, not the latest released version!
Watch the [live samples](http://aurelia.io/validation/). (Work-in-progress)

- [Installing the plugin](https://github.com/aurelia/validation/blob/master/doc/Intro.md#installation)
- [Getting started](https://github.com/aurelia/validation/blob/master/doc/Intro.md#getting-started)
- [Validation types](https://github.com/aurelia/validation/blob/master/doc/Intro.md#validation-types)
  - [isNotEmpty()](https://github.com/aurelia/validation/blob/master/doc/Intro.md#notempty)
  - [containsNoSpaces()](https://github.com/aurelia/validation/blob/master/doc/Intro.md#containsnospaces)
  - [containsOnly(regex)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#containsonlyregex)
  - [containsOnlyAlpha()](https://github.com/aurelia/validation/blob/master/doc/Intro.md#containsonlyalpha)
  - [containsOnlyAlphaOrWhitespace()](https://github.com/aurelia/validation/blob/master/doc/Intro.md#containsonlyalphaorwhitespace)
  - [containsOnlyAlphanumerics()](https://github.com/aurelia/validation/blob/master/doc/Intro.md#containsonlyalphanumerics)
  - [containsOnlyAlphanumericsOrWhitespace()](https://github.com/aurelia/validation/blob/master/doc/Intro.md#containsonlyalphanumericsorwhitespace)
  - [containsOnlyDigits()](https://github.com/aurelia/validation/blob/master/doc/Intro.md#containsonlydigits)
  - [containsOnlyLetters()](https://github.com/aurelia/validation/blob/master/doc/Intro.md#containsonlyletters)
  - [containsOnlyLettersOrWhitespace()](https://github.com/aurelia/validation/blob/master/doc/Intro.md#containsonlylettersorwhitespace)
  - [hasLengthBetween(minLength, maxLength)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#haslengthbetweenminimumvalue-maximumvalue)
  - [hasMinLength(minLength)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#hasminlengthminimumlength)
  - [hasMaxLength(maxLength)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#hasmaxlengthmaximumlength)
  - [isBetween(minValue, maxValue)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#isbetweenminvalue-maxvalue)
  - [isEmail()](https://github.com/aurelia/validation/blob/master/doc/Intro.md#isemail)
  - [isEqualTo(otherValue, otherValueLabel)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#isequaltoothervalue-othervaluelabel)
  - [isGreaterThan(minValue)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#isgreaterthanminvalue)
  - [isGreaterThanOrEqualTo(minValue)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#isgreaterthanorequaltominvalue)
  - [isLessThan(maxValue)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#islessthanmaxvalue)
  - [isLessThanOrEqualTo(maxValue)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#islessthanorequaltomaxvalue)
  - [isIn(collection)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#isincollection)
  - [isNumber()](https://github.com/aurelia/validation/blob/master/doc/Intro.md#isnumber)
  - [isStrongPassword(minimumComplexityLevel)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#isstrongpasswordminimumcomplexitylevel)
  - [isURL()](https://github.com/aurelia/validation/blob/master/doc/Intro.md#isurl)
  - [isNotEqualTo(otherValue, otherValueLabel)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#isnotequaltoothervalue-othervaluelabel)
  - [matches(regex)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#matchesregex)
  - [passes(customFunction, threshold)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#passescustomfunction-threshold)
  - [passesRule(validationRule)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#passesrulevalidationrule)
  - [withMessage(message)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#withmessagemessage)
- [Logical Operators](https://github.com/aurelia/validation/blob/master/doc/Intro.md#logical-operators)
  - [if(conditionalExpression)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#ifconditionalexpression)
  - [switch(conditionalExpression)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#switchconditionalexpression)
- [onValidate(validationCallback, failureCallback)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#onvalidatevalidationcallback-failurecallback)
- [Alternative validation setup](https://github.com/aurelia/validation/blob/master/doc/Intro.md#alternative-validation-setup)
  - [The @ensure decorator](https://github.com/aurelia/validation/blob/master/doc/Intro.md#the-ensure-decorator)
  - [Breeze (.onBreezeEntity(entity))](https://github.com/aurelia/validation/blob/master/doc/Intro.md#breeze-onbreezeentityentity)
- [I18N](https://github.com/aurelia/validation/blob/master/doc/Intro.md#i18n)
- [Custom Validation](https://github.com/aurelia/validation/blob/master/doc/Intro.md#custom-validation)
- [Visualization (Validate custom attribute) ](https://github.com/aurelia/validation/blob/master/doc/Intro.md#visualization-validatecustomattribute)
  - [Basic Usage](https://github.com/aurelia/validation/blob/master/doc/Intro.md#basic-usage-2)
  - [Visual clues and customization](https://github.com/aurelia/validation/blob/master/doc/Intro.md#visual-clues-and-customization)
  - [How are elements and validation rules matched](https://github.com/aurelia/validation/blob/master/doc/Intro.md#how-are-elements-and-validation-rules-matched)
  - [Preventing form submission](https://github.com/aurelia/validation/blob/master/doc/Intro.md#preventing-form-submission)
- [ValidationResult](https://github.com/aurelia/validation/blob/master/doc/Intro.md#validationresult)
- [Configuration](https://github.com/aurelia/validation/blob/master/doc/Intro.md#configuration)
  - [One config to rule them all](https://github.com/aurelia/validation/blob/master/doc/Intro.md#one-config-to-rule-them-all)
  - [config.useDebounceTimeout(timeout)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#configusedebouncetimeoutdebouncetimeout)
  - [config.computedFrom(dependencies)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#configcomputedfromarrayofbindingpaths)
  - [config.useLocale(locale)](https://github.com/aurelia/validation/blob/master/doc/Intro.md#configuselocalelocaleidentifier)
  - [config.useViewStrategy](https://github.com/aurelia/validation/blob/master/doc/Intro.md#configuseviewstrategyviewstrategyinstance)

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
