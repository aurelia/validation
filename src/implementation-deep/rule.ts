import {Expression} from 'aurelia-binding';

export interface Subject {
  model: Expression;
  object: Expression;
  value: Expression;
  propertyName: string;
  displayName: string|null;
}

export interface WhenFunction<TModel> {
  (model: TModel): boolean;
}

export interface Condition<TModel, TValue> {
  (value: TValue, model?: TModel): boolean|Promise<boolean>;
}

export interface Rule {
  subject: Subject;
  condition: Condition<any, any>;
  config: Object;
  when: WhenFunction<any>|null;
  messageKey: string;
  message: Expression|null;
}
