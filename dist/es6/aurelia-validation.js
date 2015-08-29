import {Metadata} from 'aurelia-metadata';
import {ObserverLocator} from 'aurelia-binding';
import {inject} from 'aurelia-dependency-injection';
import {customAttribute} from 'aurelia-templating';

export {Utilities} from './validation/utilities';
export {ValidationConfig} from './validation/validation-config';
export {ValidationLocale} from './validation/validation-locale';
export * from './validation/validation-result';
export * from './validation/validation-rules';
export {Validation} from './validation/validation';
export {ValidateCustomAttribute} from './validation/validate-custom-attribute';
export {ValidateCustomAttributeViewStrategy} from './validation/validate-custom-attribute-view-strategy';
export {ValidateCustomAttributeViewStrategyBase} from './validation/validate-custom-attribute-view-strategy';
export {ensure} from './validation/decorators';


export function configure(aurelia, configCallback) {

  aurelia.globalResources('./validation/validate-custom-attribute');
  if(configCallback !== undefined && typeof(configCallback) === 'function')
  {
    configCallback(Validation.defaults);
  }
  aurelia.singleton(ValidationConfig, Validation.defaults);
  return Validation.defaults.locale();
}

export class Debouncer{
  constructor(debounceTimeout){
    this.currentFunction = null;
    this.debounceTimeout = debounceTimeout;
  }

  debounce(func)
  {
    this.currentFunction = func;
    setTimeout(() => {
        if(func !== null && func !== undefined)
        {
          if(func === this.currentFunction) {
            this.currentFunction = null;
            func();
          }
        }
    }, this.debounceTimeout);
  }
}

export class ValidationMetadata
{
  static metadataKey = 'aurelia:validation';
  
  constructor(){
    this.properties = [];
  }
  getOrCreateProperty(propertyName)
  {
    var property = this.properties.find(x => x.propertyName === propertyName);
    if(property === undefined)
    {
      property = new ValidationPropertyMetadata(propertyName);
      this.properties.push(property);
    }
    return property;
  }
  setup(validation)
  {
    this.properties.forEach( (property) => {
      property.setup(validation);
    });
  }
}
class ValidationPropertyMetadata{
  constructor(propertyName){
    this.propertyName = propertyName;
    this.setupSteps = [];
  }
  addSetupStep(setupStep){
    this.setupSteps.push(setupStep);
  }
  setup(validation){
    validation.ensure(this.propertyName);
    this.setupSteps.forEach((setupStep) => {
      setupStep(validation);
    });
  }
}


export function ensure(setupStep){
  return function(target, propertyName){
    var validationMetadata = Metadata.getOrCreateOwn(ValidationMetadata.metadataKey, ValidationMetadata, target);
    var property = validationMetadata.getOrCreateProperty(propertyName);
    property.addSetupStep(setupStep);
  }
}

export class PathObserver {

  constructor(observerLocator, subject, path) {
    this.observerLocator = observerLocator;
    this.path = path.split('.');
    this.subject = subject;
    this.observers = [];
    this.callbacks = [];
    if (this.path.length > 1)
      this.observeParts();

    //TODO: this should be replaced with reuse of the Binding system

  }

  observeParts(propertyName) {
    //remove old chain until an observer returns non-null
    if (propertyName !== undefined && propertyName !== null) {
      for (let i = this.observers.length - 1; i >= 0; i--) {
        let currentObserver = this.observers[i];
        if (currentObserver.propertyName === propertyName) {
          break;
        }
        var observer = this.observers.pop();
        if (observer && observer.subscription) {
          //cleanup
          observer.subscription();
        }
      }
    }

    let currentSubject = this.subject;
    //add new observers
    var observersAreComplete = this.observers.length === this.path.length;
    for (let i = 0; i < this.path.length; i++) {
      let observer = this.observers[i];
      if (!observer) {

        let currentPath = this.path[i];
        observer = this.observerLocator.getObserver(currentSubject, currentPath);
        this.observers.push(observer);
        let subscription = observer.subscribe((newValue, oldValue) => {
          this.observeParts(observer.propertyName);
        });
        observer.subscription = subscription;
      }


      let currentValue = observer.getValue();
      if (currentValue === undefined || currentValue === null) {
        break;
      }
      else {
        currentSubject = currentValue;
      }
    }

    //if the last observer is the real one
    if (!observersAreComplete && this.observers.length === this.path.length) {
      var actualObserver = this.observers[this.observers.length - 1];
      for (let i = 0; i < this.callbacks.length; i++) {
        //TODO proper cleanup of callbacks!
        actualObserver.subscribe(this.callbacks[i]);
      }
    }
  }

  observePart(part) {
    if (part !== this.path[this.path.length - 1]) {
      this.observeParts();
    }
  }

  getObserver() {
    if (this.path.length == 1) {
      var resolve = this.subject[this.path[0]]; //binding issue with @bindable properties, see: https://github.com/aurelia/binding/issues/89
      return this.observerLocator.getObserver(this.subject, this.path[0]);
    }
    return this;
  }


  getValue() {
    //Verify that all observers are current.
    let expectedSubject = this.subject;
    for (let i = 0; this.path.length; i++) {
      let currentObserver = this.observers[i];
      if (currentObserver === null || currentObserver === undefined) {
        this.observeParts(this.path[i]);
        currentObserver = this.observers[i];

        if (currentObserver === null || currentObserver === undefined) {
          break;
        }
      }
      if (currentObserver.obj !== expectedSubject)
      //Happens if you set a value somewhere along the binding path and immediately call getValue (on the very last observer)
      {
        this.observeParts(this.path[i - 1]);
        break;
      }
      expectedSubject = currentObserver.getValue();
    }


    if (this.observers.length !== this.path.length)
      return undefined; //Something along the binding path returned null/undefined
    var value = this.observers[this.observers.length - 1].getValue();
    return value;
  }

  subscribe(callback) {
    this.callbacks.unshift(callback);
    if (this.observers.length === this.path.length) {
      this.subscription = this.observers[this.observers.length - 1].subscribe(callback);
      return () => this.unsubscribe();
    }
  }

  unsubscribe() {
    this.callbacks = [];
    if(this.subscription) this.subscription();
    for (let i = this.observers.length - 1; i >= 0; i--) {
      var observer = this.observers.pop();
      if (observer && observer.subscription) {
        observer.subscription();
      }
    }
  }
}

export class Utilities {
  constructor(){}

  static getValue(val){
    if(val !== undefined && typeof(val) === 'function')
    {
      return val();
    }
    return val;
  }
  static isEmptyValue(val) {
    if (val === undefined) {
      return true;
    }
    if (val === null) {
      return true;
    }
    if (val === "") {
      return true;
    }
    if (typeof (val) === 'string') {
      if (String.prototype.trim) {
        val = val.trim();
      }
      else {
        val = val.replace(/^\s+|\s+$/g, '');
      }
    }

    if (val.length !== undefined) {
      return 0 === val.length;
    }
    return false;
  }
};

export class ValidateCustomAttributeViewStrategyBase{
  constructor(){
    this.bindingPathAttributes = ['validate', 'value.bind', 'value.two-way'];
  }

  getValidationProperty(validation, element){
    var atts = element.attributes;
    for (let i = 0; i < this.bindingPathAttributes.length; i++) {
      let attributeName = this.bindingPathAttributes[i];
      if (atts[attributeName]) {
        var bindingPath = atts[attributeName].value.trim();
        if (bindingPath.indexOf('|') != -1)
          bindingPath = bindingPath.split('|')[0].trim();
        var validationProperty = validation.result.properties[bindingPath];

        if (attributeName == 'validate' && (validationProperty === null || validationProperty === undefined)) {
          //Dev explicitly stated to show validation on a field, but there's no rules for this field
          //Hence, we add an empty validationProperty for that field, without any rules
          //This way, when 'checkAll()' is called, the input element 'turns green'
          validation.ensure(bindingPath);
          validationProperty = validation.result.properties[bindingPath];
        }
        return validationProperty;
      }
    }
    return null;
  }

  prepareElement(validationProperty, element){
    throw Error('View strategy must implement prepareElement(validationProperty, element)');
  }
  updateElement(validationProperty, element){
    throw Error('View strategy must implement updateElement(validationProperty, element)');
  }
}

