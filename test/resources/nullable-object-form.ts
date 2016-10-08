import {inject, NewInstance} from 'aurelia-dependency-injection';
import {inlineView} from 'aurelia-templating';
import {
  ValidationRules,
  ValidationController
} from '../../src/aurelia-validation';

@inlineView(`
<template>
  <form novalidate autocomplete="off">
    <input ref="input" type="text" value.bind="obj.prop & validate:rules">
  </form>
</template>`)
@inject(NewInstance.of(ValidationController))
export class NullableObjectForm {
  input: HTMLInputElement;
  
  _obj: any = { prop: '' };

  get obj() {
    return this._obj;
  }
  set obj(value) {
    // setter is required due to https://github.com/aurelia/binding/issues/205
    console.log(value);
  }

  rules = <any>ValidationRules.ensure('prop').required().rules;

  constructor(public controller: ValidationController) {}
}
