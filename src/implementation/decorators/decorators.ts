import { PropertyCustomizations } from './property-customizations';
import { ValidationRules, FluentRuleCustomizer, FluentRules } from '../validation-rules';
import { Rule } from '../rule';
import { Rules } from '../rules';

export function required(arg1?: string | ((object: object) => boolean), arg2?: (object: object) => boolean) {
  return (targetClass: object, name: string) => {
    const fluentRules = ValidationRules.ensure(name);
    const requiredApplied = fluentRules.required();
    addDisplayNameToProp(targetClass, name, fluentRules);
    addTagToProp(targetClass, name, requiredApplied);
    let newRules = requiredApplied.rules;

    if (typeof(arg1) === 'string') {
      newRules = addCustomMessage(requiredApplied, arg1).rules;
    } else if (arg1) {
      requiredApplied.when(arg1 as (object: object) => boolean);
    }

    if (arg2) {
      requiredApplied.when(arg2 as (object: object) => boolean);
    }

    mergeRules(targetClass, newRules, name);
  };
}

export function satisfiesRule(
  arg1: string,
  arg2?: string | ((object: object) => boolean),
  arg3?: (object: object) => boolean
) {
  return (targetClass: object, name: string) => {
    const fluentRules = ValidationRules.ensure(name);
    const satisfiesRuleApplied = fluentRules.satisfiesRule(arg1);
    addDisplayNameToProp(targetClass, name, fluentRules);
    addTagToProp(targetClass, name, satisfiesRuleApplied);
    let newRules = satisfiesRuleApplied.rules;

    if (typeof(arg2) === 'string') {
      newRules = addCustomMessage(satisfiesRuleApplied, arg2).rules;
    } else if (arg2) {
      newRules = satisfiesRuleApplied.when(arg2 as (object: object) => boolean).rules;
    }

    if (arg3) {
      newRules = satisfiesRuleApplied.when(arg3 as (object: object) => boolean).rules;
    }

    mergeRules(targetClass, newRules, name);
  };
}

export function satisfies(
  arg1: (value: any, object: object) => boolean | Promise<boolean>,
  arg2?: string | ((object: object) => boolean),
  arg3?: (object: object) => boolean
) {
  return (targetClass: object, name: string) => {
    const fluentRules = ValidationRules.ensure(name);
    const satisfiesApplied = fluentRules.satisfies(arg1);
    addDisplayNameToProp(targetClass, name, fluentRules);
    addTagToProp(targetClass, name, satisfiesApplied);
    let newRules = satisfiesApplied.rules;

    if (typeof(arg2) === 'string') {
      newRules = addCustomMessage(satisfiesApplied, arg2).rules;
    } else if (arg2) {
      newRules = satisfiesApplied.when(arg2 as (object: object) => boolean).rules;
    }

    if (arg3) {
      newRules = satisfiesApplied.when(arg3 as (object: object) => boolean).rules;
    }

    mergeRules(targetClass, newRules, name);
  };
}

export function email(arg1?: string | ((object: object) => boolean), arg2?: (object: object) => boolean) {
  return (targetClass: object, name: string) => {
    const fluentRules = ValidationRules.ensure(name);
    const emailRuleApplied = fluentRules.email();
    addDisplayNameToProp(targetClass, name, fluentRules);
    addTagToProp(targetClass, name, emailRuleApplied);
    let newRules = emailRuleApplied.rules;

    if (typeof(arg1) === 'string') {
      newRules = addCustomMessage(emailRuleApplied, arg1).rules;
    } else if (arg1) {
      newRules = emailRuleApplied.when(arg1 as (object: object) => boolean).rules;
    }

    if (arg2) {
      newRules = emailRuleApplied.when(arg2 as (object: object) => boolean).rules;
    }

    mergeRules(targetClass, newRules, name);
  };
}