export class TWBootstrapViewStrategy extends ValidateCustomAttributeViewStrategyBase {
  constructor(appendMessageToInput, appendMessageToLabel,helpBlockClass)
  {
    super();
    this.appendMessageToInput = appendMessageToInput;
    this.appendMessageToLabel = appendMessageToLabel;
    this.helpBlockClass = helpBlockClass;
  }
  searchFormGroup(currentElement, currentDepth) {
    if (currentDepth === 5) {
      return null;
    }
    if (currentElement.classList && currentElement.classList.contains('form-group')) {
      return currentElement;
    }
    return this.searchFormGroup(currentElement.parentNode, 1 + currentDepth);
  }
  findLabels(formGroup, inputId) {
    var labels = [];
    this.findLabelsRecursively(formGroup, inputId, labels, 0);
    return labels;
  }

  findLabelsRecursively(currentElement, inputId, currentLabels, currentDepth) {
    if (currentDepth === 5) {
      return;
    }
    if (currentElement.nodeName === "LABEL" &&
      ((currentElement.attributes['for'] && currentElement.attributes['for'].value === inputId) ||
      (!currentElement.attributes['for']))
    ) {
      currentLabels.push(currentElement);
    }


    for (let i = 0; i < currentElement.children.length; i++)
      this.findLabelsRecursively(currentElement.children[i], inputId, currentLabels, 1 + currentDepth);
  }


  appendMessageToElement(element, validationProperty) {
    var helpBlock = element.nextSibling;
    if (helpBlock) {
      if (!helpBlock.classList) {
        helpBlock = null;
      }
      else if (!helpBlock.classList.contains(this.helpBlockClass)) {
        helpBlock = null;
      }
    }

    if (!helpBlock) {
      helpBlock = document.createElement("p");
      helpBlock.classList.add('help-block');
      helpBlock.classList.add(this.helpBlockClass);

      if (element.nextSibling) {
        element.parentNode.insertBefore(helpBlock, element.nextSibling);
      }
      else {
        element.parentNode.appendChild(helpBlock);
      }
    }
    if (validationProperty)
      helpBlock.textContent = validationProperty.message;
    else
      helpBlock.textContent = '';
  }


  appendUIVisuals(validationProperty, currentElement) {
    var formGroup = this.searchFormGroup(currentElement, 0);
    if (formGroup) {
      if (validationProperty && validationProperty.isDirty) {
        if (validationProperty.isValid) {
          formGroup.classList.remove('has-warning');
          formGroup.classList.add('has-success');
        }
        else {
          formGroup.classList.remove('has-success');
          formGroup.classList.add('has-warning');
        }
      }
      else {
        formGroup.classList.remove('has-warning');
        formGroup.classList.remove('has-success');
      }
      if (this.appendMessageToInput) {
        this.appendMessageToElement(currentElement, validationProperty);
      }
      if (this.appendMessageToLabel) {
        var labels = this.findLabels(formGroup, currentElement.id);
        for (var ii = 0; ii < labels.length; ii++) {
          var label = labels[ii];
          this.appendMessageToElement(label, validationProperty);
        }
      }
    }
  }
  prepareElement(validationProperty, element){
    this.appendUIVisuals(null, element);
  }
  updateElement(validationProperty, element){
    this.appendUIVisuals(validationProperty, element);
  }
}
export class ValidateCustomAttributeViewStrategy { }
ValidateCustomAttributeViewStrategy.TWBootstrapAppendToInput = new TWBootstrapViewStrategy(true, false, 'aurelia-validation-message');
ValidateCustomAttributeViewStrategy.TWBootstrapAppendToMessage = new TWBootstrapViewStrategy(false, true, 'aurelia-validation-message');

@customAttribute('validate')
@inject(Element)
export class ValidateCustomAttribute {
  constructor(element) {
    this.element = element;
    this.processedValidation = null;
    this.viewStrategy = null;
  }

  valueChanged(newValue) {
    if (this.value === null || this.value === undefined)
      return;
    this.processedValidation = this.value;
    if (typeof (this.value) === 'string') {
      return; //this is just to tell the real validation instance (higher in the DOM) the exact property-path to bind to
    }
    else {
      //binding to a validation instance
      this.subscribeChangedHandlers(this.element);
    }
  }
  subscribeChangedHandlers(currentElement) {
    this.viewStrategy = this.value.config.getViewStrategy();
    var validationProperty = this.viewStrategy.getValidationProperty(this.value, currentElement);
    if(validationProperty !== null && validationProperty !== undefined)
    {
      this.viewStrategy.prepareElement(validationProperty, currentElement);
      validationProperty.onValidate(
        (vp) => {
          this.viewStrategy.updateElement(vp, currentElement);
        }
      );
    }
    var children = currentElement.children;
    for (var i = 0; i < children.length; i++) {
      this.subscribeChangedHandlers(children[i]);
    }
  }

  detached() {
  }

  attached() {
    if (this.processedValidation === null || this.processedValidation === undefined)
      this.valueChanged(this.value);
  }
}

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

export class ValidationGroupBuilder {
  constructor(observerLocator, validationGroup) {
    this.observerLocator = observerLocator;
    this.validationRuleCollections = []; //Flattened out queue of the nested collections
    this.validationGroup = validationGroup;
  }

  ensure(propertyName, configurationCallback) {
    var newValidationProperty = null;
    this.validationRuleCollections = [];

    for (let i = 0; i < this.validationGroup.validationProperties.length; i++) {
      if (this.validationGroup.validationProperties[i].propertyName === propertyName) {
        newValidationProperty = this.validationGroup.validationProperties[i];
        if(configurationCallback !== undefined && typeof(configurationCallback) === 'function')
        {
          throw Error('When creating validation rules on binding path ' + propertyName + ' a configuration callback function was provided, but validation rules have previously already been instantiated for this binding path');
        }
        break;
      }
    }
    if (newValidationProperty === null) {
      var propertyResult = this.validationGroup.result.addProperty(propertyName);
      var config = new ValidationConfig(this.validationGroup.config);
      if(configurationCallback !== undefined && typeof(configurationCallback) === 'function')
      {
        configurationCallback(config);
      }
      newValidationProperty = new ValidationProperty(this.observerLocator, propertyName, this.validationGroup, propertyResult, config );
      this.validationGroup.validationProperties.push(newValidationProperty);
    }
    this.validationRuleCollections.unshift(newValidationProperty.collectionOfValidationRules);
    return this.validationGroup;
  }

  isNotEmpty() {
    this.validationRuleCollections[0].isNotEmpty();
    this.checkLast();
    return this.validationGroup;
  }
  canBeEmpty(){
    this.validationRuleCollections[0].canBeEmpty();
    this.checkLast();
    return this.validationGroup;
  }

  isGreaterThan(minimumValue) {
    return this.passesRule(new MinimumValueValidationRule(minimumValue));
  }
  isGreaterThanOrEqualTo(minimumValue) {
    return this.passesRule(new MinimumInclusiveValueValidationRule(minimumValue));
  }

  isBetween(minimumValue, maximumValue) {
    return this.passesRule(new BetweenValueValidationRule(minimumValue, maximumValue));
  }

  isIn(collection) {
    return this.passesRule(new InCollectionValidationRule(collection));
  }

  isLessThan(maximumValue) {
    return this.passesRule(new MaximumValueValidationRule(maximumValue));
  }

  isLessThanOrEqualTo(maximumValue) {
    return this.passesRule(new MaximumInclusiveValueValidationRule(maximumValue));
  }

  isEqualTo(otherValue, otherValueLabel) {
    if(!otherValueLabel) {
      return this.passesRule(new EqualityValidationRule(otherValue));
    }
    else {
      return this.passesRule(new EqualityWithOtherLabelValidationRule(otherValue, otherValueLabel));
    }
  }

  isNotEqualTo(otherValue, otherValueLabel) {
    if(!otherValueLabel) {
      return this.passesRule(new InEqualityValidationRule(otherValue));
    }
    else {
      return this.passesRule(new InEqualityWithOtherLabelValidationRule(otherValue, otherValueLabel));
    }
  }

  isEmail() {
    return this.passesRule(new EmailValidationRule());
  }

  isURL(){
    return this.passesRule(new URLValidationRule());
  }

  hasMinLength(minimumValue) {
    return this.passesRule(new MinimumLengthValidationRule(minimumValue));
  }

  hasMaxLength(maximumValue) {
    return this.passesRule(new MaximumLengthValidationRule(maximumValue));
  }

