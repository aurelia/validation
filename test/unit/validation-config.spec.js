import {ValidationConfig} from 'src/validation-config';
import {ValidationReporterStub} from '../fixtures/validation-reporter-stub';
import {validationMetadataKey} from 'src/metadata-key';
import {PASSING_RULE, FAILING_RULE} from '../fixtures/rules';
import {metadata} from 'aurelia-metadata';

describe('ValidationConfig', () => {
  let config;
  let target;
  let validationReporterStub;

  beforeEach(() => {
    target = { name: 'Testing' };
    validationReporterStub = new ValidationReporterStub();
    config = metadata.getOrCreateOwn(validationMetadataKey, ValidationConfig, target);
  });

  describe('.validate', () => {
    it('returns empty array if no rules exist', () => {
      let result = config.validate(config, 'name', 0, 1, validationReporterStub);
      expect(result).toEqual([]);
    });

    it('returns empty array if no rules are invalid', () => {
      config.addRule('name', new PASSING_RULE());
      let result = config.validate(config, 'name', 0, 1, validationReporterStub);
      expect(result).toEqual([]);
    });

    it('returns non-empty array if rules are invalid', () => {
      config.addRule('name', new FAILING_RULE());
      let result = config.validate(config, 'name', 0, 1, validationReporterStub);
      expect(result.length).toEqual(1);
    });

    it('validates all errors if no key is supplied', () => {
      config.addRule('name', new FAILING_RULE());
      config.addRule('something', new FAILING_RULE());
      let result = config.validate(config, null, 0, 1, validationReporterStub);
      expect(result.length).toEqual(2);
    });
  });

  describe('.getValidationRules', () => {
    it('returns all validation rules', () => {
      config.addRule('name', new PASSING_RULE());
      config.addRule('type', new FAILING_RULE());
      let result = config.getValidationRules();
      expect(result.length).toEqual(2);
    });
  });

  describe('.addRule', () => {
    it('adds rule to the instances rules array', () => {
      config.addRule('name', new PASSING_RULE());
      expect(typeof config.__validationRules__[0].key).toEqual('string');
      expect(config.__validationRules__[0].key).toEqual('name');
    });
  });
});
