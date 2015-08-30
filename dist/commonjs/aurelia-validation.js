'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.ensure = ensure;
exports.configure = configure;

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaMetadata = require('aurelia-metadata');

var _aureliaBinding = require('aurelia-binding');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTemplating = require('aurelia-templating');

var Debouncer = (function () {
  function Debouncer(debounceTimeout) {
    _classCallCheck(this, Debouncer);

    this.currentFunction = null;
    this.debounceTimeout = debounceTimeout;
  }

  Debouncer.prototype.debounce = function debounce(func) {
    var _this = this;

    this.currentFunction = func;
    setTimeout(function () {
      if (func !== null && func !== undefined) {
        if (func === _this.currentFunction) {
          _this.currentFunction = null;
          func();
        }
      }
    }, this.debounceTimeout);
  };

  return Debouncer;
})();

exports.Debouncer = Debouncer;

var ValidationMetadata = (function () {
  _createClass(ValidationMetadata, null, [{
    key: 'metadataKey',
    value: 'aurelia:validation',
    enumerable: true
  }]);

  function ValidationMetadata() {
    _classCallCheck(this, ValidationMetadata);

    this.properties = [];
  }

  ValidationMetadata.prototype.getOrCreateProperty = function getOrCreateProperty(propertyName) {
    var property = this.properties.find(function (x) {
      return x.propertyName === propertyName;
    });
    if (property === undefined) {
      property = new ValidationPropertyMetadata(propertyName);
      this.properties.push(property);
    }
    return property;
  };

  ValidationMetadata.prototype.setup = function setup(validation) {
    this.properties.forEach(function (property) {
      property.setup(validation);
    });
  };

  return ValidationMetadata;
})();

exports.ValidationMetadata = ValidationMetadata;

var ValidationPropertyMetadata = (function () {
  function ValidationPropertyMetadata(propertyName) {
    _classCallCheck(this, ValidationPropertyMetadata);

    this.propertyName = propertyName;
    this.setupSteps = [];
  }

  ValidationPropertyMetadata.prototype.addSetupStep = function addSetupStep(setupStep) {
    this.setupSteps.push(setupStep);
  };

  ValidationPropertyMetadata.prototype.setup = function setup(validation) {
    validation.ensure(this.propertyName);
    this.setupSteps.forEach(function (setupStep) {
      setupStep(validation);
    });
  };

  return ValidationPropertyMetadata;
})();

function ensure(setupStep) {
  return function (target, propertyName) {
    var validationMetadata = _aureliaMetadata.Metadata.getOrCreateOwn(ValidationMetadata.metadataKey, ValidationMetadata, target);
    var property = validationMetadata.getOrCreateProperty(propertyName);
    property.addSetupStep(setupStep);
  };
}

function configure(aurelia, configCallback) {

  aurelia.globalResources('./validate-custom-attribute');
  if (configCallback !== undefined && typeof configCallback === 'function') {
    configCallback(Validation.defaults);
  }
  aurelia.singleton(ValidationConfig, Validation.defaults);
  return Validation.defaults.locale();
}

var PathObserver = (function () {
  function PathObserver(observerLocator, subject, path) {
    _classCallCheck(this, PathObserver);

    this.observerLocator = observerLocator;
    this.path = path.split('.');
    this.subject = subject;
    this.observers = [];
    this.callbacks = [];
    if (this.path.length > 1) this.observeParts();
  }

  PathObserver.prototype.observeParts = function observeParts(propertyName) {
    var _this2 = this;

    if (propertyName !== undefined && propertyName !== null) {
      for (var i = this.observers.length - 1; i >= 0; i--) {
        var currentObserver = this.observers[i];
        if (currentObserver.propertyName === propertyName) {
          break;
        }
        var observer = this.observers.pop();
        if (observer && observer.subscription) {
          observer.subscription();
        }
      }
    }

    var currentSubject = this.subject;

    var observersAreComplete = this.observers.length === this.path.length;

    var _loop = function (i) {
      var observer = _this2.observers[i];
      if (!observer) {

        var currentPath = _this2.path[i];
        observer = _this2.observerLocator.getObserver(currentSubject, currentPath);
        _this2.observers.push(observer);
        var subscription = observer.subscribe(function (newValue, oldValue) {
          _this2.observeParts(observer.propertyName);
        });
        observer.subscription = subscription;
      }

      var currentValue = observer.getValue();
      if (currentValue === undefined || currentValue === null) {
        return 'break';
      } else {
        currentSubject = currentValue;
      }
    };

    for (var i = 0; i < this.path.length; i++) {
      var _ret = _loop(i);

      if (_ret === 'break') break;
    }

    if (!observersAreComplete && this.observers.length === this.path.length) {
      var actualObserver = this.observers[this.observers.length - 1];
      for (var i = 0; i < this.callbacks.length; i++) {
        actualObserver.subscribe(this.callbacks[i]);
      }
    }
  };

  PathObserver.prototype.observePart = function observePart(part) {
    if (part !== this.path[this.path.length - 1]) {
      this.observeParts();
    }
  };

  PathObserver.prototype.getObserver = function getObserver() {
    if (this.path.length == 1) {
      var resolve = this.subject[this.path[0]];
      return this.observerLocator.getObserver(this.subject, this.path[0]);
    }
    return this;
  };

  PathObserver.prototype.getValue = function getValue() {
    var expectedSubject = this.subject;
    for (var i = 0; this.path.length; i++) {
      var currentObserver = this.observers[i];
      if (currentObserver === null || currentObserver === undefined) {
        this.observeParts(this.path[i]);
        currentObserver = this.observers[i];

        if (currentObserver === null || currentObserver === undefined) {
          break;
        }
      }
      if (currentObserver.obj !== expectedSubject) {
          this.observeParts(this.path[i - 1]);
          break;
        }
      expectedSubject = currentObserver.getValue();
    }

    if (this.observers.length !== this.path.length) return undefined;
    var value = this.observers[this.observers.length - 1].getValue();
    return value;
  };

  PathObserver.prototype.subscribe = function subscribe(callback) {
    var _this3 = this;

    this.callbacks.unshift(callback);
    if (this.observers.length === this.path.length) {
      this.subscription = this.observers[this.observers.length - 1].subscribe(callback);
      return function () {
        return _this3.unsubscribe();
      };
    }
  };

  PathObserver.prototype.unsubscribe = function unsubscribe() {
    this.callbacks = [];
    if (this.subscription) this.subscription();
    for (var i = this.observers.length - 1; i >= 0; i--) {
      var observer = this.observers.pop();
      if (observer && observer.subscription) {
        observer.subscription();
      }
    }
  };

  return PathObserver;
})();

exports.PathObserver = PathObserver;

var Utilities = (function () {
  function Utilities() {
    _classCallCheck(this, Utilities);
  }

  Utilities.getValue = function getValue(val) {
    if (val !== undefined && typeof val === 'function') {
      return val();
    }
    return val;
  };

  Utilities.isEmptyValue = function isEmptyValue(val) {
    if (val === undefined) {
      return true;
    }
    if (val === null) {
      return true;
    }
    if (val === "") {
      return true;
    }
    if (typeof val === 'string') {
      if (String.prototype.trim) {
        val = val.trim();
      } else {
        val = val.replace(/^\s+|\s+$/g, '');
      }
    }

    if (val.length !== undefined) {
      return 0 === val.length;
    }
    return false;
  };

  return Utilities;
})();

exports.Utilities = Utilities;
;

var ValidateCustomAttributeViewStrategyBase = (function () {
  function ValidateCustomAttributeViewStrategyBase() {
    _classCallCheck(this, ValidateCustomAttributeViewStrategyBase);

    this.bindingPathAttributes = ['validate', 'value.bind', 'value.two-way'];
  }

  ValidateCustomAttributeViewStrategyBase.prototype.getValidationProperty = function getValidationProperty(validation, element) {
    var atts = element.attributes;
    for (var i = 0; i < this.bindingPathAttributes.length; i++) {
      var attributeName = this.bindingPathAttributes[i];
      if (atts[attributeName]) {
        var bindingPath = atts[attributeName].value.trim();
        if (bindingPath.indexOf('|') != -1) bindingPath = bindingPath.split('|')[0].trim();
        var validationProperty = validation.result.properties[bindingPath];

        if (attributeName == 'validate' && (validationProperty === null || validationProperty === undefined)) {
          validation.ensure(bindingPath);
          validationProperty = validation.result.properties[bindingPath];
        }
        return validationProperty;
      }
    }
    return null;
  };

  ValidateCustomAttributeViewStrategyBase.prototype.prepareElement = function prepareElement(validationProperty, element) {
    throw Error('View strategy must implement prepareElement(validationProperty, element)');
  };

  ValidateCustomAttributeViewStrategyBase.prototype.updateElement = function updateElement(validationProperty, element) {
    throw Error('View strategy must implement updateElement(validationProperty, element)');
  };

  return ValidateCustomAttributeViewStrategyBase;
})();

exports.ValidateCustomAttributeViewStrategyBase = ValidateCustomAttributeViewStrategyBase;

