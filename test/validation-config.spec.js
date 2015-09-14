import {ValidationConfig} from '../src/validation/validation-config';
import {TWBootstrapViewStrategy} from '../src/strategies/twbootstrap-view-strategy';

describe('ValidationConfig', () => {
  it('should have default values', () => {
    var config = new ValidationConfig();
    //all defaults should go here
    expect(config.getDebounceTimeout()).toBe(0);
    expect(config.getDependencies().length).toBe(0);
    expect(config.getValue('locale')).toBe('en-US');
    expect(config.getViewStrategy()).toBe(TWBootstrapViewStrategy.AppendToMessage);
    expect(config.getValue('allPropertiesAreMandatory')).toBe(false);
  });

  it('should be configurable (API check)', () => {
    var config = new ValidationConfig();
    expect(config.useDebounceTimeout(50)).toBe(config); //fluent API check
    expect(config.getDebounceTimeout()).toBe(50);

    config = new ValidationConfig();
    expect(config.computedFrom('abc')).toBe(config); //fluent API check
    expect(config.getDependencies()[0]).toBe('abc');

    config = new ValidationConfig();
    expect(config.computedFrom(['abc','def'])).toBe(config); //fluent API check
    expect(config.getDependencies()[1]).toBe('def');

    config = new ValidationConfig();
    expect(config.useLocale('nl-BE')).toBe(config); //fluent API check
    expect(config.getValue('locale')).toBe('nl-BE');

    config = new ValidationConfig();
    expect(config.useViewStrategy(TWBootstrapViewStrategy.AppendToInput)).toBe(config); // fluent API check
    expect(config.getViewStrategy()).toBe(TWBootstrapViewStrategy.AppendToInput);

    config = new ValidationConfig();
    expect(config.treatAllPropertiesAsMandatory()).toBe(config); // fluent API check
    expect(config.getValue('allPropertiesAreMandatory')).toBe(true);

    config = new ValidationConfig();
    expect(config.treatAllPropertiesAsOptional()).toBe(config);// fluent API check
    expect(config.getValue('allPropertiesAreMandatory')).toBe(false);
  });

  it('should never change the defaults', () => {
    var config1 = new ValidationConfig();
    var config2 = new ValidationConfig();

    expect(config2.getDebounceTimeout()).toBe(0);
    config1.useDebounceTimeout(50);
    expect(config2.getDebounceTimeout()).toBe(0);
  });

  it('should allow you to set values', () => {
    var config = new ValidationConfig();
    config.setValue('test', 'a');
    expect(config.getValue('test')).toBe('a');
  });

  it('should get values set on the parent when it does not have a value itself ', () => {
    var parentConfig = new ValidationConfig();
    parentConfig.setValue('test', 'a');
    var config = new ValidationConfig(parentConfig);
    expect(config.getValue('test')).toBe('a');
  });

  it('should get not copy the values but instead delegate to the parent', () => {
    var parentConfig = new ValidationConfig();
    parentConfig.setValue('test', 'a');
    var config = new ValidationConfig(parentConfig);
    expect(config.getValue('test')).toBe('a');

    parentConfig.setValue('test', 'b');
    expect(config.getValue('test')).toBe('b');
  });

  it('should allow to override parents with own values', () => {
    var parentConfig = new ValidationConfig();
    parentConfig.setValue('test', 'a');
    var config = new ValidationConfig(parentConfig);
    expect(config.getValue('test')).toBe('a');

    config.setValue('test', 'c');
    parentConfig.setValue('test', 'b');
    expect(config.getValue('test')).toBe('c');
  });
});