  hasLengthBetween(minimumValue, maximumValue) {
    return this.passesRule(new BetweenLengthValidationRule(minimumValue, maximumValue));
  }

  isNumber() {
    return this.passesRule(new NumericValidationRule());
  }

  containsNoSpaces(){
    return this.passesRule(new NoSpacesValidationRule());
  }

  containsOnlyDigits() {
    return this.passesRule(new DigitValidationRule());
  }

  containsOnlyAlpha(){
    return this.passesRule(new AlphaValidationRule());
  }

  containsOnlyAlphaOrWhitespace(){
    return this.passesRule(new AlphaOrWhitespaceValidationRule());
  }

  containsOnlyAlphanumerics(){
    return this.passesRule(new AlphaNumericValidationRule());
  }

  containsOnlyAlphanumericsOrWhitespace() {
    return this.passesRule(new AlphaNumericOrWhitespaceValidationRule());
  }

  isStrongPassword(minimumComplexityLevel) {
    if(minimumComplexityLevel === 4) {
      return this.passesRule(new StrongPasswordValidationRule());
    }
    else {
      return this.passesRule(new MediumPasswordValidationRule(minimumComplexityLevel));
    }
  }

  containsOnly(regex)
  {
    return this.passesRule(new ContainsOnlyValidationRule(regex));
  }

  matches(regex) {
    return this.passesRule(new RegexValidationRule(regex));
  }

  passes(customFunction, threshold) {
    return this.passesRule(new CustomFunctionValidationRule(customFunction, threshold));
  }

  passesRule(validationRule) {

    this.validationRuleCollections[0].addValidationRule(validationRule);
    this.checkLast();
    return this.validationGroup;
  }

  checkLast() {
    var validationProperty = this.validationGroup.validationProperties[this.validationGroup.validationProperties.length - 1];
    validationProperty.validateCurrentValue(false);
  }

  withMessage(message) {
    this.validationRuleCollections[0].withMessage(message);
    this.checkLast();
    return this.validationGroup;
  }

  if(conditionExpression) {
    //IF is treated as a 'switch' with case 'true' and 'default'
    var conditionalCollection = new SwitchCaseValidationRulesCollection(conditionExpression);
    conditionalCollection.case(true);
    this.validationRuleCollections[0].addValidationRuleCollection(conditionalCollection);
    this.validationRuleCollections.unshift(conditionalCollection);
    return this.validationGroup;
  }

  else() {
    if (!this.validationRuleCollections[0].default) {
      throw 'Invalid statement: \'else\'';
    }
    //this.validationRuleCollections[0].case(false);
    this.validationRuleCollections[0].default();//slightly less object creation then 'case false'
    return this.validationGroup;
  }

  endIf() {
    if (!this.validationRuleCollections[0].default) {
      throw 'Invalid statement: \'endIf\'';
    }
    this.validationRuleCollections.shift(); //go up one level in the nested collections
    this.checkLast();
    return this.validationGroup;
  }

  switch(conditionExpression) {
    var condition = conditionExpression;
    if (condition === undefined) {
      let observer = this.validationGroup.validationProperties[this.validationGroup.validationProperties.length - 1].observer;
      condition = () => {
        return observer.getValue();
      };
    }
    var conditionalCollection = new SwitchCaseValidationRulesCollection(condition);
    this.validationRuleCollections[0].addValidationRuleCollection(conditionalCollection);
    this.validationRuleCollections.unshift(conditionalCollection);
    return this.validationGroup;
  }

  case(caseLabel) {
    if (!this.validationRuleCollections[0].default) {
      throw 'Invalid statement: \'case\'';
    }

    this.validationRuleCollections[0].case(caseLabel);
    return this.validationGroup;
  }

  default() {
    if (!this.validationRuleCollections[0].default) {
      throw 'Invalid statement: \'case\'';
    }

    this.validationRuleCollections[0].default();
    return this.validationGroup;
  }

  endSwitch() {
    if (!this.validationRuleCollections[0].default) {
      throw 'Invalid statement: \'endIf\'';
    }

    this.validationRuleCollections.shift(); //go up one level in the nested collections
    this.checkLast();
    return this.validationGroup;
  }
}

/**
 * Encapsulates validation rules and their current validation state for a given subject
 * @class ValidationGroup
 * @constructor
 */
export class ValidationGroup {
  /**
   * Instantiates a new {ValidationGroup}
   * @param subject The subject to evaluate
   * @param observerLocator The observerLocator used to monitor changes on the subject
   * @param config The configuration
   */
  constructor(subject, observerLocator, config) {
    this.result = new ValidationResult();
    this.subject = subject;
    this.validationProperties = [];
    this.config = config;
    this.builder = new ValidationGroupBuilder(observerLocator, this);
    this.onValidateCallbacks = [];
    this.onPropertyValidationCallbacks = [];
    this.isValidating = false;
    this.onDestroy = config.onLocaleChanged( () => {
      this.validate(false, true) ;});


    var validationMetadata = Metadata.getOwn(ValidationMetadata.metadataKey, this.subject);
    if (validationMetadata) {
      validationMetadata.setup(this);
    }
  }

  destroy(){
    for (var i = this.validationProperties.length - 1; i >= 0; i--) {
      this.validationProperties[i].destroy();
    }
    this.onDestroy();
    // TODO: what else needs to be done for proper cleanup?
  }

  clear(){
    this.validationProperties.forEach( (prop) => { prop.clear();});
    this.result.clear();
  }

  onBreezeEntity(){
    let breezeEntity = this.subject;
    let me = this;
    this.onPropertyValidate( (propertyBindingPath) => {
      this.passes( () => {
        breezeEntity.entityAspect.validateProperty(propertyBindingPath);
        var errors = breezeEntity.entityAspect.getValidationErrors(propertyBindingPath);
        if(errors.length === 0)
          return true;
        else
          return errors[0].errorMessage;
      });
    });
    this.onValidate( () => {
      breezeEntity.entityAspect.validateEntity();
      return {};
    });

    breezeEntity.entityAspect.validationErrorsChanged.subscribe(function () {
      breezeEntity.entityAspect.getValidationErrors().forEach( (validationError) => {
          let propertyName = validationError.propertyName;
          if (!me.result.properties[propertyName]) {  //set up empty validation on the property
            me.ensure(propertyName);
          }

          let currentResultProp = me.result.addProperty(propertyName);
          if (currentResultProp.isValid) {

            currentResultProp.setValidity({
              isValid: false,
              message: validationError.errorMessage,
              failingRule: 'breeze',
              latestValue: currentResultProp.latestValue
            }, true);
          }
      });
    });
  }


  /**
   * Causes complete re-evaluation: gets the latest value, marks the property as 'dirty' (unless false is passed), runs validation rules asynchronously and updates this.result
   * @returns {Promise} A promise that fulfils when valid, rejects when invalid.
   */
  validate(forceDirty = true, forceExecution = true) {
    this.isValidating = true;
    var promise = Promise.resolve(true);
    for (let i = this.validationProperties.length - 1; i >= 0; i--) {
      let validatorProperty = this.validationProperties[i];
      promise = promise.then( () => { return validatorProperty.validateCurrentValue(forceDirty, forceExecution); });
    }
    promise = promise.catch( () => {
      console.log("Should never get here: a validation property should always resolve to true/false!");
      throw Error("Should never get here: a validation property should always resolve to true/false!");
    });


    this.onValidateCallbacks.forEach( (onValidateCallback) => {
      promise = promise.then(() => {return this.config.locale();}).then((locale) => {
        return Promise.resolve(onValidateCallback.validationFunction()).then((callbackResult) => {
            for (var prop in callbackResult) {
              if(!this.result.properties[prop])
              {  //set up empty validation on the property
                this.ensure(prop);
              }
              let resultProp = this.result.addProperty(prop);
              let result = callbackResult[prop];
              let newPropResult = {
                latestValue : resultProp.latestValue
              };
              if (result === true || result === null || result === '' ) {
                if(!resultProp.isValid && resultProp.failingRule === 'onValidateCallback' ) {
                  newPropResult.failingRule = null;
                  newPropResult.message = '';
                  newPropResult.isValid = true;
                  resultProp.setValidity(newPropResult, true);
                }
              }
              else {
                if (resultProp.isValid) {
                  newPropResult.failingRule = 'onValidateCallback';
                  newPropResult.isValid = false;
                  if (typeof(result) === 'string') {
                    newPropResult.message = result;
                  }
                  else {
                    newPropResult.message = locale.translate(newPropResult.failingRule);
                  }
                  resultProp.setValidity(newPropResult, true);
                }
              }
            }
            this.result.checkValidity();
          },
          (a,b,c,d,e) => {
            this.result.isValid = false;
            if(onValidateCallback.validationFunctionFailedCallback)
            {
              onValidateCallback.validationFunctionFailedCallback(a,b,c,d,e);
            }
          });
      });
    });
    promise = promise
    .then(() => {
      this.isValidating = false;
      if(this.result.isValid)
      {
        return Promise.resolve(this.result);
      }
      else
      {
        return Promise.reject(this.result);
      }
    });
      return promise;
  };

