import { Expression } from 'aurelia-binding';

/**
 * Information related to a property that is the subject of validation.
 */
export interface RuleProperty {
  /**
   * The property name. null indicates the rule targets the object itself.
   */
  name: string | null;

  /**
   * The displayName of the property (or object).
   */
  displayName: string | null;
}

/**
 * A rule definition. Associations a rule with a property or object.
 */
export interface Rule<TObject, TValue> {
  property: RuleProperty;
  condition: ((value: TValue, object?: TObject) => boolean | Promise<boolean>) | null;
  config: Object;
  when: ((object: TObject) => boolean) | null;
  messageKey: string;
  message: Expression | null;
  sequence: number;
  tag?: string;
  tags?: Array<string>; // set when the rule does no more than reference other rules
}
