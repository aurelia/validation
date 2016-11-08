import { Rule } from './rule';
/**
 * Sets, unsets and retrieves rules on an object or constructor function.
 */
export declare class Rules {
    /**
     * The name of the property that stores the rules.
     */
    private static key;
    /**
     * Applies the rules to a target.
     */
    static set(target: any, rules: Rule<any, any>[][]): void;
    /**
     * Removes rules from a target.
     */
    static unset(target: any): void;
    /**
     * Retrieves the target's rules.
     */
    static get(target: any): Rule<any, any>[][] | null;
}
