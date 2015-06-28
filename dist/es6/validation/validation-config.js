import {ValidationLocale} from '../validation/validation-locale';
import {ValidateCustomAttributeViewStrategy} from '../validation/validate-custom-attribute-view-strategy';

export class ValidationConfigDefaults{
}
ValidationConfigDefaults._defaults = {
  debounceTimeout : 0,
  dependencies : [],
  locale : 'en-US',
  localeResources : 'aurelia-validation/resources/',
  viewStrategy : ValidateCustomAttributeViewStrategy.TWBootstrapAppendToMessage,
  allPropertiesAreMandatory : false
};
ValidationConfigDefaults.defaults = function(){
  var defaults = {};
  Object.assign(defaults, ValidationConfigDefaults._defaults);
  return defaults;
};

export class ValidationConfig {

  constructor(innerConfig)
  {
    this.innerConfig = innerConfig;
    this.values = this.innerConfig ? { } : ValidationConfigDefaults.defaults();
    this.changedHandlers = new Map();
  }

  getValue(identifier){
    if(this.values.hasOwnProperty(identifier) !== null && this.values[identifier] !== undefined)
    {
      return this.values[identifier];
    }
    if(this.innerConfig !== null)
    {
      return this.innerConfig.getValue(identifier);
    }
    throw Error('Config not found: ' + identifier);
  }
  setValue(identifier, value){
    this.values[identifier] = value;
    return this; //fluent API
  }

  onLocaleChanged(callback) {
    if(this.innerConfig !== undefined) {
      return this.innerConfig.onLocaleChanged(callback);
    }
    else {
      let id = ++ValidationConfig.uniqueListenerId;
      this.changedHandlers.set(id, callback);
      return () => {
        this.changedHandlers.delete(id);
      };
    }
  }

  getDebounceTimeout(){
    return this.getValue('debounceTimeout');
  }
  useDebounceTimeout(value)
  {
    return this.setValue('debounceTimeout', value);
  }

  getDependencies(){
    return this.getValue('dependencies');
  }

  computedFrom(dependencies){
    var deps = dependencies;
    if(typeof(dependencies) === 'string')
    {
      deps = [];
      deps.push(dependencies);
    }
    return this.setValue('dependencies', deps);
  }

  useLocale(localeIdentifier){
    this.setValue('locale', localeIdentifier);
    var callbacks = Array.from(this.changedHandlers.values());
    for(let i = 0; i < callbacks.length; i++)
    {
      callbacks[i]();
    }
    return this;
  }

  locale(){
    return ValidationLocale.Repository.load(this.getValue('locale'), this.getValue('localeResources'));
  }

  useViewStrategy(viewStrategy){
    return this.setValue('viewStrategy', viewStrategy);
  }

  getViewStrategy()
  {
    return this.getValue('viewStrategy');
  }

  treatAllPropertiesAsMandatory(){
    this.setValue('allPropertiesAreMandatory', true);
    return this;
  }
  treatAllPropertiesAsOptional(){
    this.setValue('allPropertiesAreMandatory', false);
    return this;
  }

}
ValidationConfig.uniqueListenerId = 0;
