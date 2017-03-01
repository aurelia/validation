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



