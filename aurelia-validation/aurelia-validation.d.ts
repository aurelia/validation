declare module 'aurelia-validation' {
  export const validationMetadataKey: any;
  export class ValidationEngine {
    static getValidationReporter(instance: any): any;
  }
  export class ValidationError {
    message: any;
    object: any;
    propertyName: any;
    value: any;
  }
  export class ValidationReporter {
    add(object: any): any;
    remove(object: any): any;
    subscribe(callback: any): any;
    publish(errors: any): any;
    destroyObserver(observer: any): any;
  }
  export class Validator {
    validate(object: any, prop: any): any;
    getProperties(): any;
  }
}