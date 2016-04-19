'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TWBootstrapViewStrategy = exports.TWBootstrapViewStrategyBase = exports.Validation = exports.ValidationViewStrategy = exports.InCollectionValidationRule = exports.InEqualityWithOtherLabelValidationRule = exports.InEqualityValidationRule = exports.EqualityWithOtherLabelValidationRule = exports.EqualityValidationRule = exports.EqualityValidationRuleBase = exports.StrongPasswordValidationRule = exports.MediumPasswordValidationRule = exports.AlphaNumericOrWhitespaceValidationRule = exports.AlphaOrWhitespaceValidationRule = exports.AlphaValidationRule = exports.AlphaNumericValidationRule = exports.NoSpacesValidationRule = exports.DigitValidationRule = exports.BetweenValueValidationRule = exports.MaximumInclusiveValueValidationRule = exports.MaximumValueValidationRule = exports.MinimumInclusiveValueValidationRule = exports.MinimumValueValidationRule = exports.ContainsOnlyValidationRule = exports.RegexValidationRule = exports.NumericValidationRule = exports.CustomFunctionValidationRule = exports.BetweenLengthValidationRule = exports.MaximumLengthValidationRule = exports.MinimumLengthValidationRule = exports.EmailValidationRule = exports.URLValidationRule = exports.ValidationRule = exports.SwitchCaseValidationRulesCollection = exports.ValidationRulesCollection = exports.ValidationResultProperty = exports.ValidationResult = exports.ValidationProperty = exports.ValidationLocale = exports.ValidationGroup = exports.ValidationGroupBuilder = exports.ValidationConfig = exports.ValidationConfigDefaults = exports.ValidateCustomAttribute = exports.Utilities = exports.PathObserver = exports.ValidationMetadata = exports.Debouncer = undefined;

var _class, _temp, _dec, _dec2, _class2, _dec3, _class3;

exports.ensure = ensure;

var _aureliaMetadata = require('aurelia-metadata');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTemplating = require('aurelia-templating');

var _aureliaLoader = require('aurelia-loader');

var _aureliaBinding = require('aurelia-binding');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Debouncer = exports.Debouncer = function () {
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
}();

var ValidationMetadata = exports.ValidationMetadata = (_temp = _class = function () {
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
}(), _class.metadataKey = 'aurelia:validation', _temp);

var ValidationPropertyMetadata = function () {
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
}();

function ensure(setupStep) {
  console.warn('The ensure decorator has been deprecated and will be removed in the next release.');
  return function (target, propertyName) {
    var validationMetadata = _aureliaMetadata.metadata.getOrCreateOwn(ValidationMetadata.metadataKey, ValidationMetadata, target);
    var property = validationMetadata.getOrCreateProperty(propertyName);
    property.addSetupStep(setupStep);
  };
}

var PathObserver = exports.PathObserver = function () {
  function PathObserver(observerLocator, subject, path) {
    _classCallCheck(this, PathObserver);

    this.observerLocator = observerLocator;
    this.path = path.split('.');
    this.subject = subject;
    this.observers = [];
    this.callbacks = [];
    if (this.path.length > 1) {
      this.observeParts();
    }
  }

  PathObserver.prototype.observeParts = function observeParts(propertyName) {
    var _this2 = this;

    var currentSubject = this.subject;
    var observersAreComplete = void 0;

    if (propertyName !== undefined && propertyName !== null) {
      for (var i = this.observers.length - 1; i >= 0; i--) {
        var currentObserver = this.observers[i];
        var observer = void 0;
        if (currentObserver.propertyName === propertyName) {
          break;
        }
        observer = this.observers.pop();
        if (observer && observer.subscription) {
          observer.subscription();
        }
      }
    }

    observersAreComplete = this.observers.length === this.path.length;

    var _loop = function _loop(_i) {
      var observer = _this2.observers[_i];
      var currentPath = _this2.path[_i];
      var subscription = void 0;
      var currentValue = void 0;
      if (!observer) {
        observer = _this2.observerLocator.getObserver(currentSubject, currentPath);
        _this2.observers.push(observer);
        subscription = observer.subscribe(function (newValue, oldValue) {
          _this2.observeParts(observer.propertyName);
        });
        observer.subscription = subscription;
      }
      currentValue = observer.getValue();
      if (currentValue === undefined || currentValue === null) {
        return 'break';
      } else {
        currentSubject = currentValue;
      }
    };

    for (var _i = 0; _i < this.path.length; _i++) {
      var _ret = _loop(_i);

      if (_ret === 'break') break;
    }

    if (!observersAreComplete && this.observers.length === this.path.length) {
      var actualObserver = this.observers[this.observers.length - 1];
      for (var _i2 = 0; _i2 < this.callbacks.length; _i2++) {
        actualObserver.subscribe(this.callbacks[_i2]);
      }
    }
  };

  PathObserver.prototype.observePart = function observePart(part) {
    if (part !== this.path[this.path.length - 1]) {
      this.observeParts();
    }
  };

  PathObserver.prototype.getObserver = function getObserver() {
    if (this.path.length === 1) {
      this.subject[this.path[0]];
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

    if (this.observers.length !== this.path.length) {
      return undefined;
    }
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
    if (this.subscription) {
      this.subscription();
    }
    for (var i = this.observers.length - 1; i >= 0; i--) {
      var observer = this.observers.pop();
      if (observer && observer.subscription) {
        observer.subscription();
      }
    }
  };

  return PathObserver;
}();

var Utilities = exports.Utilities = function () {
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
    if (val === '') {
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
      return val.length === 0;
    }
    return false;
  };

  return Utilities;
}();