  onValidate(validationFunction, validationFunctionFailedCallback){
    this.onValidateCallbacks.push( { validationFunction,validationFunctionFailedCallback}) ;
    return this;
  }

  onPropertyValidate(validationFunction)
  {
    this.onPropertyValidationCallbacks.push(validationFunction);
    return this;
  }

  /**
   * Adds a validation property for the specified path
   * @param {String} bindingPath the path of the property/field, for example 'firstName' or 'address.muncipality.zipCode'
   * @param configCallback a configuration callback
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  ensure(bindingPath, configCallback) {
    this.builder.ensure(bindingPath, configCallback);
    this.onPropertyValidationCallbacks.forEach((callback) => { callback(bindingPath); });
    return this;
  }

  /**
   * Adds a validation rule that checks a value for being 'isNotEmpty', 'required'
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isNotEmpty() {
    return this.builder.isNotEmpty();
  }

  /**
   * Adds a validation rule that allows a value to be empty/null
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  canBeEmpty() {
    return this.builder.canBeEmpty();
  }

  /**
   * Adds a validation rule that checks a value for being greater than or equal to a threshold
   * @param minimumValue the threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isGreaterThanOrEqualTo(minimumValue) {
    return this.builder.isGreaterThanOrEqualTo(minimumValue);
  }
  /**
   * Adds a validation rule that checks a value for being greater than a threshold
   * @param minimumValue the threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isGreaterThan(minimumValue) {
    return this.builder.isGreaterThan(minimumValue);
  }

  /**
   * Adds a validation rule that checks a value for being greater than or equal to a threshold, and less than or equal to another threshold
   * @param minimumValue The minimum threshold
   * @param maximumValue The isLessThanOrEqualTo threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isBetween(minimumValue, maximumValue) {
    return this.builder.isBetween(minimumValue, maximumValue);
  }

  /**
   * Adds a validation rule that checks a value for being less than a threshold
   * @param maximumValue The threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isLessThanOrEqualTo(maximumValue) {
    return this.builder.isLessThanOrEqualTo(maximumValue);
  }
  /**
   * Adds a validation rule that checks a value for being less than or equal to a threshold
   * @param maximumValue The threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isLessThan(maximumValue){
    return this.builder.isLessThan(maximumValue);
  }

  /**
   * Adds a validation rule that checks a value for being equal to a threshold
   * @param otherValue The threshold
   * @param otherValueLabel Optional: a label to use in the validation message
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isEqualTo(otherValue, otherValueLabel) {
    return this.builder.isEqualTo(otherValue, otherValueLabel);
  }

  /**
   * Adds a validation rule that checks a value for not being equal to a threshold
   * @param otherValue The threshold
   * @param otherValueLabel Optional: a label to use in the validation message
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isNotEqualTo(otherValue, otherValueLabel) {
    return this.builder.isNotEqualTo(otherValue, otherValueLabel);
  }

  /**
   * Adds a validation rule that checks a value for being a valid isEmail address
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isEmail() {
    return this.builder.isEmail();
  }
  /**
   * Adds a validation rule that checks a value for being a valid URL
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isURL(){
    return this.builder.isURL();
  }

  /**
   * Adds a validation rule that checks a value for being equal to at least one other value in a particular collection
   * @param collection The threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isIn(collection) {
    return this.builder.isIn(collection);
  }

  /**
   * Adds a validation rule that checks a value for having a length greater than or equal to a specified threshold
   * @param minimumValue The threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  hasMinLength(minimumValue) {
    return this.builder.hasMinLength(minimumValue);
  }

  /**
   * Adds a validation rule that checks a value for having a length less than a specified threshold
   * @param maximumValue The threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  hasMaxLength(maximumValue) {
    return this.builder.hasMaxLength(maximumValue);
  }

  /**
   * Adds a validation rule that checks a value for having a length greater than or equal to a specified threshold and less than another threshold
   * @param minimumValue The min threshold
   * @param maximumValue The max threshold
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  hasLengthBetween(minimumValue, maximumValue) {
    return this.builder.hasLengthBetween(minimumValue, maximumValue);
  }

  /**
   * Adds a validation rule that checks a value for being numeric, this includes formatted numbers like '-3,600.25'
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isNumber() {
    return this.builder.isNumber();
  }
  /**
   * Adds a validation rule that checks a value for containing not a single whitespace
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  containsNoSpaces() {
    return this.builder.containsNoSpaces();
  }


  /**
   * Adds a validation rule that checks a value for being strictly numeric, this excludes formatted numbers like '-3,600.25'
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  containsOnlyDigits() {
    return this.builder.containsOnlyDigits();
  }

  containsOnly(regex){
    return this.builder.containsOnly(regex);
  }

  containsOnlyAlpha()
  {
    return this.builder.containsOnlyAlpha();
  }

  containsOnlyAlphaOrWhitespace()
  {
    return this.builder.containsOnlyAlphaOrWhitespace();
  }
  containsOnlyLetters()
  {
    return this.builder.containsOnlyAlpha();
  }

  containsOnlyLettersOrWhitespace()
  {
    return this.builder.containsOnlyAlphaOrWhitespace();
  }


  /**
   * Adds a validation rule that checks a value for only containing alphanumerical characters
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  containsOnlyAlphanumerics() {
    return this.builder.containsOnlyAlphanumerics();
  }

  /**
   * Adds a validation rule that checks a value for only containing alphanumerical characters or whitespace
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  containsOnlyAlphanumericsOrWhitespace() {
    return this.builder.containsOnlyAlphanumericsOrWhitespace();
  }

  /**
   * Adds a validation rule that checks a value for being a strong password. A strong password contains at least the specified of the following groups: lowercase characters, uppercase characters, digits and special characters.
   * @param minimumComplexityLevel {Number} Optionally, specifiy the number of groups to match. Default is 4.
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  isStrongPassword(minimumComplexityLevel) {
    return this.builder.isStrongPassword(minimumComplexityLevel);
  }


  /**
   * Adds a validation rule that checks a value for matching a particular regex
   * @param regex the regex to match
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  matches(regex) {
    return this.builder.matches(regex);
  }

  /**
   * Adds a validation rule that checks a value for passing a custom function
   * @param customFunction {Function} The custom function that needs to pass, that takes two arguments: newValue (the value currently being evaluated) and optionally: threshold, and returns true/false.
   * @param threshold {Object} An optional threshold that will be passed to the customFunction
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  passes(customFunction, threshold) {
    return this.builder.passes(customFunction, threshold);
  }

  /**
   * Adds the {ValidationRule}
   * @param validationRule {ValudationRule} The rule that needs to pass
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  passesRule(validationRule) {
    return this.builder.passesRule(validationRule);
  }

  /**
   * Specifies that the next validation rules only need to be evaluated when the specified conditionExpression is true
   * @param conditionExpression {Function} a function that returns true of false.
   * @param threshold {Object} an optional treshold object that is passed to the conditionExpression
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  if(conditionExpression, threshold) {
    return this.builder.if(conditionExpression, threshold);
  }

  /**
   * Specifies that the next validation rules only need to be evaluated when the previously specified conditionExpression is false.
   * See: if(conditionExpression, threshold)
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  else() {
    return this.builder.else();
  }

  /**
   * Specifies that the execution of next validation rules no longer depend on the the previously specified conditionExpression.
   * See: if(conditionExpression, threshold)
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  endIf() {
    return this.builder.endIf();
  }

  /**
   * Specifies that the next validation rules only need to be evaluated when they are preceded by a case that matches the conditionExpression
   * @param conditionExpression {Function} a function that returns a case label to execute. This is optional, when omitted the case label will be matched using the underlying property's value
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  switch(conditionExpression) {
    return this.builder.switch(conditionExpression);
  }

  /**
   * Specifies that the next validation rules only need to be evaluated when the caseLabel matches the value returned by a preceding switch statement
   * See: switch(conditionExpression)
   * @param caseLabel {Object} the case label
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  case(caseLabel) {
    return this.builder.case(caseLabel);
  }

  /**
   * Specifies that the next validation rules only need to be evaluated when not other caseLabel matches the value returned by a preceding switch statement
   * See: switch(conditionExpression)
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  default() {
    return this.builder.default();
  }

  /**
   * Specifies that the execution of next validation rules no longer depend on the the previously specified conditionExpression.
   * See: switch(conditionExpression)
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  endSwitch() {
    return this.builder.endSwitch();
  }

  /**
   * Specifies that the execution of the previous validation rule should use the specified error message if it fails
   * @param message either a static string or a function that takes two arguments: newValue (the value that has been evaluated) and threshold.
   * @returns {ValidationGroup} returns this ValidationGroup, to enable fluent API
   */
  withMessage(message) {
    return this.builder.withMessage(message);
  }
}

