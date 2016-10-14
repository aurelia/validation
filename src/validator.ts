import { ValidationError } from './validation-error';

/**
 * Validates.
 * Responsible for validating objects and properties.
 */
export abstract class Validator {
  /**
   * Validates the specified property.
   * @param object The object to validate.
   * @param propertyName The name of the property to validate.
   * @param rules Optional. If unspecified, the implementation should lookup the rules for the 
   * specified object. This may not be possible for all implementations of this interface.
   */
  public abstract validateProperty(object: any, propertyName: string, rules?: any): Promise<ValidationError[]>;

  /**
   * Validates all rules for specified object and it's properties.
   * @param object The object to validate.
   * @param rules Optional. If unspecified, the implementation should lookup the rules for the 
   * specified object. This may not be possible for all implementations of this interface.
   */
  public abstract validateObject(object: any, rules?: any): Promise<ValidationError[]>;

  /**
   * Determines whether a rule exists in a set of rules.
   * @param rules The rules to search.
   * @parem rule The rule to find.
   */
  public abstract ruleExists(rules: any, rule: any): boolean;
}
