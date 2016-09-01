import {DOM} from 'aurelia-pal';
import {inject} from 'aurelia-dependency-injection'
import {customAttribute, customElement, bindable, inlineView} from 'aurelia-templating';
import {bindingMode} from 'aurelia-binding';

export abstract class NumberBase {
  public abstract value: number|null;
  protected _input: HTMLInputElement;

  constructor(protected input: HTMLInputElement) {}

  valueChanged(newValue: number|null) {
    this.input.value = newValue === null ? '' : newValue.toString(10);
  }

  inputValueChanged = () => {
    this.value = this.input.value === '' ? null : parseInt(this.input.value);
  };

  bind() {
    this._input = this.input;
    this._input.addEventListener('change', this.inputValueChanged);
  }

  unbind() {
    this._input.removeEventListener('change', this.inputValueChanged);
    this._input = <any>null;
  }
}

@customAttribute('number-value', bindingMode.twoWay)
@inject(Element)
export class NumberValueCustomAttribute extends NumberBase {
  public value: number|null;
}

@customElement('number-input')
@inject(Element)
@inlineView(`<template><input ref="input"></template>`)
export class NumberInputCustomElement extends NumberBase {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) value: number|null;

  constructor(private element: Element) {
    super(<any>null);
    (<any>this.element).focus = () => this.input.focus();
  }

  inputBlurred = () => {
    this.element.dispatchEvent(DOM.createCustomEvent('blur', {}));
  };

  bind() {
    super.bind();
    this._input.addEventListener('blur', this.inputBlurred);    
  }

  unbind() {
    this._input.removeEventListener('blur', this.inputBlurred);
    super.unbind();
  }
}