export class ValidationLocale{
  constructor(defaults, data)
  {
    this.defaults = defaults;
    this.currentLocale = data;
  }
  getValueFor(identifier, category) {
    if (this.currentLocale && this.currentLocale[category]) {
      var currentLocaleSetting = this.currentLocale[category][identifier];
      if (currentLocaleSetting !== undefined && currentLocaleSetting !== null)
        return currentLocaleSetting;
    }
    if (this.defaults[category]) {
      var defaultSetting = this.defaults[category][identifier];
      if (defaultSetting !== undefined && defaultSetting !== null)
        return defaultSetting;
    }
    throw 'validation: I18N: Could not find: ' + identifier + ' in category: ' + category;
  }


  setting(settingIdentifier) {
    return this.getValueFor(settingIdentifier, 'settings');
  }

  translate(translationIdentifier, newValue, threshold) {
    var translation = this.getValueFor(translationIdentifier, 'messages');
    if (typeof translation === 'function') {
      return translation(newValue, threshold);
    }
    if (typeof translation === 'string') {
      return translation;
    }
    throw 'Validation message for ' + translationIdentifier + 'was in an unsupported format';
  }
}

class ValidationLocaleRepository  {
  constructor(){
    this.default = null;
    this.instances = new Map();
    this.defaults = {
      settings: {
        'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
      },
      messages: {}
    };
  }
  load(localeIdentifier, basePath) {
    if(!basePath)
      basePath = 'aurelia-validation/resources/';
    return new Promise((resolve, reject) => {
      if(this.instances.has(localeIdentifier)) {
        let locale = this.instances.get(localeIdentifier);
        resolve(locale);
      }
      else {
        System.import(basePath + localeIdentifier).then((resource) => {
          let locale = this.addLocale(localeIdentifier, resource.data);
          resolve(locale);
        });
      }
    });
  }
  addLocale(localeIdentifier, data)
  {
    var instance = new ValidationLocale(this.defaults, data);
    this.instances.set(localeIdentifier, instance);
    if(this.default === null)
      this.default = instance;
    return instance;
  }
}
ValidationLocale.Repository = new ValidationLocaleRepository();

export class ValidationProperty {
  constructor(observerLocator, propertyName, validationGroup, propertyResult, config) {
    this.propertyResult = propertyResult;
    this.propertyName = propertyName;
    this.validationGroup = validationGroup;
    this.collectionOfValidationRules = new ValidationRulesCollection(config);
    this.config = config;
    this.latestValue = undefined;

    this.observer = new PathObserver(observerLocator, validationGroup.subject, propertyName)
      .getObserver();

    this.debouncer = new Debouncer(config.getDebounceTimeout());

    this.subscription = this.observer.subscribe(() => {
      this.debouncer.debounce( () => {
        var newValue =   this.observer.getValue();
        if(newValue !== this.latestValue) {
          this.validate(newValue, true);
        }
      });
    });

    this.dependencyObservers = [];
    var dependencies = this.config.getDependencies();
    for(let i = 0; i < dependencies.length; i++){
      let dependencyObserver = new PathObserver(observerLocator, validationGroup.subject, dependencies[i])
        .getObserver();
      dependencyObserver.subscribe(() => {
        this.debouncer.debounce( () => {
          this.validateCurrentValue(true);
        });
      });
      this.dependencyObservers.push(dependencyObserver);
    }
  }

  addValidationRule(validationRule) {
    if (validationRule.validate === undefined) //Can ES6 check on base class??
      throw new Error("That's not a valid validationRule");
    this.collectionOfValidationRules.addValidationRule(validationRule);
    this.validateCurrentValue(false);
  }

  validateCurrentValue(forceDirty, forceExecution) {
    return this.validate(this.observer.getValue(), forceDirty, forceExecution);
  }

  clear(){
    this.latestValue = this.observer.getValue();
    this.propertyResult.clear();
  }

  destroy() {
    if(this.subscription) this.subscription();
    // TODO: what else needs to be done for proper cleanup?
  }

  /**
   * returns a promise that fulfils and resolves to true/false
   */
  validate(newValue, shouldBeDirty, forceExecution) {
    if( (!this.propertyResult.isDirty && shouldBeDirty) || this.latestValue !== newValue || forceExecution) {
      this.latestValue = newValue;
      return this.config.locale().then((locale) => {
          return this.collectionOfValidationRules.validate(newValue, locale)
            .then((validationResponse) => {
              if (this.latestValue === validationResponse.latestValue)
                this.propertyResult.setValidity(validationResponse, shouldBeDirty);
              return validationResponse.isValid;
            })
            .catch((err) => {
              console.log("Unexpected behavior: a validation-rules-collection should always fulfil", err);
              throw Error("Unexpected behavior: a validation-rules-collection should always fulfil");
            });
        },
        () => {
          throw Error("An exception occurred while trying to load the locale");
        });
    }
  }
}

export class ValidationResult {
  constructor() {
    this.isValid = true;
    this.properties = {};
  }

  addProperty(name) {
    if (!this.properties[name]) {
      this.properties[name] = new ValidationResultProperty(this);
    }
    return this.properties[name];
  }

  checkValidity() {
    for (let propertyName in this.properties) {
      if (!this.properties[propertyName].isValid) {
        this.isValid = false;
        return;
      }
    }
    this.isValid = true;
  }
  clear() {
    this.isValid = true;
  }
}

export class ValidationResultProperty {
  constructor(group) {
    this.group = group;
    this.onValidateCallbacks = [];
    this.clear();
  }

  clear(){
    this.isValid = true;
    this.isDirty = false;
    this.message = '';
    this.failingRule = null;
    this.latestValue = null;
    this.notifyObserversOfChange();
  }

  onValidate(onValidateCallback) {
    this.onValidateCallbacks.push(onValidateCallback);
  }

  notifyObserversOfChange(){
    for (var i = 0; i < this.onValidateCallbacks.length; i++) {
      var callback = this.onValidateCallbacks[i];
      callback(this);
    }
  }

  setValidity(validationResponse, shouldBeDirty) {
    var notifyObservers = (!this.isDirty && shouldBeDirty)
      || (this.isValid !== validationResponse.isValid)
      || (this.message !== validationResponse.message);


    if (shouldBeDirty)
      this.isDirty = true;
    this.message = validationResponse.message;
    this.failingRule = validationResponse.failingRule;
    this.isValid = validationResponse.isValid; //Set isValid last in case someone has observed 'isValid'
    this.latestValue = validationResponse.latestValue;
    if (this.isValid !== this.group.isValid)
      this.group.checkValidity();

    if (notifyObservers) {
      this.notifyObserversOfChange();
    }
  }
}

export class ValidationRulesCollection {
  constructor(config) {
    this.isRequired = config ? config.getValue('allPropertiesAreMandatory') : false;
    this.validationRules = [];
    this.validationCollections = [];
    this.isRequiredMessage = null;
  }

