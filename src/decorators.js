import {metadata} from 'aurelia-metadata';

export class ValidationMetadata {
  static metadataKey = 'aurelia:validation';
  constructor() {
    this.properties = [];
  }
  getOrCreateProperty(propertyName) {
    let property = this.properties.find(x => x.propertyName === propertyName);
    if (property === undefined) {
      property = new ValidationPropertyMetadata(propertyName);
      this.properties.push(property);
    }
    return property;
  }
  setup(validation) {
    this.properties.forEach( (property) => {
      property.setup(validation);
    });
  }
}
class ValidationPropertyMetadata {
  constructor(propertyName) {
    this.propertyName = propertyName;
    this.setupSteps = [];
  }
  addSetupStep(setupStep) {
    this.setupSteps.push(setupStep);
  }
  setup(validation) {
    validation.ensure(this.propertyName);
    this.setupSteps.forEach((setupStep) => {
      setupStep(validation);
    });
  }
}

export function ensure(setupStep: (it: ValidationGroup) => void) {
  console.warn('The ensure decorator has been deprecated and will be removed in the next release.');
  return function(target, propertyName) {
    let validationMetadata = metadata.getOrCreateOwn(ValidationMetadata.metadataKey, ValidationMetadata, target);
    let property = validationMetadata.getOrCreateProperty(propertyName);
    property.addSetupStep(setupStep);
  };
}