var ValidateCustomAttribute = exports.ValidateCustomAttribute = (_dec = (0, _aureliaTemplating.customAttribute)('validate'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec(_class2 = _dec2(_class2 = function () {
  function ValidateCustomAttribute(element) {
    _classCallCheck(this, ValidateCustomAttribute);

    this.element = element;
    this.processedValidation = null;
    this.viewStrategy = null;
  }

  ValidateCustomAttribute.prototype.valueChanged = function valueChanged(newValue) {
    if (this.value === null || this.value === undefined) {
      return;
    }
    this.processedValidation = this.value;
    if (typeof this.value !== 'string') {
      this.subscribeChangedHandlers(this.element);
    }
    return;
  };

  ValidateCustomAttribute.prototype.subscribeChangedHandlers = function subscribeChangedHandlers(currentElement) {
    var _this4 = this;

    var viewStrategy = this.value.config.getViewStrategy();
    var validationProperty = viewStrategy.getValidationProperty(this.value, currentElement);
    var children = currentElement.children || currentElement.childNodes;
    this.viewStrategy = viewStrategy;
    if (validationProperty !== null && validationProperty !== undefined) {
      this.viewStrategy.prepareElement(validationProperty, currentElement);
      validationProperty.onValidate(function (vp) {
        _this4.viewStrategy.updateElement(vp, currentElement);
      });
    }
    for (var i = 0; i < children.length; i++) {
      if (children[i].nodeType == 3) continue;
      this.subscribeChangedHandlers(children[i]);
    }
  };

  ValidateCustomAttribute.prototype.attached = function attached() {
    if (this.processedValidation === null || this.processedValidation === undefined) {
      this.valueChanged(this.value);
    }
  };

  return ValidateCustomAttribute;
}()) || _class2) || _class2);

var ValidationConfigDefaults = exports.ValidationConfigDefaults = function ValidationConfigDefaults() {
  _classCallCheck(this, ValidationConfigDefaults);
};

ValidationConfigDefaults._defaults = {
  debounceTimeout: 0,
  dependencies: [],
  locale: 'en-US',
  localeResources: 'aurelia-validation/resources/',
  viewStrategy: TWBootstrapViewStrategy.AppendToMessage,
  allPropertiesAreMandatory: false
};
ValidationConfigDefaults.defaults = function () {
  var defaults = {};
  Object.assign(defaults, ValidationConfigDefaults._defaults);
  return defaults;
};

var ValidationConfig = exports.ValidationConfig = function () {
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
    }
    var id = ++ValidationConfig.uniqueListenerId;
    this.changedHandlers.set(id, callback);
    return function () {
      _this5.changedHandlers.delete(id);
    };
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
}();

ValidationConfig.uniqueListenerId = 0;

var ValidationGroupBuilder = exports.ValidationGroupBuilder = function () {
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
      var _config = new ValidationConfig(this.validationGroup.config);
      if (configurationCallback !== undefined && typeof configurationCallback === 'function') {
        configurationCallback(_config);
      }
      newValidationProperty = new ValidationProperty(this.observerLocator, propertyName, this.validationGroup, propertyResult, _config);
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
    }
    return this.passesRule(new EqualityWithOtherLabelValidationRule(otherValue, otherValueLabel));
  };

  ValidationGroupBuilder.prototype.isNotEqualTo = function isNotEqualTo(otherValue, otherValueLabel) {
    if (!otherValueLabel) {
      return this.passesRule(new InEqualityValidationRule(otherValue));
    }
    return this.passesRule(new InEqualityWithOtherLabelValidationRule(otherValue, otherValueLabel));
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
    }
    return this.passesRule(new MediumPasswordValidationRule(minimumComplexityLevel));
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

  ValidationGroupBuilder.prototype.if = function _if(conditionExpression) {
    var conditionalCollection = new SwitchCaseValidationRulesCollection(conditionExpression);
    conditionalCollection.case(true);
    this.validationRuleCollections[0].addValidationRuleCollection(conditionalCollection);
    this.validationRuleCollections.unshift(conditionalCollection);
    return this.validationGroup;
  };

  ValidationGroupBuilder.prototype.else = function _else() {
    if (!this.validationRuleCollections[0].default) {
      throw Error('Invalid statement: \'else\'');
    }
    this.validationRuleCollections[0].default();
    return this.validationGroup;
  };

  ValidationGroupBuilder.prototype.endIf = function endIf() {
    if (!this.validationRuleCollections[0].default) {
      throw Error('Invalid statement: \'endIf\'');
    }
    this.validationRuleCollections.shift();
    this.checkLast();
    return this.validationGroup;
  };

  ValidationGroupBuilder.prototype.switch = function _switch(conditionExpression) {
    var _this6 = this;

    var condition = conditionExpression;
    if (condition === undefined) {
      (function () {
        var observer = _this6.validationGroup.validationProperties[_this6.validationGroup.validationProperties.length - 1].observer;
        condition = function condition() {
          return observer.getValue();
        };
      })();
    }
    var conditionalCollection = new SwitchCaseValidationRulesCollection(condition);
    this.validationRuleCollections[0].addValidationRuleCollection(conditionalCollection);
    this.validationRuleCollections.unshift(conditionalCollection);
    return this.validationGroup;
  };

  ValidationGroupBuilder.prototype.case = function _case(caseLabel) {
    if (!this.validationRuleCollections[0].default) {
      throw Error('Invalid statement: \'case\'');
    }
    this.validationRuleCollections[0].case(caseLabel);
    return this.validationGroup;
  };

  ValidationGroupBuilder.prototype.default = function _default() {
    if (!this.validationRuleCollections[0].default) {
      throw Error('Invalid statement: \'case\'');
    }
    this.validationRuleCollections[0].default();
    return this.validationGroup;
  };

  ValidationGroupBuilder.prototype.endSwitch = function endSwitch() {
    if (!this.validationRuleCollections[0].default) {
      throw Error('Invalid statement: \'endIf\'');
    }
    this.validationRuleCollections.shift();
    this.checkLast();
    return this.validationGroup;
  };

  return ValidationGroupBuilder;
}();

