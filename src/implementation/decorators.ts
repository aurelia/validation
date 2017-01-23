import { Rule, Rules, ValidationRules, FluentRuleCustomizer } from "../aurelia-validation";

export type RuleCustomizer = ((c: FluentRuleCustomizer<any, any>) => FluentRuleCustomizer<any, any>) | null;
export type SatisfiesRule = (value: any, object?: any) => boolean | Promise<boolean>;

export function addRules(target: any, rules: Rule<any, any>[]) {
    var existingRules = Rules.get(target) || [];
    Rules.set(target, existingRules.concat(rules));
}

export function applyCustomizer(propertyRule: FluentRuleCustomizer<any, any>, customizer: RuleCustomizer = null) {
    return typeof customizer === "function" ? customizer(propertyRule) : propertyRule;
}

export function satisfies(rule: SatisfiesRule, customizer: RuleCustomizer = null): Function {
    return function (target: any, propertyKey: string) {
        var isClassLevel = typeof target == 'function';
        var inspectedObj = isClassLevel ? ValidationRules.ensureObject() : ValidationRules.ensure(propertyKey);
        var targetRule = inspectedObj.satisfies(rule);
        addRules(isClassLevel? target.prototype : target, applyCustomizer(targetRule, customizer).rules);
    }
}

export function satisfiesRule(ruleName: string, customizer: RuleCustomizer = null): Function {
    return function (target: any, propertyKey: string) {
        var isClassLevel = typeof target == 'function';
        var inspectedObj = isClassLevel ? ValidationRules.ensureObject() : ValidationRules.ensure<any, any>(propertyKey);
        var targetRule = inspectedObj.satisfiesRule(ruleName);
        addRules(isClassLevel? target.prototype : target, applyCustomizer(targetRule, customizer).rules);
    }
}

export function required(customizer: RuleCustomizer = null): PropertyDecorator {
    return function (target: Object, propertyKey: string) {
        var propertyRule = ValidationRules.ensure(propertyKey).required();
        addRules(target, applyCustomizer(propertyRule, customizer).rules);
    };
}

export function matches(regex: RegExp, customizer: RuleCustomizer = null): PropertyDecorator {
    return function (target: Object, propertyKey: string) {
        var propertyRule = ValidationRules.ensure(propertyKey).matches(regex);
        addRules(target, applyCustomizer(propertyRule, customizer).rules);
    };
}

export function minLength(length: number, customizer: RuleCustomizer = null): PropertyDecorator {
    return function (target: Object, propertyKey: string) {
        var propertyRule = ValidationRules.ensure(propertyKey).minLength(length);
        addRules(target, applyCustomizer(propertyRule, customizer).rules);
    }
}
export function maxLength(length: number, customizer: RuleCustomizer = null): PropertyDecorator {
    return function (target: Object, propertyKey: string) {
        var propertyRule = ValidationRules.ensure(propertyKey).maxLength(length);
        addRules(target, applyCustomizer(propertyRule, customizer).rules);
    }
}

export function minItems(count: number, customizer: RuleCustomizer = null): PropertyDecorator {
    return function (target: Object, propertyKey: string) {
        var propertyRule = ValidationRules.ensure(propertyKey).minItems(count);
        addRules(target, applyCustomizer(propertyRule, customizer).rules);
    }
}

export function maxItems(count: number, customizer: RuleCustomizer = null): PropertyDecorator {
    return function (target: Object, propertyKey: string) {
        var propertyRule = ValidationRules.ensure(propertyKey).maxItems(count);
        addRules(target, applyCustomizer(propertyRule, customizer).rules);
    }
}

export function numeric(customizer: RuleCustomizer = null): PropertyDecorator {
    return function (target: Object, propertyKey: string) {
        var propertyRule = ValidationRules.ensure(propertyKey).satisfies((value: any) => !isNaN(parseFloat(value)) && isFinite(value));
        addRules(target, applyCustomizer(propertyRule, customizer).rules);
    }
}

export function email(customizer: RuleCustomizer = null): PropertyDecorator {
    return function (target: Object, propertyKey: string) {
        var propertyRule = ValidationRules.ensure(propertyKey).email();
        addRules(target, applyCustomizer(propertyRule, customizer).rules);
    }
}

export function equals(value: any, customizer: RuleCustomizer = null): PropertyDecorator {
    return function (target: Object, propertyKey: string) {
        var propertyRule = ValidationRules.ensure(propertyKey).equals(value);
        addRules(target, applyCustomizer(propertyRule, customizer).rules);
    }
}

export function url(customizer: RuleCustomizer = null): PropertyDecorator {
    return function (target: any, propertyKey: string) {
        var propertyRule = ValidationRules.ensure(propertyKey).matches(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
        addRules(target, applyCustomizer(propertyRule, customizer).rules);
    }
}