export function matches(
  arg1: RegExp,
  arg2?: string | ((object: object) => boolean),
  arg3?: (object: object) => boolean
) {
  return (targetClass: object, name: string) => {
    const fluentRules = ValidationRules.ensure(name);
    const matchesRuleApplied = fluentRules.matches(arg1);
    addDisplayNameToProp(targetClass, name, fluentRules);
    addTagToProp(targetClass, name, matchesRuleApplied);
    let newRules = matchesRuleApplied.rules;

    if (typeof(arg2) === 'string') {
      newRules = addCustomMessage(matchesRuleApplied, arg2).rules;
    } else if (arg2) {
      newRules = matchesRuleApplied.when(arg2 as (object: object) => boolean).rules;
    }

    if (arg3) {
      newRules = matchesRuleApplied.when(arg3 as (object: object) => boolean).rules;
    }

    mergeRules(targetClass, newRules, name);
  };
}

export function minLength(
  arg1: number,
  arg2?: string | ((object: object) => boolean),
  arg3?: (object: object) => boolean
) {
  return (targetClass: object, name: string) => {
    const fluentRules = ValidationRules.ensure(name);
    const minLengthApplied = fluentRules.minLength(arg1);
    addDisplayNameToProp(targetClass, name, fluentRules);
    addTagToProp(targetClass, name, minLengthApplied);
    let newRules = minLengthApplied.rules;

    if (typeof(arg2) === 'string') {
      newRules = addCustomMessage(minLengthApplied, arg2).rules;
    } else if (arg2) {
      newRules = minLengthApplied.when(arg2 as (object: object) => boolean).rules;
    }

    if (arg3) {
      newRules = minLengthApplied.when(arg3 as (object: object) => boolean).rules;
    }

    mergeRules(targetClass, newRules, name);
  };
}

export function maxLength(
  arg1: number,
  arg2?: string | ((object: object) => boolean),
  arg3?: (object: object) => boolean
) {
  return (targetClass: object, name: string) => {
    const fluentRules = ValidationRules.ensure(name);
    const maxLengthApplied = fluentRules.maxLength(arg1);
    addDisplayNameToProp(targetClass, name, fluentRules);
    addTagToProp(targetClass, name, maxLengthApplied);
    let newRules = maxLengthApplied.rules;

    if (typeof(arg2) === 'string') {
      newRules = addCustomMessage(maxLengthApplied, arg2).rules;
    } else if (arg2) {
      newRules = maxLengthApplied.when(arg2 as (object: object) => boolean).rules;
    }

    if (arg3) {
      newRules = maxLengthApplied.when(arg3 as (object: object) => boolean).rules;
    }

    mergeRules(targetClass, newRules, name);
  };
}

export function minItems(
  arg1: number,
  arg2?: string | ((object: object) => boolean),
  arg3?: (object: object) => boolean
) {
  return (targetClass: object, name: string) => {
    const fluentRules = ValidationRules.ensure(name);
    const minItemsApplied = fluentRules.minItems(arg1);
    addDisplayNameToProp(targetClass, name, fluentRules);
    addTagToProp(targetClass, name, minItemsApplied);
    let newRules = minItemsApplied.rules;

    if (typeof(arg2) === 'string') {
      newRules = addCustomMessage(minItemsApplied, arg2).rules;
    } else if (arg2) {
      newRules = minItemsApplied.when(arg2 as (object: object) => boolean).rules;
    }

    if (arg3) {
      newRules = minItemsApplied.when(arg3 as (object: object) => boolean).rules;
    }

    mergeRules(targetClass, newRules, name);
  };
}

export function maxItems(
  arg1: number,
  arg2?: string | ((object: object) => boolean),
  arg3?: (object: object) => boolean
) {
  return (targetClass: object, name: string) => {
    const fluentRules = ValidationRules.ensure(name);
    const maxItemsApplied = fluentRules.maxItems(arg1);
    addDisplayNameToProp(targetClass, name, fluentRules);
    addTagToProp(targetClass, name, maxItemsApplied);
    let newRules = maxItemsApplied.rules;

    if (typeof(arg2) === 'string') {
      newRules = addCustomMessage(maxItemsApplied, arg2).rules;
    } else if (arg2) {
      newRules = maxItemsApplied.when(arg2 as (object: object) => boolean).rules;
    }

    if (arg3) {
      newRules = maxItemsApplied.when(arg3 as (object: object) => boolean).rules;
    }

    mergeRules(targetClass, newRules, name);
  };
}

