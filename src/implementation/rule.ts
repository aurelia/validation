import {Expression} from 'aurelia-binding';

export interface RuleProperty {
  name: string;
  displayName: string|null;
}

export interface ValidateWhen<TObject> {
  (object: TObject): boolean;
}

export interface Condition<TObject, TValue> {
  (value: TValue, object?: TObject): boolean|Promise<boolean>;
}

export interface Rule<TObject, TValue> {
  property: RuleProperty;
  condition: Condition<TObject, TValue>;
  config: Object;
  when: ValidateWhen<TObject>|null;
  messageKey: string;
  message: Expression|null;
}
