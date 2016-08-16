import {metadata} from 'aurelia-metadata';
import {Validator} from '../validator';
import {ValidationError} from '../validation-error';
import {Rule} from './rule';
import {metadataKey} from './metadata-key';

export class ValidatorImplementation extends Validator {
  private validate(object: any, propertyName: string|null, rules: Rule[]|null): Promise<ValidationError[]> {
    const errors = [];
    if (!rules) {
      rules = <Rule[]>metadata.get(metadataKey, object);
    }
    if (!rules) {
      // no rules defined for the object.
      return Promise.resolve(errors);
    }
    
    for (let i = 0, ii = rules.length; i < ii; i++) {
      const rule = rules[i];
      
      if (propertyName !== null && (
        rule.subject.propertyName !== propertyName
        || rule.subject.object
      )) {
        continue;
      }
      // const { name, config } = ruleInfo.rule;
      // const validator = { [propertyName]: { [name]: config } };
      // const result = validate(object, validator);
      // if (result) {
      //   errors.push(new ValidationError(ruleInfo.rule, result[propertyName][0], object, propertyName));
      // }
    }
    return errors;
  }

  validateProperty(object: any, propertyName: string, rules?: any): Promise<ValidationError[]> {
    return this.validate(object, propertyName, rules || null);
  }

  validateObject(object: any, rules?: any): Promise<ValidationError[]> {
    return this.validate(object, null, rules || null);
  }  
}
