import {ValidationError} from './validation-error';

export abstract class Validator {
  abstract validateProperty(object: any, propertyName: string, rules?: any): Promise<ValidationError[]>;
  abstract validateObject(object: any, rules?: any): Promise<ValidationError[]>;
}
