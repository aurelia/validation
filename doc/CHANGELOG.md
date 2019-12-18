# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [1.6.0](https://github.com/aurelia/validation/compare/1.5.0...1.6.0) (2019-12-18)


### Bug Fixes

* **all:** update binding library and fix TS errors ([33c91a1](https://github.com/aurelia/validation/commit/33c91a1120c0cc41a3a1bb093aca7fd682d56e34))
* **ExpressionVisitor:** not redeclare imports ([15109b3](https://github.com/aurelia/validation/commit/15109b3a82f0d0ecebaf19c7b1490c4373731c13)), closes [#537](https://github.com/aurelia/validation/issues/537)


### Features

* **config:** make config constructor param optional and place default trigger in static property ([a52f4c4](https://github.com/aurelia/validation/commit/a52f4c403bb68ed895fd0b7a3ea217c67ce22e2d))
* **config:** make the setters chainable ([bd118a6](https://github.com/aurelia/validation/commit/bd118a61c9cb283cbb9db36712660a0362f5994c))
* **config:** rename global config class ([c4e5fe2](https://github.com/aurelia/validation/commit/c4e5fe29e2a9bcd11cfdaba0f70050ef9c894be6))
* **config:** support global config option for default validation trigger ([39a4e67](https://github.com/aurelia/validation/commit/39a4e679513e3fa716b46cedce24931b3b57028f))



## [1.5.0](https://github.com/aurelia/validation/compare/1.4.0...1.5.0) (2019-08-09)

* Update type definitions for compatibility with latest dependency-injection release.

# [1.4.0](https://github.com/aurelia/validation/compare/1.3.3...1.4.0) (2019-03-22)


### Bug Fixes

* **build:** adjust umd build, add umd-es2015 ([895b149](https://github.com/aurelia/validation/commit/895b149))
* **ci:** remove circle ci config ([5f9cf3c](https://github.com/aurelia/validation/commit/5f9cf3c))
* **ci:** update ci config ([306b935](https://github.com/aurelia/validation/commit/306b935))
* **ci:** update circleci ([cc54202](https://github.com/aurelia/validation/commit/cc54202))
* **ci:** use v2.1 ([71074ef](https://github.com/aurelia/validation/commit/71074ef))
* **package:** fix unpkg field ([2635ecd](https://github.com/aurelia/validation/commit/2635ecd))


### Features

* **ValidationRules:** add number validation rules ([f67cf59](https://github.com/aurelia/validation/commit/f67cf59)), closes [#440](https://github.com/aurelia/validation/issues/440)



<a name="1.3.3"></a>
## [1.3.3](https://github.com/aurelia/validation/compare/1.3.2...1.3.3) (2019-01-19)

* Add module and CDN fields to package.json

<a name="1.3.1"></a>
## [1.3.1](https://github.com/aurelia/validation/compare/1.3.0...1.3.1) (2018-11-16)


### Bug Fixes

* **CustomAttribute:** import customAttribute from aurelia-templating ([08c2f45](https://github.com/aurelia/validation/commit/08c2f45)), closes [#507](https://github.com/aurelia/validation/issues/507)



<a name="1.3.0"></a>
# [1.3.0](https://github.com/aurelia/validation/compare/1.2.3...1.3.0) (2018-10-30)


### Bug Fixes

* **BindingBehaviors:** add explicit name ([59e3f1c](https://github.com/aurelia/validation/commit/59e3f1c))
* **typings:** path to typescript definitions ([77ffaa1](https://github.com/aurelia/validation/commit/77ffaa1))



<a name="1.2.3"></a>
## [1.2.3](https://github.com/aurelia/validation/compare/1.2.2...1.2.3) (2018-09-25)


### Bug Fixes

* **DI:** static inject method instead of property ([69d3eff](https://github.com/aurelia/validation/commit/69d3eff))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/aurelia/validation/compare/1.1.3...1.2.0) (2018-06-21)


### Bug Fixes

* **property-access:** make number and string property keys work the same way ([bca8d33](https://github.com/aurelia/validation/commit/bca8d33))
* **property-accessor-parser:** handle numeric property keys ([7288a73](https://github.com/aurelia/validation/commit/7288a73))
* **StandardValidator:** change to handle empty rule sets ([85145b8](https://github.com/aurelia/validation/commit/85145b8)), closes [#483](https://github.com/aurelia/validation/issues/483)
* **validation-messages:** assign the parser in the constructor ([7ba58da](https://github.com/aurelia/validation/commit/7ba58da))
* **ValidationMessageProvider:** increase visibility of parser field ([b7636b5](https://github.com/aurelia/validation/commit/b7636b5)), closes [#464](https://github.com/aurelia/validation/issues/464)


### Features

* **Validation:** support integer property keys ([e74ca86](https://github.com/aurelia/validation/commit/e74ca86)), closes [#474](https://github.com/aurelia/validation/issues/474)



<a name="1.1.3"></a>
## [1.1.3](https://github.com/aurelia/validation/compare/1.1.2...1.1.3) (2018-03-18)


### Bug Fixes

* **ValidateBindingBehavior:** avoid conflicts ([e15b06b](https://github.com/aurelia/validation/commit/e15b06b)), closes [#470](https://github.com/aurelia/validation/issues/470)



<a name="1.1.2"></a>
## [1.1.2](https://github.com/aurelia/validation/compare/1.1.1...v1.1.2) (2017-10-02)


### Bug Fixes

* **validation-controller:** fix revalidateErrors method ([bcf8a46](https://github.com/aurelia/validation/commit/bcf8a46)), closes [#456](https://github.com/aurelia/validation/issues/456)



<a name="1.1.0"></a>
# [1.1.0](https://github.com/aurelia/validation/compare/1.0.0...v1.1.0) (2017-06-27)


### Bug Fixes

* **getPropertyInfo:** use scope traversal ([6789112](https://github.com/aurelia/validation/commit/6789112)), closes [#408](https://github.com/aurelia/validation/issues/408)
* **ValidationControllerFactory:** supply required arg ([377e6c9](https://github.com/aurelia/validation/commit/377e6c9))
* **ValidationRules:** merge rules for same property ([33f741a](https://github.com/aurelia/validation/commit/33f741a)), closes [#400](https://github.com/aurelia/validation/issues/400)
* **ValidationRules:** satisfies callback arg required ([258615e](https://github.com/aurelia/validation/commit/258615e)), closes [#426](https://github.com/aurelia/validation/issues/426)


### Features

* **build:** add ES2017 target ([b266af5](https://github.com/aurelia/validation/commit/b266af5))
* **ValidationController:** accept property accessor expression in addError ([842fb4c](https://github.com/aurelia/validation/commit/842fb4c)), closes [#422](https://github.com/aurelia/validation/issues/422)
* **ValidationController:** add revalidateErrors method ([47026ec](https://github.com/aurelia/validation/commit/47026ec)), closes [#349](https://github.com/aurelia/validation/issues/349)
* **ValidationController:** events ([57232ce](https://github.com/aurelia/validation/commit/57232ce)), closes [#318](https://github.com/aurelia/validation/issues/318)
* **ValidationRules:** untaggedRules ([549a4a9](https://github.com/aurelia/validation/commit/549a4a9)), closes [#436](https://github.com/aurelia/validation/issues/436)


<a name="1.0.0"></a>
# [1.0.0](https://github.com/aurelia/validation/compare/1.0.0-beta.1.0.1...v1.0.0) (2017-03-01)


### Bug Fixes

* **build:** add __esModule flag ([0f20d7c](https://github.com/aurelia/validation/commit/0f20d7c)), closes [#417](https://github.com/aurelia/validation/issues/417)
* **package:** delete unnecessary [@types](https://github.com/types) packages ([f9ec842](https://github.com/aurelia/validation/commit/f9ec842))
* **package:** update to typescript 2.2 ([65759b4](https://github.com/aurelia/validation/commit/65759b4)), closes [#417](https://github.com/aurelia/validation/issues/417)
* **ValidationParser:** improve function regex ([5e32142](https://github.com/aurelia/validation/commit/5e32142))


### Features

* **validation-errors:** enable explicit controller binding ([4fbf24e](https://github.com/aurelia/validation/commit/4fbf24e))
* **validation-messages:** displayName function ([233fbbc](https://github.com/aurelia/validation/commit/233fbbc))
* **Validator:** server-side validation ([1b701ab](https://github.com/aurelia/validation/commit/1b701ab)), closes [#398](https://github.com/aurelia/validation/issues/398)



<a name="1.0.0-beta.1.0.1"></a>
# [1.0.0-beta.1.0.1](https://github.com/aurelia/validation/compare/1.0.0-beta.1.0.0...v1.0.0-beta.1.0.1) (2016-12-24)


### Bug Fixes

* **build:** correct es2015 and native-modules builds ([d749cf5](https://github.com/aurelia/validation/commit/d749cf5))
* **package:** fix doc build ([9e79087](https://github.com/aurelia/validation/commit/9e79087))
* **ValidationController:** keep errors property in sync ([658ab0f](https://github.com/aurelia/validation/commit/658ab0f)), closes [#396](https://github.com/aurelia/validation/issues/396)



<a name="1.0.0-beta.1.0.0"></a>
# [1.0.0-beta.1.0.0](https://github.com/aurelia/validation/compare/0.14.0...1.0.0-beta.1.0.0) (2016-12-09)


### Bug Fixes

* **FluentRules:** reset sequence on each ensure ([c2a2ae1](https://github.com/aurelia/validation/commit/c2a2ae1)), closes [#393](https://github.com/aurelia/validation/issues/393)


### Features

* **Renderer:** enable success styling ([cd68315](https://github.com/aurelia/validation/commit/cd68315)), closes [#356](https://github.com/aurelia/validation/issues/356)
* **ValidationMessageProvider:** include displayName arg ([4120e25](https://github.com/aurelia/validation/commit/4120e25)), closes [#328](https://github.com/aurelia/validation/issues/328)



<a name="0.14.0"></a>
# [0.14.0](https://github.com/aurelia/validation/compare/0.13.1...0.14.0) (2016-11-08)


### Bug Fixes

* **build:** fix api.json generation ([bea1cd7](https://github.com/aurelia/validation/commit/bea1cd7))
* **ValidationController:** handle null objects ([d57f09f](https://github.com/aurelia/validation/commit/d57f09f)), closes [#277](https://github.com/aurelia/validation/issues/277) [#353](https://github.com/aurelia/validation/issues/353)
* **ValidationParser:** handle parenthesis ([762b425](https://github.com/aurelia/validation/commit/762b425)), closes [#324](https://github.com/aurelia/validation/issues/324)


### Features

* **package:** add tslint ([80315ab](https://github.com/aurelia/validation/commit/80315ab))
* **validation-rules:** validate email as per HTML standard ([707835a](https://github.com/aurelia/validation/commit/707835a))



<a name="0.13.1"></a>
## [0.13.1](https://github.com/aurelia/validation/compare/0.13.0...0.13.1) (2016-10-06)



<a name="0.13.0"></a>
# [0.13.0](https://github.com/aurelia/validation/compare/0.12.5...0.13.0) (2016-09-29)


### Bug Fixes

* **package:** cross platform script compat ([1669d1b](https://github.com/aurelia/validation/commit/1669d1b)), closes [#337](https://github.com/aurelia/validation/issues/337)
* **ValidationParser:** handle props that are only accessible via bracket syntax ([8ef6182](https://github.com/aurelia/validation/commit/8ef6182)), closes [#326](https://github.com/aurelia/validation/issues/326)


### Features

* **ValidateBindingBehavior:** enable specifying validate trigger on individual bindings ([e506476](https://github.com/aurelia/validation/commit/e506476)), closes [#303](https://github.com/aurelia/validation/issues/303)
* **validateTrigger:** add changeOrBlur trigger ([65201b6](https://github.com/aurelia/validation/commit/65201b6)), closes [#308](https://github.com/aurelia/validation/issues/308)
* **validation-rules:** permit uppercase email ([f6a2c0c](https://github.com/aurelia/validation/commit/f6a2c0c))
* **ValidationControllerFactory:** add validator arg to createForCurrentScope ([70b1176](https://github.com/aurelia/validation/commit/70b1176)), closes [#347](https://github.com/aurelia/validation/issues/347)
* **Validator:** rule prioritization and bailing ([22bc58f](https://github.com/aurelia/validation/commit/22bc58f)), closes [#301](https://github.com/aurelia/validation/issues/301)



<a name="0.12.5"></a>
## [0.12.5](https://github.com/aurelia/validation/compare/0.12.4...0.12.5) (2016-09-13)


### Bug Fixes

* **ValidationControllerFactory:** construct in child container ([03d4539](https://github.com/aurelia/validation/commit/03d4539)), closes [#322](https://github.com/aurelia/validation/issues/322)
* **ValidationParser:** handle "use strict" ([2e8712b](https://github.com/aurelia/validation/commit/2e8712b)), closes [#324](https://github.com/aurelia/validation/issues/324)



<a name="0.12.4"></a>
## [0.12.4](https://github.com/aurelia/validation/compare/0.12.3...0.12.4) (2016-09-12)


### Features

* **ValidationError:** override toString ([a17139f](https://github.com/aurelia/validation/commit/a17139f)), closes [#323](https://github.com/aurelia/validation/issues/323)



<a name="0.12.3"></a>
## [0.12.3](https://github.com/aurelia/validation/compare/0.12.2...0.12.3) (2016-09-07)


### Bug Fixes

* **build:** turn on declarations flag ([e793987](https://github.com/aurelia/validation/commit/e793987))


### Features

* **RenderInstruction:** add 'kind' property ([6859124](https://github.com/aurelia/validation/commit/6859124)), closes [#315](https://github.com/aurelia/validation/issues/315)
* **ValidateBindingBehavior:** support custom attributes ([b18c1b6](https://github.com/aurelia/validation/commit/b18c1b6)), closes [#288](https://github.com/aurelia/validation/issues/288)
* **ValidationParser:** caching and warnings ([277bab2](https://github.com/aurelia/validation/commit/277bab2)), closes [#304](https://github.com/aurelia/validation/issues/304)
* **ValidationParser:** parse arrow functions ([384591b](https://github.com/aurelia/validation/commit/384591b)), closes [#300](https://github.com/aurelia/validation/issues/300)
* **ValidationRules:** add equals rule ([bc78719](https://github.com/aurelia/validation/commit/bc78719)), closes [#298](https://github.com/aurelia/validation/issues/298)
* **withMessage:** provide access to getDisplayName ([7137dd2](https://github.com/aurelia/validation/commit/7137dd2)), closes [#307](https://github.com/aurelia/validation/issues/307)


### BREAKING CHANGES

* withMessage: computeDisplayName has been renamed to getDisplayName



<a name="0.12.2"></a>
## [0.12.2](https://github.com/aurelia/validation/compare/0.12.1...0.12.2) (2016-08-29)


### Bug Fixes

* **package.json:** add missing dependency ([fb90142](https://github.com/aurelia/validation/commit/fb90142))
* **package.json:** add missing dependency ([9f01d3b](https://github.com/aurelia/validation/commit/9f01d3b))
* **util:** isString fix for Internet Explorer ([8c93a9d](https://github.com/aurelia/validation/commit/8c93a9d)), closes [#292](https://github.com/aurelia/validation/issues/292)
* **ValidationController:** validate binding only when bound ([53a62c4](https://github.com/aurelia/validation/commit/53a62c4)), closes [#294](https://github.com/aurelia/validation/issues/294)
* **ValidationRules:** improve typescript definition ([26cc9ec](https://github.com/aurelia/validation/commit/26cc9ec))



<a name="0.12.1"></a>
## [0.12.1](https://github.com/aurelia/validation/compare/0.12.0...0.12.1) (2016-08-27)


### Bug Fixes

* **rules:** store rules using non-enumerable property ([01d8501](https://github.com/aurelia/validation/commit/01d8501))
* **ValidationParser:** accept string property names ([88925cb](https://github.com/aurelia/validation/commit/88925cb))



<a name="0.12.0"></a>
# [0.12.0](https://github.com/aurelia/validation/compare/0.11.0...0.12.0) (2016-08-26)


### Bug Fixes

* **doc:** add strict mode for Node LTS compat ([e5203ca](https://github.com/aurelia/validation/commit/e5203ca))
* **doc:** api.json fix ([584a7a2](https://github.com/aurelia/validation/commit/584a7a2))
* **readme:** correct gist url ([cbe1349](https://github.com/aurelia/validation/commit/cbe1349))
* **ValidationController:** use rules in instruction predicate ([189d85c](https://github.com/aurelia/validation/commit/189d85c))


### Features

* **all:** add bower, jspm and typings config ([b368904](https://github.com/aurelia/validation/commit/b368904))



<a name="0.11.0"></a>
# [0.11.0](https://github.com/aurelia/validation/compare/0.10.1...0.11.0) (2016-07-27)



<a name="0.10.1"></a>
## [0.10.1](https://github.com/aurelia/validation/compare/0.10.0...0.10.1) (2016-07-22)


### Bug Fixes

* **validation:** Add proper resources to package.json for webpack ([#268](https://github.com/aurelia/validation/issues/268)) ([dca4031](https://github.com/aurelia/validation/commit/dca4031))



<a name="0.10.0"></a>
# [0.10.0](https://github.com/aurelia/validation/compare/0.9.2...0.10.0) (2016-06-22)


### Bug Fixes

* **validate-binding-behavior:** IE11 compat ([396e785](https://github.com/aurelia/validation/commit/396e785)), closes [#257](https://github.com/aurelia/validation/issues/257)



<a name="0.9.2"></a>
## [0.9.2](https://github.com/aurelia/validation/compare/0.9.1...0.9.2) (2016-06-17)


### Bug Fixes

* **ValidationController:** always re-render errors ([4ea4435](https://github.com/aurelia/validation/commit/4ea4435)), closes [aurelia/validatejs#82](https://github.com/aurelia/validatejs/issues/82)



<a name="0.9.1"></a>
## [0.9.1](https://github.com/aurelia/validation/compare/0.9.0...0.9.1) (2016-06-16)


### Bug Fixes

* **all:** enable unrender on detached DOM nodes ([ac4c7e6](https://github.com/aurelia/validation/commit/ac4c7e6)), closes [aurelia/validatejs#79](https://github.com/aurelia/validatejs/issues/79)



<a name="0.9.0"></a>
# [0.9.0](https://github.com/aurelia/validation/compare/0.8.1...0.9.0) (2016-06-14)


### Features

* **validation:** add binding behavior ([7f9817a](https://github.com/aurelia/validation/commit/7f9817a))
