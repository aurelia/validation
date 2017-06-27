/**
 * Sets, unsets and retrieves rules on an object or constructor function.
 */
export class Rules {
    /**
     * Applies the rules to a target.
     */
    static set(target, rules) {
        if (target instanceof Function) {
            target = target.prototype;
        }
        Object.defineProperty(target, Rules.key, { enumerable: false, configurable: false, writable: true, value: rules });
    }
    /**
     * Removes rules from a target.
     */
    static unset(target) {
        if (target instanceof Function) {
            target = target.prototype;
        }
        target[Rules.key] = null;
    }
    /**
     * Retrieves the target's rules.
     */
    static get(target) {
        return target[Rules.key] || null;
    }
}
/**
 * The name of the property that stores the rules.
 */
Rules.key = '__rules__';
