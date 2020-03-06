import { inlineView, bindable } from 'aurelia-templating';

@inlineView(`<template><input value.bind="value"></input></template>`)
export class CustomInput {
  @bindable public value: any;
}
