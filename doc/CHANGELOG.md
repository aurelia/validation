### 0.2.5 (2015-06-10)


#### Bug Fixes

* **API:** API is inconsistent ([cc7b407c](https://github.com/aurelia/validation/commit/cc7b407c97f499b0b920c2918173d0966882c745), closes [#20](https://github.com/aurelia/validation/issues/20))
* **DOC:** forgot to add to intro.md ([95e8ab7a](https://github.com/aurelia/validation/commit/95e8ab7a5b0cf7e77c8df48426fc688ff5cc6811))
* **I18N:** fixed number formatting ([8e946418](https://github.com/aurelia/validation/commit/8e946418b93e55f7be12d5f74370a186dd2f6346))
* **ValidateCustomAttributeViewStrategyBase:** ValidateCustomAttributeViewStrategyBase  is not exported ([cfca0142](https://github.com/aurelia/validation/commit/cfca0142fff2d1423f6e90eb635e64367e475375))
* **clear:**
  * timing issues ([1de58eaa](https://github.com/aurelia/validation/commit/1de58eaa11f6300b55f049d829df6ff54c1affb6))
  * timing issues ([d9df1d13](https://github.com/aurelia/validation/commit/d9df1d13166440f8661b48bf6c6f943d7fb5c66f), closes [#44](https://github.com/aurelia/validation/issues/44))
* **config:**
  * config should be a singleton ([42e4b4c4](https://github.com/aurelia/validation/commit/42e4b4c484e462363c649bad93add8ee37c6310e))
  * config should be a singleton ([c1125852](https://github.com/aurelia/validation/commit/c11258521bb112c161862235767c5d27042f73ad))
* **decorators:** @ensure was imported, not exported ([d421c299](https://github.com/aurelia/validation/commit/d421c29957d4afb2a6d6b5c4efb8817b17401201))
* **email:** add a better email validation ([9e45f82d](https://github.com/aurelia/validation/commit/9e45f82db028c71a88a5d75c4fdf678c5474e7a3))
* **en-US:** fixed message for BetweenLength ([f25c63ef](https://github.com/aurelia/validation/commit/f25c63ef60981079cfe6a9112357df4c573bf996))
* **install:**
  * using aurelia api vs container api ([904c29ad](https://github.com/aurelia/validation/commit/904c29adff8317d7a4a8099ee17e467a6a2cfec6))
  * invalid install logic ([d9d59fab](https://github.com/aurelia/validation/commit/d9d59fab394f745cb085a5a264eb1a8aa34c7636))
* **locale:**
  * locales are not being loaded ([e6261e59](https://github.com/aurelia/validation/commit/e6261e59843fcd8d53c4f08096bd14b1ef38dcc4))
  * locales are not being loaded ([b83833c9](https://github.com/aurelia/validation/commit/b83833c92cd06ea306f842bcb7e3f1758f5433ae))
* **nl-BE:** small typo ([2cce4e5b](https://github.com/aurelia/validation/commit/2cce4e5b245791e43567b96c61e6c7215b4506ee))
* **onValidate:**
  * onValidate would overwrite already invalid properties ([ff92803e](https://github.com/aurelia/validation/commit/ff92803e91ded0c29855ca73f8d5169abddd3466))
  * onValidate broke fluent api ([b40954c7](https://github.com/aurelia/validation/commit/b40954c7baab3fa537412f09b60e5a064cac842d))
* **onvalidate:** ability to omit properties ([d3a79d47](https://github.com/aurelia/validation/commit/d3a79d47aac5a8e5d760f88a7b3f6d3dce456a38))
* **package:**
  * NPM package did not have index.js ([3657e9a0](https://github.com/aurelia/validation/commit/3657e9a0ed4d10cbd92b1313c17a1d510f6b6eef), closes [#22](https://github.com/aurelia/validation/issues/22))
  * NPM package did not have index.js ([a5ad3dd9](https://github.com/aurelia/validation/commit/a5ad3dd91b08ea6b64fcdc074fc6b7ab7ad5fc63), closes [#22](https://github.com/aurelia/validation/issues/22))
* **path-observer:** correct function call typo ([010d711c](https://github.com/aurelia/validation/commit/010d711c97784aafa20300b2588a2019b1dcbf4e))
* **timing:** Promises that finish late are not supported correctly ([d32dd93f](https://github.com/aurelia/validation/commit/d32dd93f6c5c0565f0a171f73f70da05cb739913), closes [#27](https://github.com/aurelia/validation/issues/27))
* **trim:** values are no longer trimmed before validation ([e567cb8e](https://github.com/aurelia/validation/commit/e567cb8e450fe56a8d1e98fa48ec3d940c052507), closes [#32](https://github.com/aurelia/validation/issues/32))
* **validate-custom-attribute:** remove import ([2ae52928](https://github.com/aurelia/validation/commit/2ae52928015abc7cda3c847bff7dbd433c2e9155))
* **validation-config:** added missing this ref ([4734d96b](https://github.com/aurelia/validation/commit/4734d96b89f1689c09135750ca1c587031fa9ef3))
* **validation-property:** fix throw syntax error ([07e51d56](https://github.com/aurelia/validation/commit/07e51d562846d7ef0806df56246563d1f920c379))
* **validation-rules:** fix parse parameter ([7097a6d7](https://github.com/aurelia/validation/commit/7097a6d7b2152246f9ebe351745923c1478eba50))
* **validation-rules-collection:** fix throw syntax ([1a861757](https://github.com/aurelia/validation/commit/1a861757633726767d5a430aa4a5876d42473b01))
* **withMessage:** withMessage after isNotEmpty() ([69e27af5](https://github.com/aurelia/validation/commit/69e27af5e51f34fc844200d13ab1a68c0f8e6b8c), closes [#43](https://github.com/aurelia/validation/issues/43))


#### Features

* **I18N:** added es-MX ([edab3939](https://github.com/aurelia/validation/commit/edab39390daf928396a6c9b3dad27296b6c79f77))
* **async:** validation is now running promises ([5e713096](https://github.com/aurelia/validation/commit/5e713096ca75a330521d2d1f2c09374f3e190068), closes [#3](https://github.com/aurelia/validation/issues/3))
* **breeze:**
  * documentation ([6751be32](https://github.com/aurelia/validation/commit/6751be32000280ece9e5e00c20b097fc2c3decac))
  * further development ([772f332b](https://github.com/aurelia/validation/commit/772f332b852407e1163c6a461571e75506d48a98))
  * initial binding to breeze entities ([acb3e26a](https://github.com/aurelia/validation/commit/acb3e26af1cff4e9e09a3e875c5db3bab3a24a56))
* **clear:** validation.result.clear() resets validation result ([5c5deafb](https://github.com/aurelia/validation/commit/5c5deafb2f37eb1f9333fdd3321bd2391e21d14d), closes [#44](https://github.com/aurelia/validation/issues/44))
* **config:** Allow runtime configuration ([8c9fefaf](https://github.com/aurelia/validation/commit/8c9fefaf51395fb180aa9575456a335bc69ace6c), closes [#8](https://github.com/aurelia/validation/issues/8), [#21](https://github.com/aurelia/validation/issues/21), [#34](https://github.com/aurelia/validation/issues/34))
* **containsNoSpaces:** containsNoSpaces checks for a value not containing a single whitespace character ([518bb3b6](https://github.com/aurelia/validation/commit/518bb3b60a36a560c3fda4aa1575ccd416bae06f), closes [#57](https://github.com/aurelia/validation/issues/57))
* **debouncer:** debouncer blocks continuously changing values ([fb577d0c](https://github.com/aurelia/validation/commit/fb577d0c1acbfafd2ce835c598c5137e8a694850))
* **decorators:** introducing the @ensure property decorator ([784e73f2](https://github.com/aurelia/validation/commit/784e73f28ed44a357d78528ac9ddc4b26a7cf794))
* **i18n:** added resource for language es-MX ([55f65257](https://github.com/aurelia/validation/commit/55f6525769133b342289c4e262ba616f63dfd2eb))
* **isURL:** isURL checks for a value being a valid URL ([5499ab6f](https://github.com/aurelia/validation/commit/5499ab6f59b719b7efc6c5e9d44510b8dfc3987d), closes [#56](https://github.com/aurelia/validation/issues/56))
* **isValidating:** isValidating is true while validating ([d5cd18c0](https://github.com/aurelia/validation/commit/d5cd18c0601d1246ac1af9cf274db160ebdd26ba))
* **onValidate:** callback for async validation on the entire subject ([1f828849](https://github.com/aurelia/validation/commit/1f828849ed13e31088b3c5e88254bacc51153d19), closes [#25](https://github.com/aurelia/validation/issues/25))
* **validateAttachedBehavior:** show 'success' for properties with no validation rules ([8c53d77f](https://github.com/aurelia/validation/commit/8c53d77f9d10d1abc0f53898dce13ba0d216dda7), closes [#17](https://github.com/aurelia/validation/issues/17))
* **viewStrategy:** Allows different view strategy to be plugged ([938ac37f](https://github.com/aurelia/validation/commit/938ac37f12b23db2f72e820ef3405fec63ee8c68), closes [#6](https://github.com/aurelia/validation/issues/6))


### 0.2.4 (2015-05-01)


#### Bug Fixes

* **decorators:** @ensure was imported, not exported ([d421c299](https://github.com/aurelia/validation/commit/d421c29957d4afb2a6d6b5c4efb8817b17401201))

#### Features

* **breeze:**
  * documentation ([6751be32](https://github.com/aurelia/validation/commit/6751be32000280ece9e5e00c20b097fc2c3decac))
  * further development ([772f332b](https://github.com/aurelia/validation/commit/772f332b852407e1163c6a461571e75506d48a98))
  * initial binding to breeze entities ([acb3e26a](https://github.com/aurelia/validation/commit/acb3e26af1cff4e9e09a3e875c5db3bab3a24a56))
* **decorators:** introducing the @ensure property decorator ([784e73f2](https://github.com/aurelia/validation/commit/784e73f28ed44a357d78528ac9ddc4b26a7cf794))


### 0.2.3 (2015-04-26)


#### Bug Fixes


#### Features

* **breeze:**
  * documentation ([6751be32](https://github.com/aurelia/validation/commit/6751be32000280ece9e5e00c20b097fc2c3decac))
  * further development ([772f332b](https://github.com/aurelia/validation/commit/772f332b852407e1163c6a461571e75506d48a98))
  * initial binding to breeze entities ([acb3e26a](https://github.com/aurelia/validation/commit/acb3e26af1cff4e9e09a3e875c5db3bab3a24a56))
* **clear:** validation.result.clear() resets validation result ([5c5deafb](https://github.com/aurelia/validation/commit/5c5deafb2f37eb1f9333fdd3321bd2391e21d14d), closes [#44](https://github.com/aurelia/validation/issues/44))


### 0.2.2 (2015-04-16)


#### Bug Fixes

* **withMessage:** withMessage after isNotEmpty() ([69e27af5](https://github.com/aurelia/validation/commit/69e27af5e51f34fc844200d13ab1a68c0f8e6b8c), closes [#43](https://github.com/aurelia/validation/issues/43))


#### Features

* **I18N:** added es-MX ([edab3939](https://github.com/aurelia/validation/commit/edab39390daf928396a6c9b3dad27296b6c79f77))
* **i18n:** added resource for language es-MX ([55f65257](https://github.com/aurelia/validation/commit/55f6525769133b342289c4e262ba616f63dfd2eb))


### 0.2.1 (2015-04-14)


#### Bug Fixes

* **API:** API is inconsistent ([cc7b407c](https://github.com/aurelia/validation/commit/cc7b407c97f499b0b920c2918173d0966882c745), closes [#20](https://github.com/aurelia/validation/issues/20))
* **I18N:** fixed number formatting ([8e946418](https://github.com/aurelia/validation/commit/8e946418b93e55f7be12d5f74370a186dd2f6346))
* **config:**
  * config should be a singleton ([42e4b4c4](https://github.com/aurelia/validation/commit/42e4b4c484e462363c649bad93add8ee37c6310e))
  * config should be a singleton ([c1125852](https://github.com/aurelia/validation/commit/c11258521bb112c161862235767c5d27042f73ad))
* **email:** add a better email validation ([9e45f82d](https://github.com/aurelia/validation/commit/9e45f82db028c71a88a5d75c4fdf678c5474e7a3))
* **install:** invalid install logic ([d9d59fab](https://github.com/aurelia/validation/commit/d9d59fab394f745cb085a5a264eb1a8aa34c7636))
* **locale:**
  * locales are not being loaded ([e6261e59](https://github.com/aurelia/validation/commit/e6261e59843fcd8d53c4f08096bd14b1ef38dcc4))
  * locales are not being loaded ([b83833c9](https://github.com/aurelia/validation/commit/b83833c92cd06ea306f842bcb7e3f1758f5433ae))
* **nl-BE:** small typo ([2cce4e5b](https://github.com/aurelia/validation/commit/2cce4e5b245791e43567b96c61e6c7215b4506ee))
* **onValidate:** onValidate broke fluent api ([b40954c7](https://github.com/aurelia/validation/commit/b40954c7baab3fa537412f09b60e5a064cac842d))
* **onvalidate:** ability to omit properties ([d3a79d47](https://github.com/aurelia/validation/commit/d3a79d47aac5a8e5d760f88a7b3f6d3dce456a38))
* **package:**
  * NPM package did not have index.js ([3657e9a0](https://github.com/aurelia/validation/commit/3657e9a0ed4d10cbd92b1313c17a1d510f6b6eef), closes [#22](https://github.com/aurelia/validation/issues/22))
  * NPM package did not have index.js ([a5ad3dd9](https://github.com/aurelia/validation/commit/a5ad3dd91b08ea6b64fcdc074fc6b7ab7ad5fc63), closes [#22](https://github.com/aurelia/validation/issues/22))
* **timing:** Promises that finish late are not supported correctly ([d32dd93f](https://github.com/aurelia/validation/commit/d32dd93f6c5c0565f0a171f73f70da05cb739913), closes [#27](https://github.com/aurelia/validation/issues/27))
* **trim:** values are no longer trimmed before validation ([e567cb8e](https://github.com/aurelia/validation/commit/e567cb8e450fe56a8d1e98fa48ec3d940c052507), closes [#32](https://github.com/aurelia/validation/issues/32))


#### Features

* **async:** validation is now running promises ([5e713096](https://github.com/aurelia/validation/commit/5e713096ca75a330521d2d1f2c09374f3e190068), closes [#3](https://github.com/aurelia/validation/issues/3))
* **config:** Allow runtime configuration ([8c9fefaf](https://github.com/aurelia/validation/commit/8c9fefaf51395fb180aa9575456a335bc69ace6c), closes [#8](https://github.com/aurelia/validation/issues/8), [#21](https://github.com/aurelia/validation/issues/21), [#34](https://github.com/aurelia/validation/issues/34))
* **debouncer:** debouncer blocks continuously changing values ([fb577d0c](https://github.com/aurelia/validation/commit/fb577d0c1acbfafd2ce835c598c5137e8a694850))
* **isValidating:** isValidating is true while validating ([d5cd18c0](https://github.com/aurelia/validation/commit/d5cd18c0601d1246ac1af9cf274db160ebdd26ba))
* **onValidate:** callback for async validation on the entire subject ([1f828849](https://github.com/aurelia/validation/commit/1f828849ed13e31088b3c5e88254bacc51153d19), closes [#25](https://github.com/aurelia/validation/issues/25))
* **validateAttachedBehavior:** show 'success' for properties with no validation rules ([8c53d77f](https://github.com/aurelia/validation/commit/8c53d77f9d10d1abc0f53898dce13ba0d216dda7), closes [#17](https://github.com/aurelia/validation/issues/17))
* **viewStrategy:** Allows different view strategy to be plugged ([938ac37f](https://github.com/aurelia/validation/commit/938ac37f12b23db2f72e820ef3405fec63ee8c68), closes [#6](https://github.com/aurelia/validation/issues/6))


### 0.1.2 (2015-03-26)


#### Bug Fixes

* **isEmail:** add a better isEmail validation ([9e45f82d](https://github.com/aurelia/validation/commit/9e45f82db028c71a88a5d75c4fdf678c5474e7a3))


#### Features

* **validateAttachedBehavior:** show 'success' for properties with no validation rules ([8c53d77f](https://github.com/aurelia/validation/commit/8c53d77f9d10d1abc0f53898dce13ba0d216dda7), closes [#17](https://github.com/aurelia/validation/issues/17))


### 0.1.1 (2015-03-24)

