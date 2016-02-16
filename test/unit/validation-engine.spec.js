import {ValidationEngine} from 'src/validation-engine';
import {ValidationReporter} from 'src/validation-reporter';
import {Container} from 'aurelia-dependency-injection';

describe('ValidationEngine', () => {
  let container;
  let validationEngine;

  beforeEach(() => {
    container = new Container();
  });

  describe('.getValidationReporter', () => {
    it('returns a new validation reporter when none exists', () => {
      let result = ValidationEngine.getValidationReporter({});
      expect(result).toEqual(new ValidationReporter());
    });

    it('returns an existing reporter if present', () => {
      let vrInstance = new ValidationReporter();
      vrInstance.uniqueId = 1;
      let mockInstance = { __validationReporter__: vrInstance };
      let result = ValidationEngine.getValidationReporter(mockInstance);
      expect(result).toEqual(vrInstance);
    })
  });
});
