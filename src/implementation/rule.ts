import {Expression} from 'aurelia-binding';

export interface RuleProperty {
  /**
   * The property name. null indicates the rule targets the object itself.
   */
  name: string|null;

  /**
   * The displayName of the property (or object).
   */
  displayName: string|null;
}

export interface Rule<TObject, TValue> {
  property: RuleProperty;
  condition: (value: TValue, object?: TObject) => boolean|Promise<boolean>;
  config: Object;
  when: { (object: TObject): boolean }|null;
  messageKey: string;
  message: Expression|null;
}
