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
  it('should accept a valid validation', (done) => {
    var testRule = new TestValidationRule(true);
    testRule.validate().then(() => {
      expect(testRule.explain()).toBe(null);
      done();
    }, ()=> {
      expect(testRule.explain()).toBe('test rule');
      done();
    });
  });
  it('should reject an invalid validation', (done) => {
    var testRule = new TestValidationRule(false);
    testRule.validate().then(() => {
      expect(testRule.explain()).toBe(null);
      done();
    }, ()=> {
      expect(testRule.explain()).toBe('test rule');
      done();
    });
  });
});
describe('Tests on async validation: validation collection', () => {
  it('should accept a valid validation', (done) => {
    var testCollection = new ValidationRulesCollection();
    testCollection.addValidationRule(new TestValidationRule(true));
    testCollection.validate('test').then((result) => {
      expect(result.isValid).toBe(true);
      done();
    }, ()=> {
      expect(result.isValid).toBe(false);
      done();
    });
  });
  it('should reject an invalid validation', (done) => {
    var testCollection = new ValidationRulesCollection();
    testCollection.addValidationRule(new TestValidationRule(false));
    testCollection.validate('test').then((result) => {
      expect(result.isValid).toBe(true);
      done();
    }, (result)=> {
      expect(result.isValid).toBe(false);
      done();
    });
  });
});

describe('Tests on async validation: validation collection with inner collection', () => {
  it('should accept a valid validation', (done) => {
    var innerTestCollection = new ValidationRulesCollection();
    innerTestCollection.addValidationRule(new TestValidationRule(true));
    var testCollection = new ValidationRulesCollection();
    testCollection.addValidationRuleCollection(innerTestCollection);
    testCollection.validate('test').then((result) => {
      expect(result.isValid).toBe(true);
      done();
    }, ()=> {
      expect(result.isValid).toBe(false);
      done();
    });
  });
  it('should reject an invalid validation', (done) => {
    var innerTestCollection = new ValidationRulesCollection();
    innerTestCollection.addValidationRule(new TestValidationRule(true));
    var testCollection = new ValidationRulesCollection();
    testCollection.addValidationRuleCollection(innerTestCollection);
    testCollection.validate('test').then((result) => {
      expect(result.isValid).toBe(true);
      done();
    }, (result)=> {
      expect(result.isValid).toBe(false);
      done();
    });
  });

  it('should reject an invalid validation', (done) => {
    var innerTestCollection = new ValidationRulesCollection();
    innerTestCollection.addValidationRule(new TestValidationRule(true));
    innerTestCollection.notEmpty();
    var testCollection = new ValidationRulesCollection();
    testCollection.addValidationRuleCollection(innerTestCollection);
    testCollection.validate().then((result) => {
      expect(false).toBe(true);
      done();
    }, (result)=> {
      expect(result.isValid).toBe(false);
      done();
    });
  });
});
