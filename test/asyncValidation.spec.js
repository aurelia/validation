import {ValidationRule} from '../src/validation/validation-rules';
import {ValidationRulesCollection} from '../src/validation/validation-rules-collection';

export class TestValidationRule extends ValidationRule {
  constructor(shouldFail) {
    super(shouldFail, (newValue, threshold) => {
      return threshold
    }, "test rule");
  }
}

describe('Tests on async validation: validation rule', () => {
  it('should fulfil a valid validation and resolve to true', (done) => {
    var testRule = new TestValidationRule(true);
    testRule.validate().then(() => {
      expect(testRule.explain()).toBe(null);
      done();
    });
  });
  it('should fulfil an invalid validation and resolve to false', (done) => {
    var testRule = new TestValidationRule(false);
    testRule.validate().then(() => {
      expect(testRule.explain()).toBe('test rule');
      done();
    });
  });
});
describe('Tests on async validation: validation collection', () => {
  it('should fulfil with a valid validation', (done) => {
    var testCollection = new ValidationRulesCollection();
    testCollection.addValidationRule(new TestValidationRule(true));
    testCollection.validate('test').then((result) => {
      expect(result.isValid).toBe(true);
      done();
    });
  });
  it('should fulfil with an invalid validation', (done) => {
    var testCollection = new ValidationRulesCollection();
    testCollection.addValidationRule(new TestValidationRule(false));
    testCollection.validate('test').then((result) => {
      expect(result.isValid).toBe(false);
      done();
    });
  });
});

describe('Tests on async validation: validation collection with inner collection', () => {
  it('should fulfil a valid validation', (done) => {
    var innerTestCollection = new ValidationRulesCollection();
    innerTestCollection.addValidationRule(new TestValidationRule(true));
    var testCollection = new ValidationRulesCollection();
    testCollection.addValidationRuleCollection(innerTestCollection);
    testCollection.validate('test').then((result) => {
      expect(result.isValid).toBe(true);
      done();
    });
  });

  it('should fulfil an invalid validation', (done) => {
    var innerTestCollection = new ValidationRulesCollection();
    innerTestCollection.addValidationRule(new TestValidationRule(false));
    innerTestCollection.isNotEmpty();
    var testCollection = new ValidationRulesCollection();
    testCollection.addValidationRuleCollection(innerTestCollection);
    testCollection.validate().then((result) => {
      expect(result.isValid).toBe(false);
      done();
    });
  });
});