  /**
   * Returns a promise that fulfils and resolves to simple result status object.
   */
  validate(newValue, locale) {
    if(locale === undefined)
    {
      locale = ValidationLocale.Repository.default;
    }
    newValue = Utilities.getValue(newValue);
    let executeRules = true;

    //Is required?
    if (Utilities.isEmptyValue(newValue)) {
      if (this.isRequired) {
        return Promise.resolve({
          isValid: false,
          message: this.isRequiredMessage ?
            ( (typeof(this.isRequiredMessage) === 'function') ? this.isRequiredMessage(newValue) : this.isRequiredMessage  ) :
            locale.translate('isRequired'),
          failingRule: 'isRequired',
          latestValue: newValue
        });
      }
      else {
        executeRules = false;
      }
    }

    var checks = Promise.resolve({
      isValid: true,
      message: '',
      failingRule: null,
      latestValue: newValue
    });

    //validate rules
    if (executeRules) {
      for (let i = 0; i < this.validationRules.length; i++) {
        let rule = this.validationRules[i];
        checks = checks.then( (previousRuleResult) => {
          //Earlier in the chain, something resolved to an invalid result. Chain it.
          if(previousRuleResult.isValid  === false)
          {
            return previousRuleResult;
          }
          else
          {
            return rule.validate(newValue, locale).then( (thisRuleResult) => {
              if(thisRuleResult === false) {
                return {
                  isValid: false,
                  message: rule.explain(),
                  failingRule: rule.ruleName,
                  latestValue: newValue
                };
              }
              else
              {
                //assertion
                if(!previousRuleResult.isValid)
                {
                  throw Error("ValidationRulesCollection.validate caught an unexpected result while validating it's chain of rules.");
                }
                return previousRuleResult;
              }
            });
          }
        });
      }
    }

    //validate collections
    for (let i = 0; i < this.validationCollections.length; i++) {
      let validationCollection = this.validationCollections[i];
      checks = checks.then( (previousValidationResult)=> {
        if(previousValidationResult.isValid)
          return validationCollection.validate(newValue, locale);
        else
          return previousValidationResult;
      });
    }

    return checks;
  }

  addValidationRule(validationRule) {
    if (validationRule.validate === undefined) //Can ES6 check on base class??
      throw new Error("That's not a valid validationRule");
    this.validationRules.push(validationRule);
  }

  addValidationRuleCollection(validationRulesCollection) {
    this.validationCollections.push(validationRulesCollection);
  }

  isNotEmpty() {
    this.isRequired = true;
  }

  canBeEmpty(){
    this.isRequired = false;
  }

  withMessage(message) {
    if(this.validationRules.length === 0)
      this.isRequiredMessage = message;
    else
      this.validationRules[this.validationRules.length - 1].withMessage(message);
  }
}

export class SwitchCaseValidationRulesCollection {

  constructor(conditionExpression, config) {
    this.conditionExpression = conditionExpression;
    this.config = config;
    this.innerCollections = [];
    this.defaultCollection = new ValidationRulesCollection(this.config);
    this.caseLabel = '';
    this.defaultCaseLabel = {description: 'this is the case label for \'default\''};
  }

  case(caseLabel) {
    this.caseLabel = caseLabel;
    this.getCurrentCollection(caseLabel, true); //force creation
  }

  default() {
    this.caseLabel = this.defaultCaseLabel;
  }

  getCurrentCollection(caseLabel, createIfNotExists = false) {
    if (caseLabel === this.defaultCaseLabel)
      return this.defaultCollection;
    var currentCollection = null;
    for (let i = 0; i < this.innerCollections.length; i++) {
      currentCollection = this.innerCollections[i];
      if (currentCollection.caseLabel === caseLabel)
        return currentCollection.collection;
    }
    if (createIfNotExists) {
      currentCollection = {
        caseLabel: caseLabel,
        collection: new ValidationRulesCollection(this.config)
      };
      this.innerCollections.push(currentCollection);
      return currentCollection.collection;
    }
    return null;
  }

  validate(newValue, locale) {
    var collection = this.getCurrentCollection(this.conditionExpression(newValue));
    if (collection !== null)
      return collection.validate(newValue, locale);
    else
      return this.defaultCollection.validate(newValue, locale);
  }

  addValidationRule(validationRule) {
    var currentCollection = this.getCurrentCollection(this.caseLabel, true);
    currentCollection.addValidationRule(validationRule);
  }

  addValidationRuleCollection(validationRulesCollection) {
    var currentCollection = this.getCurrentCollection(this.caseLabel, true);
    currentCollection.addValidationRuleCollection(validationRulesCollection);
  }

  isNotEmpty() {
    var collection = this.getCurrentCollection(this.caseLabel);
    if (collection !== null)
      collection.isNotEmpty();
    else
      this.defaultCollection.isNotEmpty();
  }

  canBeEmpty() {
    var collection = this.getCurrentCollection(this.caseLabel);
    if (collection !== null)
      collection.canBeEmpty();
    else
      this.defaultCollection.canBeEmpty();
  }

  withMessage(message) {
    var collection = this.getCurrentCollection(this.caseLabel);
    if (collection !== null)
      collection.withMessage(message);
    else
      this.defaultCollection.withMessage(message);
  }
}

export class ValidationRule {
  constructor(threshold, onValidate, message, ruleName) {
    this.onValidate = onValidate;
    this.threshold = threshold;
    this.message = message;
    this.errorMessage = null;
    this.ruleName = ruleName;
  }

  withMessage(message) {
    this.message = message;
  }

  explain() {
    return this.errorMessage;
  }

  setResult(result, currentValue, locale) {
    if (result === true || result === undefined || result === null || result === '') {
      this.errorMessage = null;
      return true;
    }
    else {
      if (typeof(result) === 'string') {
        this.errorMessage = result;
      }
      else {
        if (this.message) {
          if (typeof(this.message) === 'function') {
            this.errorMessage = this.message(currentValue, this.threshold);
          }
          else if (typeof(this.message) === 'string') {
            this.errorMessage = this.message;
          }
          else
            throw 'Unable to handle the error message:' + this.message;
        }
        else {
          this.errorMessage = locale.translate(this.ruleName, currentValue, this.threshold);
        }
      }
      return false;
    }
  }

  /**
   * Validation rules: return a promise that fulfills and resolves to true/false
   */
  validate(currentValue, locale) {
    if (locale === undefined) {
      locale = ValidationLocale.Repository.default;
    }

    currentValue = Utilities.getValue(currentValue);
    var result = this.onValidate(currentValue, this.threshold, locale);
    var promise = Promise.resolve(result);

    var nextPromise = promise.then(
      (promiseResult) => {
        return this.setResult(promiseResult, currentValue, locale);
      },
      (promiseFailure) => {
        if (typeof(promiseFailure) === 'string' && promiseFailure !== '')
          return this.setResult(promiseFailure, currentValue, locale);
        else
          return this.setResult(false, currentValue, locale);
      }
    );
    return nextPromise;
  }
}

export class URLValidationRule extends ValidationRule {
  //https://github.com/chriso/validator.js/blob/master/LICENSE

  static isIP(str, version) {
    var ipv4Maybe = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/
      , ipv6Block = /^[0-9A-F]{1,4}$/i;

    if (!version) {
      return this.isIP(str, 4) || this.isIP(str, 6);
    } else if (version === 4) {
      if (!ipv4Maybe.test(str)) {
        return false;
      }
      var parts = str.split('.').sort(function (a, b) {
        return a - b;
      });
      return parts[3] <= 255;
    } else if (version === 6) {
      var blocks = str.split(':');
      var foundOmissionBlock = false; // marker to indicate ::

      if (blocks.length > 8)
        return false;

      // initial or final ::
      if (str === '::') {
        return true;
      } else if (str.substr(0, 2) === '::') {
        blocks.shift();
        blocks.shift();
        foundOmissionBlock = true;
      } else if (str.substr(str.length - 2) === '::') {
        blocks.pop();
        blocks.pop();
        foundOmissionBlock = true;
      }

      for (var i = 0; i < blocks.length; ++i) {
        // test for a :: which can not be at the string start/end
        // since those cases have been handled above
        if (blocks[i] === '' && i > 0 && i < blocks.length - 1) {
          if (foundOmissionBlock)
            return false; // multiple :: in address
          foundOmissionBlock = true;
        } else if (!ipv6Block.test(blocks[i])) {
          return false;
        }
      }

      if (foundOmissionBlock) {
        return blocks.length >= 1;
      } else {
        return blocks.length === 8;
      }
    }
    return false;
  }

