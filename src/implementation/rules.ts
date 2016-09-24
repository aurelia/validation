import {Rule} from './rule';

/**
 * Sets, unsets and retrieves rules on an object or constructor function.
 */
export class Rules {
  /**
   * The name of the property that stores the rules.
   */
  static key = '__rules__';

  /**
   * Applies the rules to a target.
   */
  static set(target: any, rules: Rule<any, any>[][]): void {
    if (target instanceof Function) {
      target = target.prototype;
    }
    Object.defineProperty(
      target,
      Rules.key,
      { enumerable: false, configurable: false, writable: true, value: rules });
  }

  /**
   * Removes rules from a target.
   */
  static unset(target: any): void {
    if (target instanceof Function) {
      target = target.prototype;
    }    
    target[Rules.key] = null;
  }

  /**
   * Retrieves the target's rules.
   */
  static get(target: any): Rule<any, any>[][]|null {
    return target[Rules.key] || null;
  }
}