export function min(
  arg1: number,
  arg2?: string | ((object: object) => boolean),
  arg3?: (object: object) => boolean
) {
  return (targetClass: object, name: string) => {
    const fluentRules = ValidationRules.ensure(name);
    const minApplied = fluentRules.min(arg1);
    addDisplayNameToProp(targetClass, name, fluentRules);
    addTagToProp(targetClass, name, minApplied);
    let newRules = minApplied.rules;

    if (typeof(arg2) === 'string') {
      newRules = addCustomMessage(minApplied, arg2).rules;
    } else if (arg2) {
      newRules = minApplied.when(arg2 as (object: object) => boolean).rules;
    }

    if (arg3) {
      newRules = minApplied.when(arg3 as (object: object) => boolean).rules;
    }

    mergeRules(targetClass, newRules, name);
  };
}

export function max(
  arg1: number,
  arg2?: string | ((object: object) => boolean),
  arg3?: (object: object) => boolean
) {
  return (targetClass: object, name: string) => {
    const fluentRules = ValidationRules.ensure(name);
    const maxApplied = fluentRules.max(arg1);
    addDisplayNameToProp(targetClass, name, fluentRules);
    addTagToProp(targetClass, name, maxApplied);
    let newRules = maxApplied.rules;

    if (typeof(arg2) === 'string') {
      newRules = addCustomMessage(maxApplied, arg2).rules;
    } else if (arg2) {
      newRules = maxApplied.when(arg2 as (object: object) => boolean).rules;
    }

    if (arg3) {
      newRules = maxApplied.when(arg3 as (object: object) => boolean).rules;
    }

    mergeRules(targetClass, newRules, name);
  };
}

export function range(
  arg1: number,
  arg2: number,
  arg3?: string | ((object: object) => boolean),
  arg4?: (object: object) => boolean
) {
  return (targetClass: object, name: string) => {
    const fluentRules = ValidationRules.ensure(name);
    const rangeApplied = fluentRules.range(arg1, arg2);
    addDisplayNameToProp(targetClass, name, fluentRules);
    addTagToProp(targetClass, name, rangeApplied);
    let newRules = rangeApplied.rules;

    if (typeof(arg3) === 'string') {
      newRules = addCustomMessage(rangeApplied, arg3).rules;
    } else if (arg3) {
      newRules = rangeApplied.when(arg3 as (object: object) => boolean).rules;
    }

    if (arg4) {
      newRules = rangeApplied.when(arg4 as (object: object) => boolean).rules;
    }

    mergeRules(targetClass, newRules, name);
  };
}

export function between(
  arg1: number,
  arg2: number,
  arg3?: string | ((object: object) => boolean),
  arg4?: (object: object) => boolean
) {
  return (targetClass: object, name: string) => {
    const fluentRules = ValidationRules.ensure(name);
    const betweenApplied = fluentRules.between(arg1, arg2);
    addDisplayNameToProp(targetClass, name, fluentRules);
    addTagToProp(targetClass, name, betweenApplied);
    let newRules = betweenApplied.rules;

    if (typeof(arg3) === 'string') {
      newRules = addCustomMessage(betweenApplied, arg3).rules;
    } else if (arg3) {
      newRules = betweenApplied.when(arg3 as (object: object) => boolean).rules;
    }

    if (arg4) {
      newRules = betweenApplied.when(arg4 as (object: object) => boolean).rules;
    }

    mergeRules(targetClass, newRules, name);
  };
}