  static isFQDN(str, options) {
    /* Remove the optional trailing dot before checking validity */
    if (options.allow_trailing_dot && str[str.length - 1] === '.') {
      str = str.substring(0, str.length - 1);
    }
    var parts = str.split('.');
    if (options.require_tld) {
      var tld = parts.pop();
      if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
        return false;
      }
    }
    for (var part, i = 0; i < parts.length; i++) {
      part = parts[i];
      if (options.allow_underscores) {
        if (part.indexOf('__') >= 0) {
          return false;
        }
        part = part.replace(/_/g, '');
      }
      if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
        return false;
      }
      if (part[0] === '-' || part[part.length - 1] === '-' ||
        part.indexOf('---') >= 0) {
        return false;
      }
    }
    return true;
  }

  constructor(threshold) {
    var default_url_options = {
      protocols: ['http', 'https', 'ftp']
      , require_tld: true
      , require_protocol: false
      , allow_underscores: true
      , allow_trailing_dot: false
      , allow_protocol_relative_urls: true
    };
    if (threshold === undefined) {
      threshold = default_url_options;
    }

    super(
      threshold,
      (newValue, threshold) => {
        let url = newValue;
        if (!url || url.length >= 2083 || /\s/.test(url)) {
          return false;
        }
        if (url.indexOf('mailto:') === 0) {
          return false;
        }
        var protocol, auth, host, hostname, port,
          port_str, split;
        split = url.split('://');
        if (split.length > 1) {
          protocol = split.shift();
          if (threshold.protocols.indexOf(protocol) === -1) {
            return false;
          }
        } else if (threshold.require_protocol) {
          return false;
        } else if (threshold.allow_protocol_relative_urls && url.substr(0, 2) === '//') {
          split[0] = url.substr(2);
        }
        url = split.join('://');
        split = url.split('#');
        url = split.shift();

        split = url.split('?');
        url = split.shift();

        split = url.split('/');
        url = split.shift();
        split = url.split('@');
        if (split.length > 1) {
          auth = split.shift();
          if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
            return false;
          }
        }
        hostname = split.join('@');
        split = hostname.split(':');
        host = split.shift();
        if (split.length) {
          port_str = split.join(':');
          port = parseInt(port_str, 10);
          if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
            return false;
          }
        }
        if (!URLValidationRule.isIP(host) && !URLValidationRule.isFQDN(host, threshold) &&
          host !== 'localhost') {
          return false;
        }
        if (threshold.host_whitelist &&
          threshold.host_whitelist.indexOf(host) === -1) {
          return false;
        }
        if (threshold.host_blacklist &&
          threshold.host_blacklist.indexOf(host) !== -1) {
          return false;
        }
        return true;
      },
      null,
      'URLValidationRule'
    );
  }

}

export class EmailValidationRule extends ValidationRule {
  //https://github.com/chriso/validator.js/blob/master/LICENSE
  static testEmailUserUtf8Regex(user) {
    let emailUserUtf8Regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))$/i;
    return emailUserUtf8Regex.test(user);
  }

  static isFQDN(str) {
    var parts = str.split('.');
    for (var part, i = 0; i < parts.length; i++) {
      part = parts[i];
      if (part.indexOf('__') >= 0) {
        return false;
      }
      part = part.replace(/_/g, '');
      if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
        return false;
      }
      if (part[0] === '-' || part[part.length - 1] === '-' ||
        part.indexOf('---') >= 0) {
        return false;
      }
    }
    return true;
  }

  constructor() {
    super(
      null,
      (newValue, threshold) => {
        if (/\s/.test(newValue)) {
          return false;
        }
        var parts = newValue.split('@');
        var domain = parts.pop();
        var user = parts.join('@');

        if (!EmailValidationRule.isFQDN(domain)) {
          return false;
        }
        return EmailValidationRule.testEmailUserUtf8Regex(user);
      },
      null,
      'EmailValidationRule'
    );

  }
}

export class MinimumLengthValidationRule extends ValidationRule {
  constructor(minimumLength) {
    super(
      minimumLength,
      (newValue, minimumLength) => {
        return newValue.length !== undefined && newValue.length >= minimumLength;
      },
      null,
      'MinimumLengthValidationRule'
    );
  }
}

export class MaximumLengthValidationRule extends ValidationRule {
  constructor(maximumLength) {
    super(
      maximumLength,
      (newValue, maximumLength) => {
        return newValue.length !== undefined && newValue.length <= maximumLength;
      },
      null,
      'MaximumLengthValidationRule'
    );
  }
}

export class BetweenLengthValidationRule extends ValidationRule {
  constructor(minimumLength, maximumLength) {
    super(
      {minimumLength: minimumLength, maximumLength: maximumLength},
      (newValue, threshold) => {
        return newValue.length !== undefined
          && newValue.length >= threshold.minimumLength
          && newValue.length <= threshold.maximumLength;
      },
      null,
      'BetweenLengthValidationRule'
    );
  }
}

export class CustomFunctionValidationRule extends ValidationRule {
  constructor(customFunction, threshold) {
    super(
      threshold,
      customFunction,
      null,
      'CustomFunctionValidationRule'
    )
  }
}

export class NumericValidationRule extends ValidationRule {
  constructor() {
    super(
      null,
      (newValue, threshold, locale) => {
        var numericRegex = locale.setting('numericRegex');
        var floatValue = parseFloat(newValue);
        return !Number.isNaN(parseFloat(newValue))
          && Number.isFinite(floatValue)
          && numericRegex.test(newValue);
      },
      null,
      'NumericValidationRule'
    );
  }
}

export class RegexValidationRule extends ValidationRule {
  constructor(regex, ruleName) {
    super(
      regex,
      (newValue, regex) => {
        return regex.test(newValue);
      },
      null,
      ruleName || 'RegexValidationRule'
    );
  }
}

export class ContainsOnlyValidationRule extends RegexValidationRule {
  constructor(regex) {
    super(regex, 'ContainsOnlyValidationRule');
  }
}

export class MinimumValueValidationRule extends ValidationRule {
  constructor(minimumValue) {
    super(
      minimumValue,
      (newValue, minimumValue) => {
        return Utilities.getValue(minimumValue) < newValue;
      },
      null,
      'MinimumValueValidationRule'
    );
  }
}

export class MinimumInclusiveValueValidationRule extends ValidationRule {
  constructor(minimumValue) {
    super(
      minimumValue,
      (newValue, minimumValue) => {
        return Utilities.getValue(minimumValue) <= newValue;
      },
      null,
      'MinimumInclusiveValueValidationRule'
    );
  }
}

export class MaximumValueValidationRule extends ValidationRule {
  constructor(maximumValue) {
    super(
      maximumValue,
      (newValue, maximumValue) => {
        return newValue < Utilities.getValue(maximumValue);
      },
      null,
      'MaximumValueValidationRule'
    );
  }
}

export class MaximumInclusiveValueValidationRule extends ValidationRule {
  constructor(maximumValue) {
    super(
      maximumValue,
      (newValue, maximumValue) => {
        return newValue <= Utilities.getValue(maximumValue);
      },
      null,
      'MaximumInclusiveValueValidationRule'
    );
  }
}

export class BetweenValueValidationRule extends ValidationRule {
  constructor(minimumValue, maximumValue) {
    super(
      {minimumValue: minimumValue, maximumValue: maximumValue},
      (newValue, threshold) => {
        return Utilities.getValue(threshold.minimumValue) <= newValue && newValue <= Utilities.getValue(threshold.maximumValue);
      },
      null,
      'BetweenValueValidationRule'
    );
  }
}

export class DigitValidationRule extends ValidationRule {
  constructor() {
    super(
      null,
      (newValue, threshold) => {
        return /^\d+$/.test(newValue);
      },
      null,
      'DigitValidationRule'
    );
  }
}

export class NoSpacesValidationRule extends ValidationRule {
  constructor() {
    super(
      null,
      (newValue, threshold) => {
        return /^\S*$/.test(newValue);
      },
      null,
      'NoSpacesValidationRule'
    );
  }
}

export class AlphaNumericValidationRule extends ValidationRule {
  constructor() {
    super(
      null,
      (newValue, threshold) => {
        return /^[a-z0-9]+$/i.test(newValue);
      },
      null,
      'AlphaNumericValidationRule'
    );
  }
}

export class AlphaValidationRule extends ValidationRule {
  constructor() {
    super(
      null,
      (newValue, threshold) => {
        return /^[a-z]+$/i.test(newValue);
      },
      null,
      'AlphaValidationRule'
    );
  }
}