var TWBootstrapViewStrategy = (function (_ValidateCustomAttributeViewStrategyBase) {
  _inherits(TWBootstrapViewStrategy, _ValidateCustomAttributeViewStrategyBase);

  function TWBootstrapViewStrategy(appendMessageToInput, appendMessageToLabel, helpBlockClass) {
    _classCallCheck(this, TWBootstrapViewStrategy);

    _ValidateCustomAttributeViewStrategyBase.call(this);
    this.appendMessageToInput = appendMessageToInput;
    this.appendMessageToLabel = appendMessageToLabel;
    this.helpBlockClass = helpBlockClass;
  }

  TWBootstrapViewStrategy.prototype.searchFormGroup = function searchFormGroup(currentElement, currentDepth) {
    if (currentDepth === 5) {
      return null;
    }
    if (currentElement.classList && currentElement.classList.contains('form-group')) {
      return currentElement;
    }
    return this.searchFormGroup(currentElement.parentNode, 1 + currentDepth);
  };

  TWBootstrapViewStrategy.prototype.findLabels = function findLabels(formGroup, inputId) {
    var labels = [];
    this.findLabelsRecursively(formGroup, inputId, labels, 0);
    return labels;
  };

  TWBootstrapViewStrategy.prototype.findLabelsRecursively = function findLabelsRecursively(currentElement, inputId, currentLabels, currentDepth) {
    if (currentDepth === 5) {
      return;
    }
    if (currentElement.nodeName === "LABEL" && (currentElement.attributes['for'] && currentElement.attributes['for'].value === inputId || !currentElement.attributes['for'])) {
      currentLabels.push(currentElement);
    }

    for (var i = 0; i < currentElement.children.length; i++) {
      this.findLabelsRecursively(currentElement.children[i], inputId, currentLabels, 1 + currentDepth);
    }
  };

  TWBootstrapViewStrategy.prototype.appendMessageToElement = function appendMessageToElement(element, validationProperty) {
    var helpBlock = element.nextSibling;
    if (helpBlock) {
      if (!helpBlock.classList) {
        helpBlock = null;
      } else if (!helpBlock.classList.contains(this.helpBlockClass)) {
        helpBlock = null;
      }
    }

    if (!helpBlock) {
      helpBlock = document.createElement("p");
      helpBlock.classList.add('help-block');
      helpBlock.classList.add(this.helpBlockClass);

      if (element.nextSibling) {
        element.parentNode.insertBefore(helpBlock, element.nextSibling);
      } else {
        element.parentNode.appendChild(helpBlock);
      }
    }
    if (validationProperty) helpBlock.textContent = validationProperty.message;else helpBlock.textContent = '';
  };

  TWBootstrapViewStrategy.prototype.appendUIVisuals = function appendUIVisuals(validationProperty, currentElement) {
    var formGroup = this.searchFormGroup(currentElement, 0);
    if (formGroup) {
      if (validationProperty && validationProperty.isDirty) {
        if (validationProperty.isValid) {
          formGroup.classList.remove('has-warning');
          formGroup.classList.add('has-success');
        } else {
          formGroup.classList.remove('has-success');
          formGroup.classList.add('has-warning');
        }
      } else {
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
  };

  TWBootstrapViewStrategy.prototype.prepareElement = function prepareElement(validationProperty, element) {
    this.appendUIVisuals(null, element);
  };

  TWBootstrapViewStrategy.prototype.updateElement = function updateElement(validationProperty, element) {
    this.appendUIVisuals(validationProperty, element);
  };

  return TWBootstrapViewStrategy;
})(ValidateCustomAttributeViewStrategyBase);

exports.TWBootstrapViewStrategy = TWBootstrapViewStrategy;

var ValidateCustomAttributeViewStrategy = function ValidateCustomAttributeViewStrategy() {
  _classCallCheck(this, ValidateCustomAttributeViewStrategy);
};

exports.ValidateCustomAttributeViewStrategy = ValidateCustomAttributeViewStrategy;

ValidateCustomAttributeViewStrategy.TWBootstrapAppendToInput = new TWBootstrapViewStrategy(true, false, 'aurelia-validation-message');
ValidateCustomAttributeViewStrategy.TWBootstrapAppendToMessage = new TWBootstrapViewStrategy(false, true, 'aurelia-validation-message');

var ValidateCustomAttribute = (function () {
  function ValidateCustomAttribute(element) {
    _classCallCheck(this, _ValidateCustomAttribute);

    this.element = element;
    this.processedValidation = null;
    this.viewStrategy = null;
  }

  ValidateCustomAttribute.prototype.valueChanged = function valueChanged(newValue) {
    if (this.value === null || this.value === undefined) return;
    this.processedValidation = this.value;
    if (typeof this.value === 'string') {
      return;
    } else {
        this.subscribeChangedHandlers(this.element);
      }
  };

  ValidateCustomAttribute.prototype.subscribeChangedHandlers = function subscribeChangedHandlers(currentElement) {
    var _this4 = this;

    this.viewStrategy = this.value.config.getViewStrategy();
    var validationProperty = this.viewStrategy.getValidationProperty(this.value, currentElement);
    if (validationProperty !== null && validationProperty !== undefined) {
      this.viewStrategy.prepareElement(validationProperty, currentElement);
      validationProperty.onValidate(function (vp) {
        _this4.viewStrategy.updateElement(vp, currentElement);
      });
    }
    var children = currentElement.children;
    for (var i = 0; i < children.length; i++) {
      this.subscribeChangedHandlers(children[i]);
    }
  };

  ValidateCustomAttribute.prototype.detached = function detached() {};

  ValidateCustomAttribute.prototype.attached = function attached() {
    if (this.processedValidation === null || this.processedValidation === undefined) this.valueChanged(this.value);
  };

  var _ValidateCustomAttribute = ValidateCustomAttribute;
  ValidateCustomAttribute = _aureliaDependencyInjection.inject(Element)(ValidateCustomAttribute) || ValidateCustomAttribute;
  ValidateCustomAttribute = _aureliaTemplating.customAttribute('validate')(ValidateCustomAttribute) || ValidateCustomAttribute;
  return ValidateCustomAttribute;
})();

exports.ValidateCustomAttribute = ValidateCustomAttribute;

var ValidationConfigDefaults = function ValidationConfigDefaults() {
  _classCallCheck(this, ValidationConfigDefaults);
};

exports.ValidationConfigDefaults = ValidationConfigDefaults;

ValidationConfigDefaults._defaults = {
  debounceTimeout: 0,
  dependencies: [],
  locale: 'en-US',
  localeResources: 'aurelia-validation/resources/',
  viewStrategy: ValidateCustomAttributeViewStrategy.TWBootstrapAppendToMessage,
  allPropertiesAreMandatory: false
};
ValidationConfigDefaults.defaults = function () {
  var defaults = {};
  Object.assign(defaults, ValidationConfigDefaults._defaults);
  return defaults;
};

var ValidationConfig = (function () {
  function ValidationConfig(innerConfig) {
    _classCallCheck(this, ValidationConfig);

    this.innerConfig = innerConfig;
    this.values = this.innerConfig ? {} : ValidationConfigDefaults.defaults();
    this.changedHandlers = new Map();
  }

  ValidationConfig.prototype.getValue = function getValue(identifier) {
    if (this.values.hasOwnProperty(identifier) !== null && this.values[identifier] !== undefined) {
      return this.values[identifier];
    }
    if (this.innerConfig !== null) {
      return this.innerConfig.getValue(identifier);
    }
    throw Error('Config not found: ' + identifier);
  };

  ValidationConfig.prototype.setValue = function setValue(identifier, value) {
    this.values[identifier] = value;
    return this;
  };

  ValidationConfig.prototype.onLocaleChanged = function onLocaleChanged(callback) {
    var _this5 = this;

    if (this.innerConfig !== undefined) {
      return this.innerConfig.onLocaleChanged(callback);
    } else {
      var _ret2 = (function () {
        var id = ++ValidationConfig.uniqueListenerId;
        _this5.changedHandlers.set(id, callback);
        return {
          v: function () {
            _this5.changedHandlers['delete'](id);
          }
        };
      })();

      if (typeof _ret2 === 'object') return _ret2.v;
    }
  };

  ValidationConfig.prototype.getDebounceTimeout = function getDebounceTimeout() {
    return this.getValue('debounceTimeout');
  };

  ValidationConfig.prototype.useDebounceTimeout = function useDebounceTimeout(value) {
    return this.setValue('debounceTimeout', value);
  };

  ValidationConfig.prototype.getDependencies = function getDependencies() {
    return this.getValue('dependencies');
  };

  ValidationConfig.prototype.computedFrom = function computedFrom(dependencies) {
    var deps = dependencies;
    if (typeof dependencies === 'string') {
      deps = [];
      deps.push(dependencies);
    }
    return this.setValue('dependencies', deps);
  };

  ValidationConfig.prototype.useLocale = function useLocale(localeIdentifier) {
    this.setValue('locale', localeIdentifier);
    var callbacks = Array.from(this.changedHandlers.values());
    for (var i = 0; i < callbacks.length; i++) {
      callbacks[i]();
    }
    return this;
  };

  ValidationConfig.prototype.locale = function locale() {
    return ValidationLocale.Repository.load(this.getValue('locale'), this.getValue('localeResources'));
  };

  ValidationConfig.prototype.useViewStrategy = function useViewStrategy(viewStrategy) {
    return this.setValue('viewStrategy', viewStrategy);
  };

  ValidationConfig.prototype.getViewStrategy = function getViewStrategy() {
    return this.getValue('viewStrategy');
  };

  ValidationConfig.prototype.treatAllPropertiesAsMandatory = function treatAllPropertiesAsMandatory() {
    this.setValue('allPropertiesAreMandatory', true);
    return this;
  };

  ValidationConfig.prototype.treatAllPropertiesAsOptional = function treatAllPropertiesAsOptional() {
    this.setValue('allPropertiesAreMandatory', false);
    return this;
  };

  return ValidationConfig;
})();

exports.ValidationConfig = ValidationConfig;

ValidationConfig.uniqueListenerId = 0;

var ValidationGroupBuilder = (function () {
  function ValidationGroupBuilder(observerLocator, validationGroup) {
    _classCallCheck(this, ValidationGroupBuilder);

    this.observerLocator = observerLocator;
    this.validationRuleCollections = [];
    this.validationGroup = validationGroup;
  }

  ValidationGroupBuilder.prototype.ensure = function ensure(propertyName, configurationCallback) {
    var newValidationProperty = null;
    this.validationRuleCollections = [];

    for (var i = 0; i < this.validationGroup.validationProperties.length; i++) {
      if (this.validationGroup.validationProperties[i].propertyName === propertyName) {
        newValidationProperty = this.validationGroup.validationProperties[i];
        if (configurationCallback !== undefined && typeof configurationCallback === 'function') {
          throw Error('When creating validation rules on binding path ' + propertyName + ' a configuration callback function was provided, but validation rules have previously already been instantiated for this binding path');
        }
        break;
      }
    }
    if (newValidationProperty === null) {
      var propertyResult = this.validationGroup.result.addProperty(propertyName);
      var config = new ValidationConfig(this.validationGroup.config);
      if (configurationCallback !== undefined && typeof configurationCallback === 'function') {
        configurationCallback(config);
      }
      newValidationProperty = new ValidationProperty(this.observerLocator, propertyName, this.validationGroup, propertyResult, config);
      this.validationGroup.validationProperties.push(newValidationProperty);
    }
    this.validationRuleCollections.unshift(newValidationProperty.collectionOfValidationRules);
    return this.validationGroup;
  };

  ValidationGroupBuilder.prototype.isNotEmpty = function isNotEmpty() {
    this.validationRuleCollections[0].isNotEmpty();
    this.checkLast();
    return this.validationGroup;
  };

  ValidationGroupBuilder.prototype.canBeEmpty = function canBeEmpty() {
    this.validationRuleCollections[0].canBeEmpty();
    this.checkLast();
    return this.validationGroup;
  };

  ValidationGroupBuilder.prototype.isGreaterThan = function isGreaterThan(minimumValue) {
    return this.passesRule(new MinimumValueValidationRule(minimumValue));
  };

  ValidationGroupBuilder.prototype.isGreaterThanOrEqualTo = function isGreaterThanOrEqualTo(minimumValue) {
    return this.passesRule(new MinimumInclusiveValueValidationRule(minimumValue));
  };

  ValidationGroupBuilder.prototype.isBetween = function isBetween(minimumValue, maximumValue) {
    return this.passesRule(new BetweenValueValidationRule(minimumValue, maximumValue));
  };

  ValidationGroupBuilder.prototype.isIn = function isIn(collection) {
    return this.passesRule(new InCollectionValidationRule(collection));
  };

  ValidationGroupBuilder.prototype.isLessThan = function isLessThan(maximumValue) {
    return this.passesRule(new MaximumValueValidationRule(maximumValue));
  };

  ValidationGroupBuilder.prototype.isLessThanOrEqualTo = function isLessThanOrEqualTo(maximumValue) {
    return this.passesRule(new MaximumInclusiveValueValidationRule(maximumValue));
  };

  ValidationGroupBuilder.prototype.isEqualTo = function isEqualTo(otherValue, otherValueLabel) {
    if (!otherValueLabel) {
      return this.passesRule(new EqualityValidationRule(otherValue));
    } else {
      return this.passesRule(new EqualityWithOtherLabelValidationRule(otherValue, otherValueLabel));
    }
  };

  ValidationGroupBuilder.prototype.isNotEqualTo = function isNotEqualTo(otherValue, otherValueLabel) {
    if (!otherValueLabel) {
      return this.passesRule(new InEqualityValidationRule(otherValue));
    } else {
      return this.passesRule(new InEqualityWithOtherLabelValidationRule(otherValue, otherValueLabel));
    }
  };

  ValidationGroupBuilder.prototype.isEmail = function isEmail() {
    return this.passesRule(new EmailValidationRule());
  };

  ValidationGroupBuilder.prototype.isURL = function isURL() {
    return this.passesRule(new URLValidationRule());
  };

  ValidationGroupBuilder.prototype.hasMinLength = function hasMinLength(minimumValue) {
    return this.passesRule(new MinimumLengthValidationRule(minimumValue));
  };

  ValidationGroupBuilder.prototype.hasMaxLength = function hasMaxLength(maximumValue) {
    return this.passesRule(new MaximumLengthValidationRule(maximumValue));
  };

  ValidationGroupBuilder.prototype.hasLengthBetween = function hasLengthBetween(minimumValue, maximumValue) {
    return this.passesRule(new BetweenLengthValidationRule(minimumValue, maximumValue));
  };

  ValidationGroupBuilder.prototype.isNumber = function isNumber() {
    return this.passesRule(new NumericValidationRule());
  };

  ValidationGroupBuilder.prototype.containsNoSpaces = function containsNoSpaces() {
    return this.passesRule(new NoSpacesValidationRule());
  };

  ValidationGroupBuilder.prototype.containsOnlyDigits = function containsOnlyDigits() {
    return this.passesRule(new DigitValidationRule());
  };

  ValidationGroupBuilder.prototype.containsOnlyAlpha = function containsOnlyAlpha() {
    return this.passesRule(new AlphaValidationRule());
  };

  ValidationGroupBuilder.prototype.containsOnlyAlphaOrWhitespace = function containsOnlyAlphaOrWhitespace() {
    return this.passesRule(new AlphaOrWhitespaceValidationRule());
  };

  ValidationGroupBuilder.prototype.containsOnlyAlphanumerics = function containsOnlyAlphanumerics() {
    return this.passesRule(new AlphaNumericValidationRule());
  };

  ValidationGroupBuilder.prototype.containsOnlyAlphanumericsOrWhitespace = function containsOnlyAlphanumericsOrWhitespace() {
    return this.passesRule(new AlphaNumericOrWhitespaceValidationRule());
  };

  ValidationGroupBuilder.prototype.isStrongPassword = function isStrongPassword(minimumComplexityLevel) {
    if (minimumComplexityLevel === 4) {
      return this.passesRule(new StrongPasswordValidationRule());
    } else {
      return this.passesRule(new MediumPasswordValidationRule(minimumComplexityLevel));
    }
  };

  ValidationGroupBuilder.prototype.containsOnly = function containsOnly(regex) {
    return this.passesRule(new ContainsOnlyValidationRule(regex));
  };

  ValidationGroupBuilder.prototype.matches = function matches(regex) {
    return this.passesRule(new RegexValidationRule(regex));
  };

  ValidationGroupBuilder.prototype.passes = function passes(customFunction, threshold) {
    return this.passesRule(new CustomFunctionValidationRule(customFunction, threshold));
  };

  ValidationGroupBuilder.prototype.passesRule = function passesRule(validationRule) {

    this.validationRuleCollections[0].addValidationRule(validationRule);
    this.checkLast();
    return this.validationGroup;
  };

  ValidationGroupBuilder.prototype.checkLast = function checkLast() {
    var validationProperty = this.validationGroup.validationProperties[this.validationGroup.validationProperties.length - 1];
    validationProperty.validateCurrentValue(false);
  };

  ValidationGroupBuilder.prototype.withMessage = function withMessage(message) {
    this.validationRuleCollections[0].withMessage(message);
    this.checkLast();
    return this.validationGroup;
  };

  ValidationGroupBuilder.prototype['if'] = function _if(conditionExpression) {
    var conditionalCollection = new SwitchCaseValidationRulesCollection(conditionExpression);
    conditionalCollection['case'](true);
    this.validationRuleCollections[0].addValidationRuleCollection(conditionalCollection);
    this.validationRuleCollections.unshift(conditionalCollection);
    return this.validationGroup;
  };

  ValidationGroupBuilder.prototype['else'] = function _else() {
    if (!this.validationRuleCollections[0]['default']) {
      throw 'Invalid statement: \'else\'';
    }

    this.validationRuleCollections[0]['default']();
    return this.validationGroup;
  };

  ValidationGroupBuilder.prototype.endIf = function endIf() {
    if (!this.validationRuleCollections[0]['default']) {
      throw 'Invalid statement: \'endIf\'';
    }
    this.validationRuleCollections.shift();
    this.checkLast();
    return this.validationGroup;
  };

  ValidationGroupBuilder.prototype['switch'] = function _switch(conditionExpression) {
    var _this6 = this;

    var condition = conditionExpression;
    if (condition === undefined) {
      (function () {
        var observer = _this6.validationGroup.validationProperties[_this6.validationGroup.validationProperties.length - 1].observer;
        condition = function () {
          return observer.getValue();
        };
      })();
    }
    var conditionalCollection = new SwitchCaseValidationRulesCollection(condition);
    this.validationRuleCollections[0].addValidationRuleCollection(conditionalCollection);
    this.validationRuleCollections.unshift(conditionalCollection);
    return this.validationGroup;
  };

  ValidationGroupBuilder.prototype['case'] = function _case(caseLabel) {
    if (!this.validationRuleCollections[0]['default']) {
      throw 'Invalid statement: \'case\'';
    }

    this.validationRuleCollections[0]['case'](caseLabel);
    return this.validationGroup;
  };

  ValidationGroupBuilder.prototype['default'] = function _default() {
    if (!this.validationRuleCollections[0]['default']) {
      throw 'Invalid statement: \'case\'';
    }

    this.validationRuleCollections[0]['default']();
    return this.validationGroup;
  };

  ValidationGroupBuilder.prototype.endSwitch = function endSwitch() {
    if (!this.validationRuleCollections[0]['default']) {
      throw 'Invalid statement: \'endIf\'';
    }

    this.validationRuleCollections.shift();
    this.checkLast();
    return this.validationGroup;
  };

  return ValidationGroupBuilder;
})();

exports.ValidationGroupBuilder = ValidationGroupBuilder;

var ValidationGroup = (function () {
  function ValidationGroup(subject, observerLocator, config) {
    var _this7 = this;

    _classCallCheck(this, ValidationGroup);

    this.result = new ValidationResult();
    this.subject = subject;
    this.validationProperties = [];
    this.config = config;
    this.builder = new ValidationGroupBuilder(observerLocator, this);
    this.onValidateCallbacks = [];
    this.onPropertyValidationCallbacks = [];
    this.isValidating = false;
    this.onDestroy = config.onLocaleChanged(function () {
      _this7.validate(false, true);
    });

    var validationMetadata = _aureliaMetadata.Metadata.getOwn(ValidationMetadata.metadataKey, this.subject);
    if (validationMetadata) {
      validationMetadata.setup(this);
    }
  }

  ValidationGroup.prototype.destroy = function destroy() {
    for (var i = this.validationProperties.length - 1; i >= 0; i--) {
      this.validationProperties[i].destroy();
    }
    this.onDestroy();
  };

  ValidationGroup.prototype.clear = function clear() {
    this.validationProperties.forEach(function (prop) {
      prop.clear();
    });
    this.result.clear();
  };

  ValidationGroup.prototype.onBreezeEntity = function onBreezeEntity() {
    var _this8 = this;

    var breezeEntity = this.subject;
    var me = this;
    this.onPropertyValidate(function (propertyBindingPath) {
      _this8.passes(function () {
        breezeEntity.entityAspect.validateProperty(propertyBindingPath);
        var errors = breezeEntity.entityAspect.getValidationErrors(propertyBindingPath);
        if (errors.length === 0) return true;else return errors[0].errorMessage;
      });
    });
    this.onValidate(function () {
      breezeEntity.entityAspect.validateEntity();
      return {};
    });

    breezeEntity.entityAspect.validationErrorsChanged.subscribe(function () {
      breezeEntity.entityAspect.getValidationErrors().forEach(function (validationError) {
        var propertyName = validationError.propertyName;
        if (!me.result.properties[propertyName]) {
          me.ensure(propertyName);
        }

        var currentResultProp = me.result.addProperty(propertyName);
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
  };

  ValidationGroup.prototype.validate = function validate() {
    var _this9 = this;

    var forceDirty = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
    var forceExecution = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    this.isValidating = true;
    var promise = Promise.resolve(true);

    var _loop2 = function (i) {
      var validatorProperty = _this9.validationProperties[i];
      promise = promise.then(function () {
        return validatorProperty.validateCurrentValue(forceDirty, forceExecution);
      });
    };

    for (var i = this.validationProperties.length - 1; i >= 0; i--) {
      _loop2(i);
    }
    promise = promise['catch'](function () {
      console.log("Should never get here: a validation property should always resolve to true/false!");
      throw Error("Should never get here: a validation property should always resolve to true/false!");
    });

    this.onValidateCallbacks.forEach(function (onValidateCallback) {
      promise = promise.then(function () {
        return _this9.config.locale();
      }).then(function (locale) {
        return Promise.resolve(onValidateCallback.validationFunction()).then(function (callbackResult) {
          for (var prop in callbackResult) {
            if (!_this9.result.properties[prop]) {
              _this9.ensure(prop);
            }
            var resultProp = _this9.result.addProperty(prop);
            var result = callbackResult[prop];
            var newPropResult = {
              latestValue: resultProp.latestValue
            };
            if (result === true || result === null || result === '') {
              if (!resultProp.isValid && resultProp.failingRule === 'onValidateCallback') {
                newPropResult.failingRule = null;
                newPropResult.message = '';
                newPropResult.isValid = true;
                resultProp.setValidity(newPropResult, true);
              }
            } else {
              if (resultProp.isValid) {
                newPropResult.failingRule = 'onValidateCallback';
                newPropResult.isValid = false;
                if (typeof result === 'string') {
                  newPropResult.message = result;
                } else {
                  newPropResult.message = locale.translate(newPropResult.failingRule);
                }
                resultProp.setValidity(newPropResult, true);
              }
            }
          }
          _this9.result.checkValidity();
        }, function (a, b, c, d, e) {
          _this9.result.isValid = false;
          if (onValidateCallback.validationFunctionFailedCallback) {
            onValidateCallback.validationFunctionFailedCallback(a, b, c, d, e);
          }
        });
      });
    });
    promise = promise.then(function () {
      _this9.isValidating = false;
      if (_this9.result.isValid) {
        return Promise.resolve(_this9.result);
      } else {
        return Promise.reject(_this9.result);
      }
    });
    return promise;
  };

  ValidationGroup.prototype.onValidate = function onValidate(validationFunction, validationFunctionFailedCallback) {
    this.onValidateCallbacks.push({ validationFunction: validationFunction, validationFunctionFailedCallback: validationFunctionFailedCallback });
    return this;
  };

  ValidationGroup.prototype.onPropertyValidate = function onPropertyValidate(validationFunction) {
    this.onPropertyValidationCallbacks.push(validationFunction);
    return this;
  };

  ValidationGroup.prototype.ensure = function ensure(bindingPath, configCallback) {
    this.builder.ensure(bindingPath, configCallback);
    this.onPropertyValidationCallbacks.forEach(function (callback) {
      callback(bindingPath);
    });
    return this;
  };

  ValidationGroup.prototype.isNotEmpty = function isNotEmpty() {
    return this.builder.isNotEmpty();
  };

  ValidationGroup.prototype.canBeEmpty = function canBeEmpty() {
    return this.builder.canBeEmpty();
  };

  ValidationGroup.prototype.isGreaterThanOrEqualTo = function isGreaterThanOrEqualTo(minimumValue) {
    return this.builder.isGreaterThanOrEqualTo(minimumValue);
  };

  ValidationGroup.prototype.isGreaterThan = function isGreaterThan(minimumValue) {
    return this.builder.isGreaterThan(minimumValue);
  };

  ValidationGroup.prototype.isBetween = function isBetween(minimumValue, maximumValue) {
    return this.builder.isBetween(minimumValue, maximumValue);
  };

  ValidationGroup.prototype.isLessThanOrEqualTo = function isLessThanOrEqualTo(maximumValue) {
    return this.builder.isLessThanOrEqualTo(maximumValue);
  };

  ValidationGroup.prototype.isLessThan = function isLessThan(maximumValue) {
    return this.builder.isLessThan(maximumValue);
  };

  ValidationGroup.prototype.isEqualTo = function isEqualTo(otherValue, otherValueLabel) {
    return this.builder.isEqualTo(otherValue, otherValueLabel);
  };

  ValidationGroup.prototype.isNotEqualTo = function isNotEqualTo(otherValue, otherValueLabel) {
    return this.builder.isNotEqualTo(otherValue, otherValueLabel);
  };

  ValidationGroup.prototype.isEmail = function isEmail() {
    return this.builder.isEmail();
  };

  ValidationGroup.prototype.isURL = function isURL() {
    return this.builder.isURL();
  };

  ValidationGroup.prototype.isIn = function isIn(collection) {
    return this.builder.isIn(collection);
  };

  ValidationGroup.prototype.hasMinLength = function hasMinLength(minimumValue) {
    return this.builder.hasMinLength(minimumValue);
  };

  ValidationGroup.prototype.hasMaxLength = function hasMaxLength(maximumValue) {
    return this.builder.hasMaxLength(maximumValue);
  };

  ValidationGroup.prototype.hasLengthBetween = function hasLengthBetween(minimumValue, maximumValue) {
    return this.builder.hasLengthBetween(minimumValue, maximumValue);
  };

  ValidationGroup.prototype.isNumber = function isNumber() {
    return this.builder.isNumber();
  };

  ValidationGroup.prototype.containsNoSpaces = function containsNoSpaces() {
    return this.builder.containsNoSpaces();
  };

  ValidationGroup.prototype.containsOnlyDigits = function containsOnlyDigits() {
    return this.builder.containsOnlyDigits();
  };

  ValidationGroup.prototype.containsOnly = function containsOnly(regex) {
    return this.builder.containsOnly(regex);
  };

  ValidationGroup.prototype.containsOnlyAlpha = function containsOnlyAlpha() {
    return this.builder.containsOnlyAlpha();
  };

  ValidationGroup.prototype.containsOnlyAlphaOrWhitespace = function containsOnlyAlphaOrWhitespace() {
    return this.builder.containsOnlyAlphaOrWhitespace();
  };

  ValidationGroup.prototype.containsOnlyLetters = function containsOnlyLetters() {
    return this.builder.containsOnlyAlpha();
  };

  ValidationGroup.prototype.containsOnlyLettersOrWhitespace = function containsOnlyLettersOrWhitespace() {
    return this.builder.containsOnlyAlphaOrWhitespace();
  };

  ValidationGroup.prototype.containsOnlyAlphanumerics = function containsOnlyAlphanumerics() {
    return this.builder.containsOnlyAlphanumerics();
  };

  ValidationGroup.prototype.containsOnlyAlphanumericsOrWhitespace = function containsOnlyAlphanumericsOrWhitespace() {
    return this.builder.containsOnlyAlphanumericsOrWhitespace();
  };

  ValidationGroup.prototype.isStrongPassword = function isStrongPassword(minimumComplexityLevel) {
    return this.builder.isStrongPassword(minimumComplexityLevel);
  };

  ValidationGroup.prototype.matches = function matches(regex) {
    return this.builder.matches(regex);
  };

  ValidationGroup.prototype.passes = function passes(customFunction, threshold) {
    return this.builder.passes(customFunction, threshold);
  };

  ValidationGroup.prototype.passesRule = function passesRule(validationRule) {
    return this.builder.passesRule(validationRule);
  };

  ValidationGroup.prototype['if'] = function _if(conditionExpression, threshold) {
    return this.builder['if'](conditionExpression, threshold);
  };

  ValidationGroup.prototype['else'] = function _else() {
    return this.builder['else']();
  };

  ValidationGroup.prototype.endIf = function endIf() {
    return this.builder.endIf();
  };

  ValidationGroup.prototype['switch'] = function _switch(conditionExpression) {
    return this.builder['switch'](conditionExpression);
  };

  ValidationGroup.prototype['case'] = function _case(caseLabel) {
    return this.builder['case'](caseLabel);
  };

  ValidationGroup.prototype['default'] = function _default() {
    return this.builder['default']();
  };

  ValidationGroup.prototype.endSwitch = function endSwitch() {
    return this.builder.endSwitch();
  };

  ValidationGroup.prototype.withMessage = function withMessage(message) {
    return this.builder.withMessage(message);
  };

  return ValidationGroup;
})();

exports.ValidationGroup = ValidationGroup;

var ValidationLocale = (function () {
  function ValidationLocale(defaults, data) {
    _classCallCheck(this, ValidationLocale);

    this.defaults = defaults;
    this.currentLocale = data;
  }

  ValidationLocale.prototype.getValueFor = function getValueFor(identifier, category) {
    if (this.currentLocale && this.currentLocale[category]) {
      var currentLocaleSetting = this.currentLocale[category][identifier];
      if (currentLocaleSetting !== undefined && currentLocaleSetting !== null) return currentLocaleSetting;
    }
    if (this.defaults[category]) {
      var defaultSetting = this.defaults[category][identifier];
      if (defaultSetting !== undefined && defaultSetting !== null) return defaultSetting;
    }
    throw 'validation: I18N: Could not find: ' + identifier + ' in category: ' + category;
  };

  ValidationLocale.prototype.setting = function setting(settingIdentifier) {
    return this.getValueFor(settingIdentifier, 'settings');
  };

  ValidationLocale.prototype.translate = function translate(translationIdentifier, newValue, threshold) {
    var translation = this.getValueFor(translationIdentifier, 'messages');
    if (typeof translation === 'function') {
      return translation(newValue, threshold);
    }
    if (typeof translation === 'string') {
      return translation;
    }
    throw 'Validation message for ' + translationIdentifier + 'was in an unsupported format';
  };

  return ValidationLocale;
})();

exports.ValidationLocale = ValidationLocale;

var ValidationLocaleRepository = (function () {
  function ValidationLocaleRepository() {
    _classCallCheck(this, ValidationLocaleRepository);

    this['default'] = null;
    this.instances = new Map();
    this.defaults = {
      settings: {
        'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
      },
      messages: {}
    };
  }

  ValidationLocaleRepository.prototype.load = function load(localeIdentifier, basePath) {
    var _this10 = this;

    if (!basePath) basePath = 'aurelia-validation/resources/';
    return new Promise(function (resolve, reject) {
      if (_this10.instances.has(localeIdentifier)) {
        var locale = _this10.instances.get(localeIdentifier);
        resolve(locale);
      } else {
        System['import'](basePath + localeIdentifier).then(function (resource) {
          var locale = _this10.addLocale(localeIdentifier, resource.data);
          resolve(locale);
        });
      }
    });
  };

  ValidationLocaleRepository.prototype.addLocale = function addLocale(localeIdentifier, data) {
    var instance = new ValidationLocale(this.defaults, data);
    this.instances.set(localeIdentifier, instance);
    if (this['default'] === null) this['default'] = instance;
    return instance;
  };

  return ValidationLocaleRepository;
})();

ValidationLocale.Repository = new ValidationLocaleRepository();

var ValidationProperty = (function () {
  function ValidationProperty(observerLocator, propertyName, validationGroup, propertyResult, config) {
    var _this11 = this;

    _classCallCheck(this, ValidationProperty);

    this.propertyResult = propertyResult;
    this.propertyName = propertyName;
    this.validationGroup = validationGroup;
    this.collectionOfValidationRules = new ValidationRulesCollection(config);
    this.config = config;
    this.latestValue = undefined;

    this.observer = new PathObserver(observerLocator, validationGroup.subject, propertyName).getObserver();

    this.debouncer = new Debouncer(config.getDebounceTimeout());

    this.subscription = this.observer.subscribe(function () {
      _this11.debouncer.debounce(function () {
        var newValue = _this11.observer.getValue();
        if (newValue !== _this11.latestValue) {
          _this11.validate(newValue, true);
        }
      });
    });

    this.dependencyObservers = [];
    var dependencies = this.config.getDependencies();
    for (var i = 0; i < dependencies.length; i++) {
      var dependencyObserver = new PathObserver(observerLocator, validationGroup.subject, dependencies[i]).getObserver();
      dependencyObserver.subscribe(function () {
        _this11.debouncer.debounce(function () {
          _this11.validateCurrentValue(true);
        });
      });
      this.dependencyObservers.push(dependencyObserver);
    }
  }

  ValidationProperty.prototype.addValidationRule = function addValidationRule(validationRule) {
    if (validationRule.validate === undefined) throw new Error("That's not a valid validationRule");
    this.collectionOfValidationRules.addValidationRule(validationRule);
    this.validateCurrentValue(false);
  };

  ValidationProperty.prototype.validateCurrentValue = function validateCurrentValue(forceDirty, forceExecution) {
    return this.validate(this.observer.getValue(), forceDirty, forceExecution);
  };

  ValidationProperty.prototype.clear = function clear() {
    this.latestValue = this.observer.getValue();
    this.propertyResult.clear();
  };

  ValidationProperty.prototype.destroy = function destroy() {
    if (this.subscription) this.subscription();
  };

  ValidationProperty.prototype.validate = function validate(newValue, shouldBeDirty, forceExecution) {
    var _this12 = this;

    if (!this.propertyResult.isDirty && shouldBeDirty || this.latestValue !== newValue || forceExecution) {
      this.latestValue = newValue;
      return this.config.locale().then(function (locale) {
        return _this12.collectionOfValidationRules.validate(newValue, locale).then(function (validationResponse) {
          if (_this12.latestValue === validationResponse.latestValue) _this12.propertyResult.setValidity(validationResponse, shouldBeDirty);
          return validationResponse.isValid;
        })['catch'](function (err) {
          console.log("Unexpected behavior: a validation-rules-collection should always fulfil", err);
          throw Error("Unexpected behavior: a validation-rules-collection should always fulfil");
        });
      }, function () {
        throw Error("An exception occurred while trying to load the locale");
      });
    }
  };

  return ValidationProperty;
})();

exports.ValidationProperty = ValidationProperty;

var ValidationResult = (function () {
  function ValidationResult() {
    _classCallCheck(this, ValidationResult);

    this.isValid = true;
    this.properties = {};
  }

  ValidationResult.prototype.addProperty = function addProperty(name) {
    if (!this.properties[name]) {
      this.properties[name] = new ValidationResultProperty(this);
    }
    return this.properties[name];
  };

  ValidationResult.prototype.checkValidity = function checkValidity() {
    for (var propertyName in this.properties) {
      if (!this.properties[propertyName].isValid) {
        this.isValid = false;
        return;
      }
    }
    this.isValid = true;
  };

  ValidationResult.prototype.clear = function clear() {
    this.isValid = true;
  };

  return ValidationResult;
})();

exports.ValidationResult = ValidationResult;

var ValidationResultProperty = (function () {
  function ValidationResultProperty(group) {
    _classCallCheck(this, ValidationResultProperty);

    this.group = group;
    this.onValidateCallbacks = [];
    this.clear();
  }

  ValidationResultProperty.prototype.clear = function clear() {
    this.isValid = true;
    this.isDirty = false;
    this.message = '';
    this.failingRule = null;
    this.latestValue = null;
    this.notifyObserversOfChange();
  };

  ValidationResultProperty.prototype.onValidate = function onValidate(onValidateCallback) {
    this.onValidateCallbacks.push(onValidateCallback);
  };

  ValidationResultProperty.prototype.notifyObserversOfChange = function notifyObserversOfChange() {
    for (var i = 0; i < this.onValidateCallbacks.length; i++) {
      var callback = this.onValidateCallbacks[i];
      callback(this);
    }
  };

  ValidationResultProperty.prototype.setValidity = function setValidity(validationResponse, shouldBeDirty) {
    var notifyObservers = !this.isDirty && shouldBeDirty || this.isValid !== validationResponse.isValid || this.message !== validationResponse.message;

    if (shouldBeDirty) this.isDirty = true;
    this.message = validationResponse.message;
    this.failingRule = validationResponse.failingRule;
    this.isValid = validationResponse.isValid;
    this.latestValue = validationResponse.latestValue;
    if (this.isValid !== this.group.isValid) this.group.checkValidity();

    if (notifyObservers) {
      this.notifyObserversOfChange();
    }
  };

  return ValidationResultProperty;
})();

exports.ValidationResultProperty = ValidationResultProperty;

var ValidationRulesCollection = (function () {
  function ValidationRulesCollection(config) {
    _classCallCheck(this, ValidationRulesCollection);

    this.isRequired = config ? config.getValue('allPropertiesAreMandatory') : false;
    this.validationRules = [];
    this.validationCollections = [];
    this.isRequiredMessage = null;
  }

  ValidationRulesCollection.prototype.validate = function validate(newValue, locale) {
    var _this13 = this;

    if (locale === undefined) {
      locale = ValidationLocale.Repository['default'];
    }
    newValue = Utilities.getValue(newValue);
    var executeRules = true;

    if (Utilities.isEmptyValue(newValue)) {
      if (this.isRequired) {
        return Promise.resolve({
          isValid: false,
          message: this.isRequiredMessage ? typeof this.isRequiredMessage === 'function' ? this.isRequiredMessage(newValue) : this.isRequiredMessage : locale.translate('isRequired'),
          failingRule: 'isRequired',
          latestValue: newValue
        });
      } else {
        executeRules = false;
      }
    }

    var checks = Promise.resolve({
      isValid: true,
      message: '',
      failingRule: null,
      latestValue: newValue
    });

    if (executeRules) {
      var _loop3 = function (i) {
        var rule = _this13.validationRules[i];
        checks = checks.then(function (previousRuleResult) {
          if (previousRuleResult.isValid === false) {
            return previousRuleResult;
          } else {
            return rule.validate(newValue, locale).then(function (thisRuleResult) {
              if (thisRuleResult === false) {
                return {
                  isValid: false,
                  message: rule.explain(),
                  failingRule: rule.ruleName,
                  latestValue: newValue
                };
              } else {
                if (!previousRuleResult.isValid) {
                  throw Error("ValidationRulesCollection.validate caught an unexpected result while validating it's chain of rules.");
                }
                return previousRuleResult;
              }
            });
          }
        });
      };

      for (var i = 0; i < this.validationRules.length; i++) {
        _loop3(i);
      }
    }

    var _loop4 = function (i) {
      var validationCollection = _this13.validationCollections[i];
      checks = checks.then(function (previousValidationResult) {
        if (previousValidationResult.isValid) return validationCollection.validate(newValue, locale);else return previousValidationResult;
      });
    };

    for (var i = 0; i < this.validationCollections.length; i++) {
      _loop4(i);
    }

    return checks;
  };

  ValidationRulesCollection.prototype.addValidationRule = function addValidationRule(validationRule) {
    if (validationRule.validate === undefined) throw new Error("That's not a valid validationRule");
    this.validationRules.push(validationRule);
  };

  ValidationRulesCollection.prototype.addValidationRuleCollection = function addValidationRuleCollection(validationRulesCollection) {
    this.validationCollections.push(validationRulesCollection);
  };

  ValidationRulesCollection.prototype.isNotEmpty = function isNotEmpty() {
    this.isRequired = true;
  };

  ValidationRulesCollection.prototype.canBeEmpty = function canBeEmpty() {
    this.isRequired = false;
  };

  ValidationRulesCollection.prototype.withMessage = function withMessage(message) {
    if (this.validationRules.length === 0) this.isRequiredMessage = message;else this.validationRules[this.validationRules.length - 1].withMessage(message);
  };

  return ValidationRulesCollection;
})();

exports.ValidationRulesCollection = ValidationRulesCollection;

var SwitchCaseValidationRulesCollection = (function () {
  function SwitchCaseValidationRulesCollection(conditionExpression, config) {
    _classCallCheck(this, SwitchCaseValidationRulesCollection);

    this.conditionExpression = conditionExpression;
    this.config = config;
    this.innerCollections = [];
    this.defaultCollection = new ValidationRulesCollection(this.config);
    this.caseLabel = '';
    this.defaultCaseLabel = { description: 'this is the case label for \'default\'' };
  }

  SwitchCaseValidationRulesCollection.prototype['case'] = function _case(caseLabel) {
    this.caseLabel = caseLabel;
    this.getCurrentCollection(caseLabel, true);
  };

  SwitchCaseValidationRulesCollection.prototype['default'] = function _default() {
    this.caseLabel = this.defaultCaseLabel;
  };

  SwitchCaseValidationRulesCollection.prototype.getCurrentCollection = function getCurrentCollection(caseLabel) {
    var createIfNotExists = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    if (caseLabel === this.defaultCaseLabel) return this.defaultCollection;
    var currentCollection = null;
    for (var i = 0; i < this.innerCollections.length; i++) {
      currentCollection = this.innerCollections[i];
      if (currentCollection.caseLabel === caseLabel) return currentCollection.collection;
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
  };

  SwitchCaseValidationRulesCollection.prototype.validate = function validate(newValue, locale) {
    var collection = this.getCurrentCollection(this.conditionExpression(newValue));
    if (collection !== null) return collection.validate(newValue, locale);else return this.defaultCollection.validate(newValue, locale);
  };

  SwitchCaseValidationRulesCollection.prototype.addValidationRule = function addValidationRule(validationRule) {
    var currentCollection = this.getCurrentCollection(this.caseLabel, true);
    currentCollection.addValidationRule(validationRule);
  };

  SwitchCaseValidationRulesCollection.prototype.addValidationRuleCollection = function addValidationRuleCollection(validationRulesCollection) {
    var currentCollection = this.getCurrentCollection(this.caseLabel, true);
    currentCollection.addValidationRuleCollection(validationRulesCollection);
  };

  SwitchCaseValidationRulesCollection.prototype.isNotEmpty = function isNotEmpty() {
    var collection = this.getCurrentCollection(this.caseLabel);
    if (collection !== null) collection.isNotEmpty();else this.defaultCollection.isNotEmpty();
  };

  SwitchCaseValidationRulesCollection.prototype.canBeEmpty = function canBeEmpty() {
    var collection = this.getCurrentCollection(this.caseLabel);
    if (collection !== null) collection.canBeEmpty();else this.defaultCollection.canBeEmpty();
  };

  SwitchCaseValidationRulesCollection.prototype.withMessage = function withMessage(message) {
    var collection = this.getCurrentCollection(this.caseLabel);
    if (collection !== null) collection.withMessage(message);else this.defaultCollection.withMessage(message);
  };

  return SwitchCaseValidationRulesCollection;
})();

exports.SwitchCaseValidationRulesCollection = SwitchCaseValidationRulesCollection;

var ValidationRule = (function () {
  function ValidationRule(threshold, onValidate, message, ruleName) {
    _classCallCheck(this, ValidationRule);

    this.onValidate = onValidate;
    this.threshold = threshold;
    this.message = message;
    this.errorMessage = null;
    this.ruleName = ruleName;
  }

  ValidationRule.prototype.withMessage = function withMessage(message) {
    this.message = message;
  };

  ValidationRule.prototype.explain = function explain() {
    return this.errorMessage;
  };

  ValidationRule.prototype.setResult = function setResult(result, currentValue, locale) {
    if (result === true || result === undefined || result === null || result === '') {
      this.errorMessage = null;
      return true;
    } else {
      if (typeof result === 'string') {
        this.errorMessage = result;
      } else {
        if (this.message) {
          if (typeof this.message === 'function') {
            this.errorMessage = this.message(currentValue, this.threshold);
          } else if (typeof this.message === 'string') {
            this.errorMessage = this.message;
          } else throw 'Unable to handle the error message:' + this.message;
        } else {
          this.errorMessage = locale.translate(this.ruleName, currentValue, this.threshold);
        }
      }
      return false;
    }
  };

  ValidationRule.prototype.validate = function validate(currentValue, locale) {
    var _this14 = this;

    if (locale === undefined) {
      locale = ValidationLocale.Repository['default'];
    }

    currentValue = Utilities.getValue(currentValue);
    var result = this.onValidate(currentValue, this.threshold, locale);
    var promise = Promise.resolve(result);

    var nextPromise = promise.then(function (promiseResult) {
      return _this14.setResult(promiseResult, currentValue, locale);
    }, function (promiseFailure) {
      if (typeof promiseFailure === 'string' && promiseFailure !== '') return _this14.setResult(promiseFailure, currentValue, locale);else return _this14.setResult(false, currentValue, locale);
    });
    return nextPromise;
  };

  return ValidationRule;
})();

exports.ValidationRule = ValidationRule;

var URLValidationRule = (function (_ValidationRule) {
  _inherits(URLValidationRule, _ValidationRule);

  URLValidationRule.isIP = function isIP(str, version) {
    var ipv4Maybe = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/,
        ipv6Block = /^[0-9A-F]{1,4}$/i;

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
      var foundOmissionBlock = false;

      if (blocks.length > 8) return false;

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
        if (blocks[i] === '' && i > 0 && i < blocks.length - 1) {
          if (foundOmissionBlock) return false;
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
  };

  URLValidationRule.isFQDN = function isFQDN(str, options) {
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
      if (part[0] === '-' || part[part.length - 1] === '-' || part.indexOf('---') >= 0) {
        return false;
      }
    }
    return true;
  };

  function URLValidationRule(threshold) {
    _classCallCheck(this, URLValidationRule);

    var default_url_options = {
      protocols: ['http', 'https', 'ftp'],
      require_tld: true,
      require_protocol: false,
      allow_underscores: true,
      allow_trailing_dot: false,
      allow_protocol_relative_urls: true
    };
    if (threshold === undefined) {
      threshold = default_url_options;
    }

    _ValidationRule.call(this, threshold, function (newValue, threshold) {
      var url = newValue;
      if (!url || url.length >= 2083 || /\s/.test(url)) {
        return false;
      }
      if (url.indexOf('mailto:') === 0) {
        return false;
      }
      var protocol, auth, host, hostname, port, port_str, split;
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
      if (!URLValidationRule.isIP(host) && !URLValidationRule.isFQDN(host, threshold) && host !== 'localhost') {
        return false;
      }
      if (threshold.host_whitelist && threshold.host_whitelist.indexOf(host) === -1) {
        return false;
      }
      if (threshold.host_blacklist && threshold.host_blacklist.indexOf(host) !== -1) {
        return false;
      }
      return true;
    }, null, 'URLValidationRule');
  }

  return URLValidationRule;
})(ValidationRule);

exports.URLValidationRule = URLValidationRule;

var EmailValidationRule = (function (_ValidationRule2) {
  _inherits(EmailValidationRule, _ValidationRule2);

  EmailValidationRule.testEmailUserUtf8Regex = function testEmailUserUtf8Regex(user) {
    var emailUserUtf8Regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))$/i;
    return emailUserUtf8Regex.test(user);
  };

  EmailValidationRule.isFQDN = function isFQDN(str) {
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
      if (part[0] === '-' || part[part.length - 1] === '-' || part.indexOf('---') >= 0) {
        return false;
      }
    }
    return true;
  };

  function EmailValidationRule() {
    _classCallCheck(this, EmailValidationRule);

    _ValidationRule2.call(this, null, function (newValue, threshold) {
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
    }, null, 'EmailValidationRule');
  }

  return EmailValidationRule;
})(ValidationRule);

exports.EmailValidationRule = EmailValidationRule;

var MinimumLengthValidationRule = (function (_ValidationRule3) {
  _inherits(MinimumLengthValidationRule, _ValidationRule3);

  function MinimumLengthValidationRule(minimumLength) {
    _classCallCheck(this, MinimumLengthValidationRule);

    _ValidationRule3.call(this, minimumLength, function (newValue, minimumLength) {
      return newValue.length !== undefined && newValue.length >= minimumLength;
    }, null, 'MinimumLengthValidationRule');
  }

  return MinimumLengthValidationRule;
})(ValidationRule);

exports.MinimumLengthValidationRule = MinimumLengthValidationRule;

var MaximumLengthValidationRule = (function (_ValidationRule4) {
  _inherits(MaximumLengthValidationRule, _ValidationRule4);

  function MaximumLengthValidationRule(maximumLength) {
    _classCallCheck(this, MaximumLengthValidationRule);

    _ValidationRule4.call(this, maximumLength, function (newValue, maximumLength) {
      return newValue.length !== undefined && newValue.length <= maximumLength;
    }, null, 'MaximumLengthValidationRule');
  }

  return MaximumLengthValidationRule;
})(ValidationRule);

exports.MaximumLengthValidationRule = MaximumLengthValidationRule;

var BetweenLengthValidationRule = (function (_ValidationRule5) {
  _inherits(BetweenLengthValidationRule, _ValidationRule5);

  function BetweenLengthValidationRule(minimumLength, maximumLength) {
    _classCallCheck(this, BetweenLengthValidationRule);

    _ValidationRule5.call(this, { minimumLength: minimumLength, maximumLength: maximumLength }, function (newValue, threshold) {
      return newValue.length !== undefined && newValue.length >= threshold.minimumLength && newValue.length <= threshold.maximumLength;
    }, null, 'BetweenLengthValidationRule');
  }

  return BetweenLengthValidationRule;
})(ValidationRule);

exports.BetweenLengthValidationRule = BetweenLengthValidationRule;

var CustomFunctionValidationRule = (function (_ValidationRule6) {
  _inherits(CustomFunctionValidationRule, _ValidationRule6);

  function CustomFunctionValidationRule(customFunction, threshold) {
    _classCallCheck(this, CustomFunctionValidationRule);

    _ValidationRule6.call(this, threshold, customFunction, null, 'CustomFunctionValidationRule');
  }

  return CustomFunctionValidationRule;
})(ValidationRule);

exports.CustomFunctionValidationRule = CustomFunctionValidationRule;

var NumericValidationRule = (function (_ValidationRule7) {
  _inherits(NumericValidationRule, _ValidationRule7);

  function NumericValidationRule() {
    _classCallCheck(this, NumericValidationRule);

    _ValidationRule7.call(this, null, function (newValue, threshold, locale) {
      var numericRegex = locale.setting('numericRegex');
      var floatValue = parseFloat(newValue);
      return !Number.isNaN(parseFloat(newValue)) && Number.isFinite(floatValue) && numericRegex.test(newValue);
    }, null, 'NumericValidationRule');
  }

  return NumericValidationRule;
})(ValidationRule);

exports.NumericValidationRule = NumericValidationRule;

var RegexValidationRule = (function (_ValidationRule8) {
  _inherits(RegexValidationRule, _ValidationRule8);

  function RegexValidationRule(regex, ruleName) {
    _classCallCheck(this, RegexValidationRule);

    _ValidationRule8.call(this, regex, function (newValue, regex) {
      return regex.test(newValue);
    }, null, ruleName || 'RegexValidationRule');
  }

  return RegexValidationRule;
})(ValidationRule);

exports.RegexValidationRule = RegexValidationRule;

var ContainsOnlyValidationRule = (function (_RegexValidationRule) {
  _inherits(ContainsOnlyValidationRule, _RegexValidationRule);

  function ContainsOnlyValidationRule(regex) {
    _classCallCheck(this, ContainsOnlyValidationRule);

    _RegexValidationRule.call(this, regex, 'ContainsOnlyValidationRule');
  }

  return ContainsOnlyValidationRule;
})(RegexValidationRule);

exports.ContainsOnlyValidationRule = ContainsOnlyValidationRule;

var MinimumValueValidationRule = (function (_ValidationRule9) {
  _inherits(MinimumValueValidationRule, _ValidationRule9);

  function MinimumValueValidationRule(minimumValue) {
    _classCallCheck(this, MinimumValueValidationRule);

    _ValidationRule9.call(this, minimumValue, function (newValue, minimumValue) {
      return Utilities.getValue(minimumValue) < newValue;
    }, null, 'MinimumValueValidationRule');
  }

  return MinimumValueValidationRule;
})(ValidationRule);

exports.MinimumValueValidationRule = MinimumValueValidationRule;

var MinimumInclusiveValueValidationRule = (function (_ValidationRule10) {
  _inherits(MinimumInclusiveValueValidationRule, _ValidationRule10);

  function MinimumInclusiveValueValidationRule(minimumValue) {
    _classCallCheck(this, MinimumInclusiveValueValidationRule);

    _ValidationRule10.call(this, minimumValue, function (newValue, minimumValue) {
      return Utilities.getValue(minimumValue) <= newValue;
    }, null, 'MinimumInclusiveValueValidationRule');
  }

  return MinimumInclusiveValueValidationRule;
})(ValidationRule);

exports.MinimumInclusiveValueValidationRule = MinimumInclusiveValueValidationRule;

var MaximumValueValidationRule = (function (_ValidationRule11) {
  _inherits(MaximumValueValidationRule, _ValidationRule11);

  function MaximumValueValidationRule(maximumValue) {
    _classCallCheck(this, MaximumValueValidationRule);

    _ValidationRule11.call(this, maximumValue, function (newValue, maximumValue) {
      return newValue < Utilities.getValue(maximumValue);
    }, null, 'MaximumValueValidationRule');
  }

  return MaximumValueValidationRule;
})(ValidationRule);

exports.MaximumValueValidationRule = MaximumValueValidationRule;

var MaximumInclusiveValueValidationRule = (function (_ValidationRule12) {
  _inherits(MaximumInclusiveValueValidationRule, _ValidationRule12);

  function MaximumInclusiveValueValidationRule(maximumValue) {
    _classCallCheck(this, MaximumInclusiveValueValidationRule);

    _ValidationRule12.call(this, maximumValue, function (newValue, maximumValue) {
      return newValue <= Utilities.getValue(maximumValue);
    }, null, 'MaximumInclusiveValueValidationRule');
  }

  return MaximumInclusiveValueValidationRule;
})(ValidationRule);

exports.MaximumInclusiveValueValidationRule = MaximumInclusiveValueValidationRule;

var BetweenValueValidationRule = (function (_ValidationRule13) {
  _inherits(BetweenValueValidationRule, _ValidationRule13);

  function BetweenValueValidationRule(minimumValue, maximumValue) {
    _classCallCheck(this, BetweenValueValidationRule);

    _ValidationRule13.call(this, { minimumValue: minimumValue, maximumValue: maximumValue }, function (newValue, threshold) {
      return Utilities.getValue(threshold.minimumValue) <= newValue && newValue <= Utilities.getValue(threshold.maximumValue);
    }, null, 'BetweenValueValidationRule');
  }

  return BetweenValueValidationRule;
})(ValidationRule);

exports.BetweenValueValidationRule = BetweenValueValidationRule;

var DigitValidationRule = (function (_ValidationRule14) {
  _inherits(DigitValidationRule, _ValidationRule14);

  function DigitValidationRule() {
    _classCallCheck(this, DigitValidationRule);

    _ValidationRule14.call(this, null, function (newValue, threshold) {
      return (/^\d+$/.test(newValue)
      );
    }, null, 'DigitValidationRule');
  }

  return DigitValidationRule;
})(ValidationRule);

exports.DigitValidationRule = DigitValidationRule;

var NoSpacesValidationRule = (function (_ValidationRule15) {
  _inherits(NoSpacesValidationRule, _ValidationRule15);

  function NoSpacesValidationRule() {
    _classCallCheck(this, NoSpacesValidationRule);

    _ValidationRule15.call(this, null, function (newValue, threshold) {
      return (/^\S*$/.test(newValue)
      );
    }, null, 'NoSpacesValidationRule');
  }

  return NoSpacesValidationRule;
})(ValidationRule);

exports.NoSpacesValidationRule = NoSpacesValidationRule;

var AlphaNumericValidationRule = (function (_ValidationRule16) {
  _inherits(AlphaNumericValidationRule, _ValidationRule16);

  function AlphaNumericValidationRule() {
    _classCallCheck(this, AlphaNumericValidationRule);

    _ValidationRule16.call(this, null, function (newValue, threshold) {
      return (/^[a-z0-9]+$/i.test(newValue)
      );
    }, null, 'AlphaNumericValidationRule');
  }

  return AlphaNumericValidationRule;
})(ValidationRule);

exports.AlphaNumericValidationRule = AlphaNumericValidationRule;

var AlphaValidationRule = (function (_ValidationRule17) {
  _inherits(AlphaValidationRule, _ValidationRule17);

  function AlphaValidationRule() {
    _classCallCheck(this, AlphaValidationRule);

    _ValidationRule17.call(this, null, function (newValue, threshold) {
      return (/^[a-z]+$/i.test(newValue)
      );
    }, null, 'AlphaValidationRule');
  }

  return AlphaValidationRule;
})(ValidationRule);

exports.AlphaValidationRule = AlphaValidationRule;

var AlphaOrWhitespaceValidationRule = (function (_ValidationRule18) {
  _inherits(AlphaOrWhitespaceValidationRule, _ValidationRule18);

  function AlphaOrWhitespaceValidationRule() {
    _classCallCheck(this, AlphaOrWhitespaceValidationRule);

    _ValidationRule18.call(this, null, function (newValue, threshold) {
      return (/^[a-z\s]+$/i.test(newValue)
      );
    }, null, 'AlphaOrWhitespaceValidationRule');
  }

  return AlphaOrWhitespaceValidationRule;
})(ValidationRule);

exports.AlphaOrWhitespaceValidationRule = AlphaOrWhitespaceValidationRule;

var AlphaNumericOrWhitespaceValidationRule = (function (_ValidationRule19) {
  _inherits(AlphaNumericOrWhitespaceValidationRule, _ValidationRule19);

  function AlphaNumericOrWhitespaceValidationRule() {
    _classCallCheck(this, AlphaNumericOrWhitespaceValidationRule);

    _ValidationRule19.call(this, null, function (newValue, threshold) {
      return (/^[a-z0-9\s]+$/i.test(newValue)
      );
    }, null, 'AlphaNumericOrWhitespaceValidationRule');
  }

  return AlphaNumericOrWhitespaceValidationRule;
})(ValidationRule);

exports.AlphaNumericOrWhitespaceValidationRule = AlphaNumericOrWhitespaceValidationRule;

var MediumPasswordValidationRule = (function (_ValidationRule20) {
  _inherits(MediumPasswordValidationRule, _ValidationRule20);

  function MediumPasswordValidationRule(minimumComplexityLevel, ruleName) {
    _classCallCheck(this, MediumPasswordValidationRule);

    _ValidationRule20.call(this, minimumComplexityLevel ? minimumComplexityLevel : 3, function (newValue, threshold) {
      if (typeof newValue !== 'string') return false;
      var strength = 0;

      strength += /[A-Z]+/.test(newValue) ? 1 : 0;
      strength += /[a-z]+/.test(newValue) ? 1 : 0;
      strength += /[0-9]+/.test(newValue) ? 1 : 0;
      strength += /[\W]+/.test(newValue) ? 1 : 0;
      return strength >= threshold;
    }, null, ruleName || 'MediumPasswordValidationRule');
  }

  return MediumPasswordValidationRule;
})(ValidationRule);

exports.MediumPasswordValidationRule = MediumPasswordValidationRule;

var StrongPasswordValidationRule = (function (_MediumPasswordValidationRule) {
  _inherits(StrongPasswordValidationRule, _MediumPasswordValidationRule);

  function StrongPasswordValidationRule() {
    _classCallCheck(this, StrongPasswordValidationRule);

    _MediumPasswordValidationRule.call(this, 4, 'StrongPasswordValidationRule');
  }

  return StrongPasswordValidationRule;
})(MediumPasswordValidationRule);

exports.StrongPasswordValidationRule = StrongPasswordValidationRule;

var EqualityValidationRuleBase = (function (_ValidationRule21) {
  _inherits(EqualityValidationRuleBase, _ValidationRule21);

  function EqualityValidationRuleBase(otherValue, equality, otherValueLabel, ruleName) {
    _classCallCheck(this, EqualityValidationRuleBase);

    _ValidationRule21.call(this, {
      otherValue: otherValue,
      equality: equality,
      otherValueLabel: otherValueLabel
    }, function (newValue, threshold) {
      var otherValue = Utilities.getValue(threshold.otherValue);
      if (newValue instanceof Date && otherValue instanceof Date) return threshold.equality === (newValue.getTime() === otherValue.getTime());
      return threshold.equality === (newValue === otherValue);
    }, null, ruleName || 'EqualityValidationRuleBase');
  }

  return EqualityValidationRuleBase;
})(ValidationRule);

exports.EqualityValidationRuleBase = EqualityValidationRuleBase;

var EqualityValidationRule = (function (_EqualityValidationRuleBase) {
  _inherits(EqualityValidationRule, _EqualityValidationRuleBase);

  function EqualityValidationRule(otherValue) {
    _classCallCheck(this, EqualityValidationRule);

    _EqualityValidationRuleBase.call(this, otherValue, true, null, 'EqualityValidationRule');
  }

  return EqualityValidationRule;
})(EqualityValidationRuleBase);

exports.EqualityValidationRule = EqualityValidationRule;

var EqualityWithOtherLabelValidationRule = (function (_EqualityValidationRuleBase2) {
  _inherits(EqualityWithOtherLabelValidationRule, _EqualityValidationRuleBase2);

  function EqualityWithOtherLabelValidationRule(otherValue, otherLabel) {
    _classCallCheck(this, EqualityWithOtherLabelValidationRule);

    _EqualityValidationRuleBase2.call(this, otherValue, true, otherLabel, 'EqualityWithOtherLabelValidationRule');
  }

  return EqualityWithOtherLabelValidationRule;
})(EqualityValidationRuleBase);

exports.EqualityWithOtherLabelValidationRule = EqualityWithOtherLabelValidationRule;

var InEqualityValidationRule = (function (_EqualityValidationRuleBase3) {
  _inherits(InEqualityValidationRule, _EqualityValidationRuleBase3);

  function InEqualityValidationRule(otherValue) {
    _classCallCheck(this, InEqualityValidationRule);

    _EqualityValidationRuleBase3.call(this, otherValue, false, null, 'InEqualityValidationRule');
  }

  return InEqualityValidationRule;
})(EqualityValidationRuleBase);

exports.InEqualityValidationRule = InEqualityValidationRule;

var InEqualityWithOtherLabelValidationRule = (function (_EqualityValidationRuleBase4) {
  _inherits(InEqualityWithOtherLabelValidationRule, _EqualityValidationRuleBase4);

  function InEqualityWithOtherLabelValidationRule(otherValue, otherLabel) {
    _classCallCheck(this, InEqualityWithOtherLabelValidationRule);

    _EqualityValidationRuleBase4.call(this, otherValue, false, otherLabel, 'InEqualityWithOtherLabelValidationRule');
  }

  return InEqualityWithOtherLabelValidationRule;
})(EqualityValidationRuleBase);

exports.InEqualityWithOtherLabelValidationRule = InEqualityWithOtherLabelValidationRule;

var InCollectionValidationRule = (function (_ValidationRule22) {
  _inherits(InCollectionValidationRule, _ValidationRule22);

  function InCollectionValidationRule(collection) {
    _classCallCheck(this, InCollectionValidationRule);

    _ValidationRule22.call(this, collection, function (newValue, threshold) {
      var collection = Utilities.getValue(threshold);
      for (var i = 0; i < collection.length; i++) {
        if (newValue === collection[i]) return true;
      }
      return false;
    }, null, 'InCollectionValidationRule');
  }

  return InCollectionValidationRule;
})(ValidationRule);

exports.InCollectionValidationRule = InCollectionValidationRule;

var Validation = (function () {
  function Validation(observerLocator, validationConfig) {
    _classCallCheck(this, _Validation);

    this.observerLocator = observerLocator;
    this.config = validationConfig ? validationConfig : Validation.defaults;
  }

  Validation.prototype.on = function on(subject, configCallback) {
    var conf = new ValidationConfig(this.config);
    if (configCallback !== null && configCallback !== undefined && typeof configCallback === 'function') {
      configCallback(conf);
    }
    return new ValidationGroup(subject, this.observerLocator, conf);
  };

  Validation.prototype.onBreezeEntity = function onBreezeEntity(breezeEntity, configCallback) {
    var validation = this.on(breezeEntity, configCallback);
    validation.onBreezeEntity();
    return validation;
  };

  var _Validation = Validation;
  Validation = _aureliaDependencyInjection.inject(_aureliaBinding.ObserverLocator)(Validation) || Validation;
  return Validation;
})();

exports.Validation = Validation;

Validation.defaults = new ValidationConfig();