export function equals(arg1: any, arg2?: string | ((object: object) => boolean), arg3?: (object: object) => boolean) {
  return (targetClass: object, name: string) => {
    const fluentRules = ValidationRules.ensure(name);
    const equalsApplied = fluentRules.equals(arg1);
    addDisplayNameToProp(targetClass, name, fluentRules);
    addTagToProp(targetClass, name, equalsApplied);
    let newRules = equalsApplied.rules;

    if (typeof(arg2) === 'string') {
      newRules = addCustomMessage(equalsApplied, arg2).rules;
    } else if (arg2) {
      newRules = equalsApplied.when(arg2 as (object: object) => boolean).rules;
    }

    if (arg3) {
      newRules = equalsApplied.when(arg3 as (object: object) => boolean).rules;
    }

    mergeRules(targetClass, newRules, name);
  };
}

export function displayName(customName: string) {
  return (targetClass: object, name: string) => {
    const currentRules = Rules.get(targetClass) || [];
    if (currentRules.length) {
      currentRules.forEach(r => r.filter(rl => rl.property.name === name)
      .forEach(rl => rl.property.displayName = customName));
    }

    const currentPropertyCustomizations = PropertyCustomizations.get(targetClass) || [];
    if (currentPropertyCustomizations.length) {
      currentPropertyCustomizations.push({name, displayName: customName});
    } else {
      PropertyCustomizations.set(targetClass.constructor, [{name, displayName: customName}]);
    }
  };
}

export function tag(tag: string) {
  return (targetClass: object, name: string) => {
    const currentRules = Rules.get(targetClass) || [];
    if (currentRules.length) {
      currentRules.forEach(r => r.filter(rl => rl.property.name === name).forEach(rl => rl.tag = tag));
    }

    const currentPropertyCustomizations = PropertyCustomizations.get(targetClass) || [];
    if (currentPropertyCustomizations.length) {
      currentPropertyCustomizations.push({name, tag});
    } else {
      PropertyCustomizations.set(targetClass.constructor, [{name, tag}]);
    }
  };
}

function addCustomMessage(
  fluentRules: FluentRuleCustomizer<object, any>,
  customMessage: string
): FluentRuleCustomizer<object, any> {
  if (!!customMessage) {
    fluentRules.withMessage(customMessage);
  }
  return fluentRules;
}

function mergeRules(targetClass: object, newRules: Rule<{}, any>[][], porpertyName: string) {
  let currentRules = Rules.get(targetClass) || [];

  if (currentRules.length) {
    const rulesOfCurrentPropertyIndex = currentRules.findIndex(r => r.some(rl => rl.property.name === porpertyName));

    if (rulesOfCurrentPropertyIndex >= 0) {
      let lastRuleSequence = currentRules[rulesOfCurrentPropertyIndex].reduce((a, b) => {
        if (a.sequence >= b.sequence) {
          return a;
        }
        return b;
      }, {sequence: 0}).sequence;
      newRules[0].forEach(nr => {
        lastRuleSequence++;
        nr.sequence = lastRuleSequence;
        currentRules[rulesOfCurrentPropertyIndex].push(nr);
      });
    } else {
      currentRules.push(newRules[0]);
    }
  } else {
    currentRules = newRules;
  }

  Rules.set(targetClass.constructor, currentRules);
}

function addTagToProp(
  targetClass: object,
  propName: string,
  fluentRules: FluentRuleCustomizer<object, any>
): FluentRuleCustomizer<object, any> {
  const propCustomizations = PropertyCustomizations.get(targetClass) || [];
  const currentPropCustomization = propCustomizations.find(d => d.name === propName);

  if (currentPropCustomization && currentPropCustomization.displayName) {
    return fluentRules.tag(currentPropCustomization.displayName);
  }
  return fluentRules;
}

function addDisplayNameToProp(
  targetClass: object,
  propName: string,
  fluentRules: FluentRules<object, any>
): FluentRules<object, any> {
  const propCustomizations = PropertyCustomizations.get(targetClass) || [];
  const currentPropCustomization = propCustomizations.find(d => d.name === propName);

  if (currentPropCustomization && currentPropCustomization.displayName) {
    return fluentRules.displayName(currentPropCustomization.displayName);
  }
  return fluentRules;
}