export class AlphaOrWhitespaceValidationRule extends ValidationRule {
  constructor() {
    super(
      null,
      (newValue, threshold) => {
        return /^[a-z\s]+$/i.test(newValue);
      },
      null,
      'AlphaOrWhitespaceValidationRule'
    );
  }
}


export class AlphaNumericOrWhitespaceValidationRule extends ValidationRule {
  constructor() {
    super(
      null,
      (newValue, threshold) => {
        return /^[a-z0-9\s]+$/i.test(newValue);
      },
      null,
      'AlphaNumericOrWhitespaceValidationRule'
    );
  }
}

export class MediumPasswordValidationRule extends ValidationRule {
  constructor(minimumComplexityLevel, ruleName) {
    super(
      (minimumComplexityLevel) ? minimumComplexityLevel : 3,
      (newValue, threshold) => {
        if (typeof (newValue) !== 'string')
          return false;
        var strength = 0;

        strength += /[A-Z]+/.test(newValue) ? 1 : 0;
        strength += /[a-z]+/.test(newValue) ? 1 : 0;
        strength += /[0-9]+/.test(newValue) ? 1 : 0;
        strength += /[\W]+/.test(newValue) ? 1 : 0;
        return strength >= threshold;
      },
      null,
      ruleName || 'MediumPasswordValidationRule'
    );
  }
}


export class StrongPasswordValidationRule extends MediumPasswordValidationRule {
  constructor() {
    super(4, 'StrongPasswordValidationRule');
  }
}

export class EqualityValidationRuleBase extends ValidationRule {
  constructor(otherValue, equality, otherValueLabel, ruleName) {
    super(
      {
        otherValue: otherValue,
        equality: equality,
        otherValueLabel: otherValueLabel
      },
      (newValue, threshold) => {
        var otherValue = Utilities.getValue(threshold.otherValue);
        if (newValue instanceof Date && otherValue instanceof Date)
          return threshold.equality === (newValue.getTime() === otherValue.getTime());
        return threshold.equality === (newValue === otherValue);
      },
      null,
      ruleName || 'EqualityValidationRuleBase'
    );
  }
}

export class EqualityValidationRule extends EqualityValidationRuleBase {
  constructor(otherValue) {
    super(otherValue, true, null, 'EqualityValidationRule');
  }
}

export class EqualityWithOtherLabelValidationRule extends EqualityValidationRuleBase {
  constructor(otherValue, otherLabel) {
    super(otherValue, true, otherLabel, 'EqualityWithOtherLabelValidationRule');
  }
}

export class InEqualityValidationRule extends EqualityValidationRuleBase {
  constructor(otherValue) {
    super(otherValue, false, null, 'InEqualityValidationRule');
  }
}

export class InEqualityWithOtherLabelValidationRule extends EqualityValidationRuleBase {
  constructor(otherValue, otherLabel) {
    super(otherValue, false, otherLabel, 'InEqualityWithOtherLabelValidationRule');
  }
}


export class InCollectionValidationRule extends ValidationRule {
  constructor(collection) {
    super(
      collection,
      (newValue, threshold) => {
        var collection = Utilities.getValue(threshold);
        for (let i = 0; i < collection.length; i++) {
          if (newValue === collection[i])
            return true;
        }
        return false;
      },
      null,
      'InCollectionValidationRule'
    );
  }
}

/**
 * A lightweight validation plugin
 * @class Validation
 * @constructor
 */
@inject(ObserverLocator)
export class Validation {
  /**
   * Instantiates a new {Validation}
   * @param observerLocator the observerLocator used to observer properties
   * @param validationConfig the configuration
   */
  constructor(observerLocator, validationConfig) {
    this.observerLocator = observerLocator;
    this.config = validationConfig ? validationConfig : Validation.defaults;
  }

  /**
   * Returns a new validation group on the subject
   * @param subject The subject to validate
   * @returns {ValidationGroup} A ValidationGroup that encapsulates the validation rules and current validation state for this subject
   */
  on(subject, configCallback) {
    var conf = new ValidationConfig(this.config);
    if(configCallback !== null && configCallback !== undefined && typeof(configCallback) === 'function')
    {
      configCallback(conf);
    }
    return new ValidationGroup(subject, this.observerLocator, conf);
  }

  onBreezeEntity(breezeEntity, configCallback){
    var validation = this.on(breezeEntity, configCallback);
    validation.onBreezeEntity();
    return validation;
  }
}
Validation.defaults = new ValidationConfig();

export let data = {
  settings: {
    'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
  },
  messages: {
    'isRequired': 'is required',
    'onValidateCallback' : 'not a valid value',
    'AlphaNumericOrWhitespaceValidationRule': (newValue, threshold) => {
      return `can contain only alphanumerical characters or spaces`;
    },
    'AlphaNumericValidationRule': (newValue, threshold) => {
      return `can contain only alphanumerical characters`;
    },
    'AlphaValidationRule' : (newValue, threshold) => {
      return `can contain only letters`;
    },
    'AlphaOrWhitespaceValidationRule' : (newValue, threshold) => {
      return `can contain only letters or spaces`;
    },
    'BetweenLengthValidationRule': (newValue, threshold) => {
      return `needs to be between ${Utilities.getValue(threshold.minimumLength)} and ${Utilities.getValue(threshold.maximumLength)} characters long`;
    },
    'BetweenValueValidationRule': (newValue, threshold) => {
      return `needs to be between ${Utilities.getValue(threshold.minimumValue)} and ${Utilities.getValue(threshold.maximumValue)}`;
    },
    'CustomFunctionValidationRule': (newValue, threshold) => {
      return `not a valid value`
    },
    'DigitValidationRule': (newValue, threshold) => {
      return `can contain only digits`;
    },
    'EmailValidationRule': (newValue, threshold) => {
      return `is not a valid email address`;
    },
    'EqualityValidationRule': (newValue, threshold) => {
      return `should be ${Utilities.getValue(threshold.otherValue)}`;
    },
    'InEqualityValidationRule' : (newValue, threshold) => {
        return `cannot be ${Utilities.getValue(threshold.otherValue)}`;
    },
    'EqualityWithOtherLabelValidationRule': (newValue, threshold) => {
      return `does not match ${Utilities.getValue(threshold.otherValueLabel)}`;
    },
    'InEqualityWithOtherLabelValidationRule' : (newValue, threshold) => {
      return `cannot match ${Utilities.getValue(threshold.otherValueLabel)}`;
    },
    'InCollectionValidationRule': (newValue, threshold) => {
      return `not a valid value`;
    },
    'MinimumInclusiveValueValidationRule' : (newValue, threshold) => {
      return `needs to be ${Utilities.getValue(threshold)} or more`;
    },
    'MinimumLengthValidationRule': (newValue, threshold) => {
      return `needs to be at least ${Utilities.getValue(threshold)} characters long`;
    },
    'MinimumValueValidationRule': (newValue, threshold) => {
      return `needs to be more than ${Utilities.getValue(threshold)}`;
    },
    'MaximumInclusiveValueValidationRule' : (newValue, threshold) => {
      return `needs to be ${Utilities.getValue(threshold)} or less`;
    },
    'MaximumLengthValidationRule': (newValue, threshold) => {
      return `cannot be longer then ${Utilities.getValue(threshold)} characters`;
    },
    'MaximumValueValidationRule': (newValue, threshold) => {
      return `needs to be less than ${Utilities.getValue(threshold)}`;
    },
    'NumericValidationRule': (newValue, threshold) => {
      return `needs to be a number`;
    },
    'NoSpacesValidationRule' : (newValue, threshold) => {
      return `cannot contain spaces`;
    },
    'RegexValidationRule': (newValue, threshold) => {
      return `not a valid value`;
    },
    'ContainsOnlyValidationRule': (newValue, threshold) => {
      return `not a valid value`;
    },
    'StrongPasswordValidationRule': (newValue, threshold) => {
      return `should contain a combination of lowercase letters, uppercase letters, digits and special characters`;
    },
    'MediumPasswordValidationRule' : (newValue, threshold) => {
      return `should contain at least ${Utilities.getValue(threshold)} of the following groups: lowercase letters, uppercase letters, digits or special characters`;
    },
    'URLValidationRule' : (newValue, threshold) =>{
      return `is not a valid URL`
    }
  }
};