var ValidationGroup = exports.ValidationGroup = function () {
  function ValidationGroup(subject, observerLocator, config) {
    var _this7 = this;

    _classCallCheck(this, ValidationGroup);

    var validationMetadata = void 0;
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
    validationMetadata = _aureliaMetadata.metadata.getOwn(ValidationMetadata.metadataKey, Object.getPrototypeOf(this.subject));
    if (validationMetadata) {
      validationMetadata.setup(this);
    }
  }

  ValidationGroup.prototype.destroy = function destroy() {
    this.validationProperties.forEach(function (prop) {
      prop.destroy();
    });
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
    var errors = void 0;
    this.onPropertyValidate(function (propertyBindingPath) {
      _this8.passes(function () {
        breezeEntity.entityAspect.validateProperty(propertyBindingPath);
        errors = breezeEntity.entityAspect.getValidationErrors(propertyBindingPath);
        if (errors.length === 0) {
          return true;
        }
        return errors[0].errorMessage;
      });
    });
    this.onValidate(function () {
      breezeEntity.entityAspect.validateEntity();
      return {};
    });
    breezeEntity.entityAspect.validationErrorsChanged.subscribe(function () {
      breezeEntity.entityAspect.getValidationErrors().forEach(function (validationError) {
        var propertyName = validationError.propertyName;
        var currentResultProp = void 0;
        if (!me.result.properties[propertyName]) {
          me.ensure(propertyName);
        }
        currentResultProp = me.result.addProperty(propertyName);
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

    var _loop2 = function _loop2(i) {
      var validatorProperty = _this9.validationProperties[i];
      promise = promise.then(function () {
        return validatorProperty.validateCurrentValue(forceDirty, forceExecution);
      });
    };

    for (var i = this.validationProperties.length - 1; i >= 0; i--) {
      _loop2(i);
    }

    promise = promise.catch(function () {
      throw Error('Should never get here: a validation property should always resolve to true/false!');
    });
    this.onValidateCallbacks.forEach(function (onValidateCallback) {
      promise = promise.then(function () {
        return _this9.config.locale();
      }).then(function (locale) {
        return Promise.resolve(onValidateCallback.validationFunction()).then(function (callbackResult) {
          for (var prop in callbackResult) {
            var resultProp = void 0;
            var result = void 0;
            var newPropResult = void 0;
            if (!_this9.result.properties[prop]) {
              _this9.ensure(prop);
            }
            resultProp = _this9.result.addProperty(prop);
            result = callbackResult[prop];
            newPropResult = {
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
      }
      return Promise.reject(_this9.result);
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

  ValidationGroup.prototype.if = function _if(conditionExpression, threshold) {
    return this.builder.if(conditionExpression, threshold);
  };

  ValidationGroup.prototype.else = function _else() {
    return this.builder.else();
  };

  ValidationGroup.prototype.endIf = function endIf() {
    return this.builder.endIf();
  };

  ValidationGroup.prototype.switch = function _switch(conditionExpression) {
    return this.builder.switch(conditionExpression);
  };

  ValidationGroup.prototype.case = function _case(caseLabel) {
    return this.builder.case(caseLabel);
  };

  ValidationGroup.prototype.default = function _default() {
    return this.builder.default();
  };

  ValidationGroup.prototype.endSwitch = function endSwitch() {
    return this.builder.endSwitch();
  };

  ValidationGroup.prototype.withMessage = function withMessage(message) {
    return this.builder.withMessage(message);
  };

  return ValidationGroup;
}();

var ValidationLocale = exports.ValidationLocale = function () {
  function ValidationLocale(defaults, data) {
    _classCallCheck(this, ValidationLocale);

    this.defaults = defaults;
    this.currentLocale = data;
  }

  ValidationLocale.prototype.getValueFor = function getValueFor(identifier, category) {
    var currentLocaleSetting = void 0;
    var defaultSetting = void 0;
    if (this.currentLocale && this.currentLocale[category]) {
      currentLocaleSetting = this.currentLocale[category][identifier];
      if (currentLocaleSetting !== undefined && currentLocaleSetting !== null) {
        return currentLocaleSetting;
      }
    }
    if (this.defaults[category]) {
      defaultSetting = this.defaults[category][identifier];
      if (defaultSetting !== undefined && defaultSetting !== null) {
        return defaultSetting;
      }
    }
    throw new Error('validation: I18N: Could not find: ' + identifier + ' in category: ' + category);
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
    throw new Error('Validation message for ' + translationIdentifier + 'was in an unsupported format');
  };

  return ValidationLocale;
}();

var ValidationLocaleRepository = function () {
  function ValidationLocaleRepository() {
    _classCallCheck(this, ValidationLocaleRepository);

    this.default = null;
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

    if (!basePath) {
      basePath = 'aurelia-validation/resources/';
    }
    return new Promise(function (resolve, reject) {
      if (_this10.instances.has(localeIdentifier)) {
        var locale = _this10.instances.get(localeIdentifier);
        resolve(locale);
      } else {
        var loader = _aureliaDependencyInjection.Container.instance.get(_aureliaLoader.Loader);
        loader.loadModule(basePath + localeIdentifier).then(function (resource) {
          var locale = _this10.addLocale(localeIdentifier, resource.data);
          resolve(locale);
        });
      }
    });
  };

  ValidationLocaleRepository.prototype.addLocale = function addLocale(localeIdentifier, data) {
    var instance = new ValidationLocale(this.defaults, data);
    this.instances.set(localeIdentifier, instance);
    if (this.default === null) {
      this.default = instance;
    }
    return instance;
  };

  return ValidationLocaleRepository;
}();

ValidationLocale.Repository = new ValidationLocaleRepository();

var ValidationProperty = exports.ValidationProperty = function () {
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
    if (validationRule.validate === undefined) {
      throw new Error("That's not a valid validationRule");
    }
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
    if (this.subscription) {
      this.subscription();
    }
  };

  ValidationProperty.prototype.validate = function validate(newValue, shouldBeDirty, forceExecution) {
    var _this12 = this;

    if (!this.propertyResult.isDirty && shouldBeDirty || this.latestValue !== newValue || forceExecution) {
      this.latestValue = newValue;
      return this.config.locale().then(function (locale) {
        return _this12.collectionOfValidationRules.validate(newValue, locale).then(function (validationResponse) {
          if (_this12.latestValue === validationResponse.latestValue) {
            _this12.propertyResult.setValidity(validationResponse, shouldBeDirty);
          }
          return validationResponse.isValid;
        }).catch(function (err) {
          throw Error('Unexpected behavior: a validation-rules-collection should always fulfil');
        });
      }, function () {
        throw Error('An exception occurred while trying to load the locale');
      });
    }
  };

  return ValidationProperty;
}();

var ValidationResult = exports.ValidationResult = function () {
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
}();

var ValidationResultProperty = exports.ValidationResultProperty = function () {
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

    if (shouldBeDirty) {
      this.isDirty = true;
    }
    this.message = validationResponse.message;
    this.failingRule = validationResponse.failingRule;
    this.isValid = validationResponse.isValid;
    this.latestValue = validationResponse.latestValue;
    if (this.isValid !== this.group.isValid) {
      this.group.checkValidity();
    }
    if (notifyObservers) {
      this.notifyObserversOfChange();
    }
  };

  return ValidationResultProperty;
}();

var ValidationRulesCollection = exports.ValidationRulesCollection = function () {
  function ValidationRulesCollection(config) {
    _classCallCheck(this, ValidationRulesCollection);

    this.isRequired = config ? config.getValue('allPropertiesAreMandatory') : false;
    this.validationRules = [];
    this.validationCollections = [];
    this.isRequiredMessage = null;
  }

  ValidationRulesCollection.prototype.validate = function validate(newValue, locale) {
    var executeRules = true;
    var thisMessage = void 0;
    var checks = void 0;
    if (locale === undefined) {
      locale = ValidationLocale.Repository.default;
    }
    newValue = Utilities.getValue(newValue);
    if (this.isRequiredMessage) {
      thisMessage = typeof this.isRequiredMessage === 'function' ? this.isRequiredMessage(newValue) : this.isRequiredMessage;
    } else {
      thisMessage = locale.translate('isRequired');
    }
    if (Utilities.isEmptyValue(newValue)) {
      if (this.isRequired) {
        return Promise.resolve({
          isValid: false,
          message: thisMessage,
          failingRule: 'isRequired',
          latestValue: newValue
        });
      }
      executeRules = false;
    }
    checks = Promise.resolve({
      isValid: true,
      message: '',
      failingRule: null,
      latestValue: newValue
    });
    if (executeRules) {
      this.validationRules.forEach(function (rule) {
        checks = checks.then(function (previousRuleResult) {
          if (previousRuleResult.isValid === false) {
            return previousRuleResult;
          }
          return rule.validate(newValue, locale).then(function (thisRuleResult) {
            if (thisRuleResult === false) {
              return {
                isValid: false,
                message: rule.explain(),
                failingRule: rule.ruleName,
                latestValue: newValue
              };
            }
            if (!previousRuleResult.isValid) {
              throw Error("ValidationRulesCollection.validate caught an unexpected result while validating it's chain of rules.");
            }
            return previousRuleResult;
          });
        });
      });
    }
    this.validationCollections.forEach(function (validationCollection) {
      checks = checks.then(function (previousValidationResult) {
        if (previousValidationResult.isValid) {
          return validationCollection.validate(newValue, locale);
        }
        return previousValidationResult;
      });
    });
    return checks;
  };

  ValidationRulesCollection.prototype.addValidationRule = function addValidationRule(validationRule) {
    if (validationRule.validate === undefined) {
      throw new Error("That's not a valid validationRule");
    }
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
    if (this.validationRules.length === 0) {
      this.isRequiredMessage = message;
    } else {
      this.validationRules[this.validationRules.length - 1].withMessage(message);
    }
  };

  return ValidationRulesCollection;
}();

var SwitchCaseValidationRulesCollection = exports.SwitchCaseValidationRulesCollection = function () {
  function SwitchCaseValidationRulesCollection(conditionExpression, config) {
    _classCallCheck(this, SwitchCaseValidationRulesCollection);

    this.conditionExpression = conditionExpression;
    this.config = config;
    this.innerCollections = [];
    this.defaultCollection = new ValidationRulesCollection(this.config);
    this.caseLabel = '';
    this.defaultCaseLabel = { description: 'this is the case label for \'default\'' };
  }

  SwitchCaseValidationRulesCollection.prototype.case = function _case(caseLabel) {
    this.caseLabel = caseLabel;
    this.getCurrentCollection(caseLabel, true);
  };

  SwitchCaseValidationRulesCollection.prototype.default = function _default() {
    this.caseLabel = this.defaultCaseLabel;
  };

  SwitchCaseValidationRulesCollection.prototype.getCurrentCollection = function getCurrentCollection(caseLabel) {
    var createIfNotExists = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    if (caseLabel === this.defaultCaseLabel) {
      return this.defaultCollection;
    }
    var currentCollection = null;
    for (var i = 0; i < this.innerCollections.length; i++) {
      currentCollection = this.innerCollections[i];
      if (currentCollection.caseLabel === caseLabel) {
        return currentCollection.collection;
      }
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
    if (collection !== null) {
      return collection.validate(newValue, locale);
    }
    return this.defaultCollection.validate(newValue, locale);
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
    if (collection !== null) {
      collection.isNotEmpty();
    } else {
      this.defaultCollection.isNotEmpty();
    }
  };

  SwitchCaseValidationRulesCollection.prototype.canBeEmpty = function canBeEmpty() {
    var collection = this.getCurrentCollection(this.caseLabel);
    if (collection !== null) {
      collection.canBeEmpty();
    } else {
      this.defaultCollection.canBeEmpty();
    }
  };

  SwitchCaseValidationRulesCollection.prototype.withMessage = function withMessage(message) {
    var collection = this.getCurrentCollection(this.caseLabel);
    if (collection !== null) {
      collection.withMessage(message);
    } else {
      this.defaultCollection.withMessage(message);
    }
  };

  return SwitchCaseValidationRulesCollection;
}();

var ValidationRule = exports.ValidationRule = function () {
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
    }
    if (typeof result === 'string') {
      this.errorMessage = result;
    } else {
      if (this.message) {
        if (typeof this.message === 'function') {
          this.errorMessage = this.message(currentValue, this.threshold);
        } else if (typeof this.message === 'string') {
          this.errorMessage = this.message;
        } else {
          throw Error('Unable to handle the error message:' + this.message);
        }
      } else {
        this.errorMessage = locale.translate(this.ruleName, currentValue, this.threshold);
      }
    }
    return false;
  };

  ValidationRule.prototype.validate = function validate(currentValue, locale) {
    var _this13 = this;

    if (locale === undefined) {
      locale = ValidationLocale.Repository.default;
    }
    currentValue = Utilities.getValue(currentValue);
    var result = this.onValidate(currentValue, this.threshold, locale);
    var promise = Promise.resolve(result);

    var nextPromise = promise.then(function (promiseResult) {
      return _this13.setResult(promiseResult, currentValue, locale);
    }, function (promiseFailure) {
      if (typeof promiseFailure === 'string' && promiseFailure !== '') {
        return _this13.setResult(promiseFailure, currentValue, locale);
      }
      return _this13.setResult(false, currentValue, locale);
    });
    return nextPromise;
  };

  return ValidationRule;
}();

var URLValidationRule = exports.URLValidationRule = function (_ValidationRule) {
  _inherits(URLValidationRule, _ValidationRule);

  URLValidationRule.isIP = function isIP(str, version) {
    var ipv4Maybe = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
    var ipv6Block = /^[0-9A-F]{1,4}$/i;
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
      if (blocks.length > 8) {
        return false;
      }

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
          if (foundOmissionBlock) {
            return false;
          }
          foundOmissionBlock = true;
        } else if (!ipv6Block.test(blocks[i])) {
          return false;
        }
      }
      if (foundOmissionBlock) {
        return blocks.length >= 1;
      }
      return blocks.length === 8;
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

  function URLValidationRule(startingThreshold) {
    _classCallCheck(this, URLValidationRule);

    var defaultUrlOptions = {
      protocols: ['http', 'https', 'ftp'],
      require_tld: true,
      require_protocol: false,
      allow_underscores: true,
      allow_trailing_dot: false,
      allow_protocol_relative_urls: true
    };
    if (startingThreshold === undefined) {
      startingThreshold = defaultUrlOptions;
    }
    return _possibleConstructorReturn(this, _ValidationRule.call(this, startingThreshold, function (newValue, threshold) {
      var url = newValue;
      var protocol = void 0;
      var auth = void 0;
      var host = void 0;
      var hostname = void 0;
      var port = void 0;
      var portStr = void 0;
      var split = void 0;
      if (!url || url.length >= 2083 || /\s/.test(url)) {
        return false;
      }
      if (url.indexOf('mailto:') === 0) {
        return false;
      }
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
        portStr = split.join(':');
        port = parseInt(portStr, 10);
        if (!/^[0-9]+$/.test(portStr) || port <= 0 || port > 65535) {
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
    }, null, 'URLValidationRule'));
  }

  return URLValidationRule;
}(ValidationRule);

var EmailValidationRule = exports.EmailValidationRule = function (_ValidationRule2) {
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

    return _possibleConstructorReturn(this, _ValidationRule2.call(this, null, function (newValue, threshold) {
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
    }, null, 'EmailValidationRule'));
  }

  return EmailValidationRule;
}(ValidationRule);

var MinimumLengthValidationRule = exports.MinimumLengthValidationRule = function (_ValidationRule3) {
  _inherits(MinimumLengthValidationRule, _ValidationRule3);

  function MinimumLengthValidationRule(minimumLength) {
    _classCallCheck(this, MinimumLengthValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule3.call(this, minimumLength, function (newValue, minLength) {
      newValue = typeof newValue === 'number' ? newValue.toString() : newValue;
      return newValue.length !== undefined && newValue.length >= minLength;
    }, null, 'MinimumLengthValidationRule'));
  }

  return MinimumLengthValidationRule;
}(ValidationRule);

var MaximumLengthValidationRule = exports.MaximumLengthValidationRule = function (_ValidationRule4) {
  _inherits(MaximumLengthValidationRule, _ValidationRule4);

  function MaximumLengthValidationRule(maximumLength) {
    _classCallCheck(this, MaximumLengthValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule4.call(this, maximumLength, function (newValue, maxLength) {
      newValue = typeof newValue === 'number' ? newValue.toString() : newValue;
      return newValue.length !== undefined && newValue.length <= maxLength;
    }, null, 'MaximumLengthValidationRule'));
  }

  return MaximumLengthValidationRule;
}(ValidationRule);

var BetweenLengthValidationRule = exports.BetweenLengthValidationRule = function (_ValidationRule5) {
  _inherits(BetweenLengthValidationRule, _ValidationRule5);

  function BetweenLengthValidationRule(minimumLength, maximumLength) {
    _classCallCheck(this, BetweenLengthValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule5.call(this, { minimumLength: minimumLength, maximumLength: maximumLength }, function (newValue, threshold) {
      newValue = typeof newValue === 'number' ? newValue.toString() : newValue;
      return newValue.length !== undefined && newValue.length >= threshold.minimumLength && newValue.length <= threshold.maximumLength;
    }, null, 'BetweenLengthValidationRule'));
  }

  return BetweenLengthValidationRule;
}(ValidationRule);

var CustomFunctionValidationRule = exports.CustomFunctionValidationRule = function (_ValidationRule6) {
  _inherits(CustomFunctionValidationRule, _ValidationRule6);

  function CustomFunctionValidationRule(customFunction, threshold) {
    _classCallCheck(this, CustomFunctionValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule6.call(this, threshold, customFunction, null, 'CustomFunctionValidationRule'));
  }

  return CustomFunctionValidationRule;
}(ValidationRule);

var NumericValidationRule = exports.NumericValidationRule = function (_ValidationRule7) {
  _inherits(NumericValidationRule, _ValidationRule7);

  function NumericValidationRule() {
    _classCallCheck(this, NumericValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule7.call(this, null, function (newValue, threshold, locale) {
      var numericRegex = locale.setting('numericRegex');
      var floatValue = parseFloat(newValue);
      return !Number.isNaN(parseFloat(newValue)) && Number.isFinite(floatValue) && numericRegex.test(newValue);
    }, null, 'NumericValidationRule'));
  }

  return NumericValidationRule;
}(ValidationRule);

var RegexValidationRule = exports.RegexValidationRule = function (_ValidationRule8) {
  _inherits(RegexValidationRule, _ValidationRule8);

  function RegexValidationRule(startingRegex, ruleName) {
    _classCallCheck(this, RegexValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule8.call(this, startingRegex, function (newValue, regex) {
      return regex.test(newValue);
    }, null, ruleName || 'RegexValidationRule'));
  }

  return RegexValidationRule;
}(ValidationRule);

var ContainsOnlyValidationRule = exports.ContainsOnlyValidationRule = function (_RegexValidationRule) {
  _inherits(ContainsOnlyValidationRule, _RegexValidationRule);

  function ContainsOnlyValidationRule(regex) {
    _classCallCheck(this, ContainsOnlyValidationRule);

    return _possibleConstructorReturn(this, _RegexValidationRule.call(this, regex, 'ContainsOnlyValidationRule'));
  }

  return ContainsOnlyValidationRule;
}(RegexValidationRule);

var MinimumValueValidationRule = exports.MinimumValueValidationRule = function (_ValidationRule9) {
  _inherits(MinimumValueValidationRule, _ValidationRule9);

  function MinimumValueValidationRule(minimumValue) {
    _classCallCheck(this, MinimumValueValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule9.call(this, minimumValue, function (newValue, minValue) {
      return Utilities.getValue(minValue) < newValue;
    }, null, 'MinimumValueValidationRule'));
  }

  return MinimumValueValidationRule;
}(ValidationRule);

var MinimumInclusiveValueValidationRule = exports.MinimumInclusiveValueValidationRule = function (_ValidationRule10) {
  _inherits(MinimumInclusiveValueValidationRule, _ValidationRule10);

  function MinimumInclusiveValueValidationRule(minimumValue) {
    _classCallCheck(this, MinimumInclusiveValueValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule10.call(this, minimumValue, function (newValue, minValue) {
      return Utilities.getValue(minValue) <= newValue;
    }, null, 'MinimumInclusiveValueValidationRule'));
  }

  return MinimumInclusiveValueValidationRule;
}(ValidationRule);

var MaximumValueValidationRule = exports.MaximumValueValidationRule = function (_ValidationRule11) {
  _inherits(MaximumValueValidationRule, _ValidationRule11);

  function MaximumValueValidationRule(maximumValue) {
    _classCallCheck(this, MaximumValueValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule11.call(this, maximumValue, function (newValue, maxValue) {
      return newValue < Utilities.getValue(maxValue);
    }, null, 'MaximumValueValidationRule'));
  }

  return MaximumValueValidationRule;
}(ValidationRule);

var MaximumInclusiveValueValidationRule = exports.MaximumInclusiveValueValidationRule = function (_ValidationRule12) {
  _inherits(MaximumInclusiveValueValidationRule, _ValidationRule12);

  function MaximumInclusiveValueValidationRule(maximumValue) {
    _classCallCheck(this, MaximumInclusiveValueValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule12.call(this, maximumValue, function (newValue, maxValue) {
      return newValue <= Utilities.getValue(maxValue);
    }, null, 'MaximumInclusiveValueValidationRule'));
  }

  return MaximumInclusiveValueValidationRule;
}(ValidationRule);

var BetweenValueValidationRule = exports.BetweenValueValidationRule = function (_ValidationRule13) {
  _inherits(BetweenValueValidationRule, _ValidationRule13);

  function BetweenValueValidationRule(minimumValue, maximumValue) {
    _classCallCheck(this, BetweenValueValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule13.call(this, { minimumValue: minimumValue, maximumValue: maximumValue }, function (newValue, threshold) {
      return Utilities.getValue(threshold.minimumValue) <= newValue && newValue <= Utilities.getValue(threshold.maximumValue);
    }, null, 'BetweenValueValidationRule'));
  }

  return BetweenValueValidationRule;
}(ValidationRule);

var DigitValidationRule = exports.DigitValidationRule = function (_ValidationRule14) {
  _inherits(DigitValidationRule, _ValidationRule14);

  function DigitValidationRule() {
    _classCallCheck(this, DigitValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule14.call(this, null, function (newValue, threshold) {
      return (/^\d+$/.test(newValue)
      );
    }, null, 'DigitValidationRule'));
  }

  return DigitValidationRule;
}(ValidationRule);

var NoSpacesValidationRule = exports.NoSpacesValidationRule = function (_ValidationRule15) {
  _inherits(NoSpacesValidationRule, _ValidationRule15);

  function NoSpacesValidationRule() {
    _classCallCheck(this, NoSpacesValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule15.call(this, null, function (newValue, threshold) {
      return (/^\S*$/.test(newValue)
      );
    }, null, 'NoSpacesValidationRule'));
  }

  return NoSpacesValidationRule;
}(ValidationRule);

var AlphaNumericValidationRule = exports.AlphaNumericValidationRule = function (_ValidationRule16) {
  _inherits(AlphaNumericValidationRule, _ValidationRule16);

  function AlphaNumericValidationRule() {
    _classCallCheck(this, AlphaNumericValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule16.call(this, null, function (newValue, threshold) {
      return (/^[a-z0-9]+$/i.test(newValue)
      );
    }, null, 'AlphaNumericValidationRule'));
  }

  return AlphaNumericValidationRule;
}(ValidationRule);

var AlphaValidationRule = exports.AlphaValidationRule = function (_ValidationRule17) {
  _inherits(AlphaValidationRule, _ValidationRule17);

  function AlphaValidationRule() {
    _classCallCheck(this, AlphaValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule17.call(this, null, function (newValue, threshold) {
      return (/^[a-z]+$/i.test(newValue)
      );
    }, null, 'AlphaValidationRule'));
  }

  return AlphaValidationRule;
}(ValidationRule);

var AlphaOrWhitespaceValidationRule = exports.AlphaOrWhitespaceValidationRule = function (_ValidationRule18) {
  _inherits(AlphaOrWhitespaceValidationRule, _ValidationRule18);

  function AlphaOrWhitespaceValidationRule() {
    _classCallCheck(this, AlphaOrWhitespaceValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule18.call(this, null, function (newValue, threshold) {
      return (/^[a-z\s]+$/i.test(newValue)
      );
    }, null, 'AlphaOrWhitespaceValidationRule'));
  }

  return AlphaOrWhitespaceValidationRule;
}(ValidationRule);

var AlphaNumericOrWhitespaceValidationRule = exports.AlphaNumericOrWhitespaceValidationRule = function (_ValidationRule19) {
  _inherits(AlphaNumericOrWhitespaceValidationRule, _ValidationRule19);

  function AlphaNumericOrWhitespaceValidationRule() {
    _classCallCheck(this, AlphaNumericOrWhitespaceValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule19.call(this, null, function (newValue, threshold) {
      return (/^[a-z0-9\s]+$/i.test(newValue)
      );
    }, null, 'AlphaNumericOrWhitespaceValidationRule'));
  }

  return AlphaNumericOrWhitespaceValidationRule;
}(ValidationRule);

var MediumPasswordValidationRule = exports.MediumPasswordValidationRule = function (_ValidationRule20) {
  _inherits(MediumPasswordValidationRule, _ValidationRule20);

  function MediumPasswordValidationRule(minimumComplexityLevel, ruleName) {
    _classCallCheck(this, MediumPasswordValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule20.call(this, minimumComplexityLevel ? minimumComplexityLevel : 3, function (newValue, threshold) {
      if (typeof newValue !== 'string') {
        return false;
      }
      var strength = 0;
      strength += /[A-Z]+/.test(newValue) ? 1 : 0;
      strength += /[a-z]+/.test(newValue) ? 1 : 0;
      strength += /[0-9]+/.test(newValue) ? 1 : 0;
      strength += /[\W]+/.test(newValue) ? 1 : 0;
      return strength >= threshold;
    }, null, ruleName || 'MediumPasswordValidationRule'));
  }

  return MediumPasswordValidationRule;
}(ValidationRule);

var StrongPasswordValidationRule = exports.StrongPasswordValidationRule = function (_MediumPasswordValida) {
  _inherits(StrongPasswordValidationRule, _MediumPasswordValida);

  function StrongPasswordValidationRule() {
    _classCallCheck(this, StrongPasswordValidationRule);

    return _possibleConstructorReturn(this, _MediumPasswordValida.call(this, 4, 'StrongPasswordValidationRule'));
  }

  return StrongPasswordValidationRule;
}(MediumPasswordValidationRule);

var EqualityValidationRuleBase = exports.EqualityValidationRuleBase = function (_ValidationRule21) {
  _inherits(EqualityValidationRuleBase, _ValidationRule21);

  function EqualityValidationRuleBase(startingOtherValue, equality, otherValueLabel, ruleName) {
    _classCallCheck(this, EqualityValidationRuleBase);

    return _possibleConstructorReturn(this, _ValidationRule21.call(this, {
      otherValue: startingOtherValue,
      equality: equality,
      otherValueLabel: otherValueLabel
    }, function (newValue, threshold) {
      var otherValue = Utilities.getValue(threshold.otherValue);
      if (newValue instanceof Date && otherValue instanceof Date) {
        return threshold.equality === (newValue.getTime() === otherValue.getTime());
      }
      return threshold.equality === (newValue === otherValue);
    }, null, ruleName || 'EqualityValidationRuleBase'));
  }

  return EqualityValidationRuleBase;
}(ValidationRule);

var EqualityValidationRule = exports.EqualityValidationRule = function (_EqualityValidationRu) {
  _inherits(EqualityValidationRule, _EqualityValidationRu);

  function EqualityValidationRule(otherValue) {
    _classCallCheck(this, EqualityValidationRule);

    return _possibleConstructorReturn(this, _EqualityValidationRu.call(this, otherValue, true, null, 'EqualityValidationRule'));
  }

  return EqualityValidationRule;
}(EqualityValidationRuleBase);

var EqualityWithOtherLabelValidationRule = exports.EqualityWithOtherLabelValidationRule = function (_EqualityValidationRu2) {
  _inherits(EqualityWithOtherLabelValidationRule, _EqualityValidationRu2);

  function EqualityWithOtherLabelValidationRule(otherValue, otherLabel) {
    _classCallCheck(this, EqualityWithOtherLabelValidationRule);

    return _possibleConstructorReturn(this, _EqualityValidationRu2.call(this, otherValue, true, otherLabel, 'EqualityWithOtherLabelValidationRule'));
  }

  return EqualityWithOtherLabelValidationRule;
}(EqualityValidationRuleBase);

var InEqualityValidationRule = exports.InEqualityValidationRule = function (_EqualityValidationRu3) {
  _inherits(InEqualityValidationRule, _EqualityValidationRu3);

  function InEqualityValidationRule(otherValue) {
    _classCallCheck(this, InEqualityValidationRule);

    return _possibleConstructorReturn(this, _EqualityValidationRu3.call(this, otherValue, false, null, 'InEqualityValidationRule'));
  }

  return InEqualityValidationRule;
}(EqualityValidationRuleBase);

var InEqualityWithOtherLabelValidationRule = exports.InEqualityWithOtherLabelValidationRule = function (_EqualityValidationRu4) {
  _inherits(InEqualityWithOtherLabelValidationRule, _EqualityValidationRu4);

  function InEqualityWithOtherLabelValidationRule(otherValue, otherLabel) {
    _classCallCheck(this, InEqualityWithOtherLabelValidationRule);

    return _possibleConstructorReturn(this, _EqualityValidationRu4.call(this, otherValue, false, otherLabel, 'InEqualityWithOtherLabelValidationRule'));
  }

  return InEqualityWithOtherLabelValidationRule;
}(EqualityValidationRuleBase);

var InCollectionValidationRule = exports.InCollectionValidationRule = function (_ValidationRule22) {
  _inherits(InCollectionValidationRule, _ValidationRule22);

  function InCollectionValidationRule(startingCollection) {
    _classCallCheck(this, InCollectionValidationRule);

    return _possibleConstructorReturn(this, _ValidationRule22.call(this, startingCollection, function (newValue, threshold) {
      var collection = Utilities.getValue(threshold);
      for (var i = 0; i < collection.length; i++) {
        if (newValue === collection[i]) {
          return true;
        }
      }
      return false;
    }, null, 'InCollectionValidationRule'));
  }

  return InCollectionValidationRule;
}(ValidationRule);

var ValidationViewStrategy = exports.ValidationViewStrategy = function () {
  function ValidationViewStrategy() {
    _classCallCheck(this, ValidationViewStrategy);

    this.bindingPathAttributes = ['validate', 'value.bind', 'value.two-way'];
  }

  ValidationViewStrategy.prototype.getValidationProperty = function getValidationProperty(validation, element) {
    var atts = element.attributes;
    for (var i = 0; i < this.bindingPathAttributes.length; i++) {
      var attributeName = this.bindingPathAttributes[i];
      var bindingPath = void 0;
      var validationProperty = void 0;
      if (atts[attributeName]) {
        bindingPath = atts[attributeName].value.trim();
        if (bindingPath.indexOf('|') !== -1) {
          bindingPath = bindingPath.split('|')[0].trim();
        }

        validationProperty = validation.result.properties[bindingPath];
        if (attributeName === 'validate' && (validationProperty === null || validationProperty === undefined)) {
          validation.ensure(bindingPath);
          validationProperty = validation.result.properties[bindingPath];
        }
        return validationProperty;
      }
    }

    return null;
  };

  ValidationViewStrategy.prototype.prepareElement = function prepareElement(validationProperty, element) {
    throw Error('View strategy must implement prepareElement(validationProperty, element)');
  };

  ValidationViewStrategy.prototype.updateElement = function updateElement(validationProperty, element) {
    throw Error('View strategy must implement updateElement(validationProperty, element)');
  };

  return ValidationViewStrategy;
}();

var Validation = exports.Validation = (_dec3 = (0, _aureliaDependencyInjection.inject)(_aureliaBinding.ObserverLocator), _dec3(_class3 = function () {
  function Validation(observerLocator, validationConfig) {
    _classCallCheck(this, Validation);

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

  return Validation;
}()) || _class3);

Validation.defaults = new ValidationConfig();

var TWBootstrapViewStrategyBase = exports.TWBootstrapViewStrategyBase = function (_ValidationViewStrate) {
  _inherits(TWBootstrapViewStrategyBase, _ValidationViewStrate);

  function TWBootstrapViewStrategyBase(appendMessageToInput, appendMessageToLabel, helpBlockClass) {
    _classCallCheck(this, TWBootstrapViewStrategyBase);

    var _this42 = _possibleConstructorReturn(this, _ValidationViewStrate.call(this));

    _this42.appendMessageToInput = appendMessageToInput;
    _this42.appendMessageToLabel = appendMessageToLabel;
    _this42.helpBlockClass = helpBlockClass;
    return _this42;
  }

  TWBootstrapViewStrategyBase.prototype.searchFormGroup = function searchFormGroup(currentElement, currentDepth) {
    if (currentDepth === 5) {
      return null;
    }

    if (currentElement.classList && currentElement.classList.contains('form-group')) {
      return currentElement;
    }

    return this.searchFormGroup(currentElement.parentNode, 1 + currentDepth);
  };

  TWBootstrapViewStrategyBase.prototype.findLabels = function findLabels(formGroup, inputId) {
    var labels = [];
    this.findLabelsRecursively(formGroup, inputId, labels, 0);
    return labels;
  };

  TWBootstrapViewStrategyBase.prototype.findLabelsRecursively = function findLabelsRecursively(currentElement, inputId, currentLabels, currentDepth) {
    if (currentDepth === 5) {
      return;
    }
    if (currentElement.nodeName === 'LABEL' && (currentElement.attributes.for && currentElement.attributes.for.value === inputId || !currentElement.attributes.for)) {
      currentLabels.push(currentElement);
    }
    for (var i = 0; i < currentElement.children.length; i++) {
      this.findLabelsRecursively(currentElement.children[i], inputId, currentLabels, 1 + currentDepth);
    }
  };

  TWBootstrapViewStrategyBase.prototype.appendMessageToElement = function appendMessageToElement(element, validationProperty) {
    var helpBlock = element.nextSibling;
    if (helpBlock) {
      if (!helpBlock.classList) {
        helpBlock = null;
      } else if (!helpBlock.classList.contains(this.helpBlockClass)) {
        helpBlock = null;
      }
    }

    if (!helpBlock) {
      helpBlock = document.createElement('p');
      helpBlock.classList.add('help-block');
      helpBlock.classList.add(this.helpBlockClass);
      if (element.nextSibling) {
        element.parentNode.insertBefore(helpBlock, element.nextSibling);
      } else {
        element.parentNode.appendChild(helpBlock);
      }
    }

    helpBlock.textContent = validationProperty ? validationProperty.message : '';
  };

  TWBootstrapViewStrategyBase.prototype.appendUIVisuals = function appendUIVisuals(validationProperty, currentElement) {
    var formGroup = this.searchFormGroup(currentElement, 0);
    if (formGroup === null) {
      return;
    }

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
  };

  TWBootstrapViewStrategyBase.prototype.prepareElement = function prepareElement(validationProperty, element) {
    this.appendUIVisuals(null, element);
  };

  TWBootstrapViewStrategyBase.prototype.updateElement = function updateElement(validationProperty, element) {
    this.appendUIVisuals(validationProperty, element);
  };

  return TWBootstrapViewStrategyBase;
}(ValidationViewStrategy);

var TWBootstrapViewStrategy = exports.TWBootstrapViewStrategy = function TWBootstrapViewStrategy() {
  _classCallCheck(this, TWBootstrapViewStrategy);
};

TWBootstrapViewStrategy.AppendToInput = new TWBootstrapViewStrategyBase(true, false, 'aurelia-validation-message');
TWBootstrapViewStrategy.AppendToMessage = new TWBootstrapViewStrategyBase(false, true, 'aurelia-validation-message');