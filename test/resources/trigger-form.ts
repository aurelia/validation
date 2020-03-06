import { inject, NewInstance } from 'aurelia-dependency-injection';
import { inlineView } from 'aurelia-templating';
import {
  ValidationRules,
  ValidationController
} from '../../src/aurelia-validation';

@inlineView(`
<template>
  <form novalidate autocomplete="off" if.bind="showForm">
    <input ref="standardInput"          type="text" value.bind="standardProp & validate">
    <input ref="blurInput"              type="text" value.bind="blurProp & validateOnBlur">
    <input ref="focusoutInput"          type="text" value.bind="focusoutProp & validateOnFocusout">
    <input ref="changeInput"            type="text" value.bind="changeProp & validateOnChange">
    <input ref="changeOrBlurInput"      type="text" value.bind="changeOrBlurProp & validateOnChangeOrBlur">
    <input ref="changeOrFocusoutInput"  type="text" value.bind="changeOrFocusoutProp & validateOnChangeOrFocusout">
    <input ref="manualInput"            type="text" value.bind="manualProp & validateManually">
    <custom-input ref="focusoutCE"           type="text" value.two-way="focusoutCustomProp & validateOnFocusout"></custom-input>
    <custom-input ref="changeOrFocusoutCE"   type="text" value.two-way="changeOrFocusoutCustomProp & validateOnChangeOrFocusout"></custom-input>
    </form>
</template>`)
@inject(NewInstance.of(ValidationController))
export class TriggerForm {
  public standardInput: HTMLInputElement;
  public blurInput: HTMLInputElement;
  public focusoutInput: HTMLInputElement;
  public changeInput: HTMLInputElement;
  public changeOrBlurInput: HTMLInputElement;
  public changeOrFocusoutInput: HTMLInputElement;
  public manualInput: HTMLInputElement;
  public focusoutCE: HTMLElement;
  public changeOrFocusoutCE: HTMLElement;

  private $focusoutCustomInput: HTMLInputElement;
  private $changeOrFocusoutCustomInput: HTMLInputElement;
  public get focusoutCustomInput(): HTMLInputElement {
    return this.$focusoutCustomInput || (this.$focusoutCustomInput = this.focusoutCE.querySelector('input')!);
  }
  public get changeOrFocusoutCustomInput(): HTMLInputElement {
    return this.$changeOrFocusoutCustomInput
      || (this.$changeOrFocusoutCustomInput = this.changeOrFocusoutCE.querySelector('input')!);
  }

  public standardProp = '';
  public blurProp = '';
  public focusoutProp = '';
  public changeProp = '';
  public changeOrBlurProp = '';
  public changeOrFocusoutProp = '';
  public manualProp = '';
  public focusoutCustomProp = '';
  public changeOrFocusoutCustomProp = '';
  public showForm = true;

  constructor(public controller: ValidationController) { }
}

ValidationRules
  .ensure((f: TriggerForm) => f.standardProp).required()
  .ensure(f => f.blurProp).required()
  .ensure(f => f.focusoutProp).required()
  .ensure(f => f.focusoutCustomProp).required()
  .ensure(f => f.changeProp).required()
  .ensure(f => f.changeOrBlurProp).required().matches(/foo/)
  .ensure(f => f.changeOrFocusoutProp).required().matches(/foo/)
  .ensure(f => f.changeOrFocusoutCustomProp).required().matches(/foo/)
  .ensure(f => f.manualProp).required()
  .on(TriggerForm);
