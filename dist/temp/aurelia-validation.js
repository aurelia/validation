'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationRendererCustomAttribute = exports.ValidationErrorsCustomAttribute = exports.ValidateBindingBehavior = exports.ValidationController = exports.Validator = exports.validationRenderer = exports.validateTrigger = exports.ValidationError = undefined;

var _dec, _class2, _dec2, _class4, _dec3, _dec4, _class5;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.getPropertyInfo = getPropertyInfo;

var _aureliaBinding = require('aurelia-binding');

var _aureliaMetadata = require('aurelia-metadata');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTaskQueue = require('aurelia-task-queue');

var _aureliaTemplating = require('aurelia-templating');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValidationError = exports.ValidationError = function ValidationError(rule, message, object) {
  var propertyName = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

  _classCallCheck(this, ValidationError);

  this.rule = rule;
  this.message = message;
  this.object = object;
  this.propertyName = propertyName || null;
};

var validateTrigger = exports.validateTrigger = {
  blur: 'blur',

  change: 'change',

  manual: 'manual'
};

function getObject(expression, objectExpression, source) {
  var value = objectExpression.evaluate(source);
  if (value !== null && ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' || typeof value === 'function')) {
    return value;
  }
  if (value === null) {
    value = 'null';
  } else if (value === undefined) {
    value = 'undefined';
  }
  throw new Error('The \'' + objectExpression + '\' part of \'' + expression + '\' evaluates to ' + value + ' instead of an object.');
}

function getPropertyInfo(expression, source) {
  var originalExpression = expression;
  while (expression instanceof _aureliaBinding.BindingBehavior || expression instanceof _aureliaBinding.ValueConverter) {
    expression = expression.expression;
  }

  var object = void 0;
  var property = void 0;
  if (expression instanceof _aureliaBinding.AccessScope) {
    object = source.bindingContext;
    property = expression.name;
  } else if (expression instanceof _aureliaBinding.AccessMember) {
    object = getObject(originalExpression, expression.object, source);
    property = expression.name;
  } else if (expression instanceof _aureliaBinding.AccessKeyed) {
    object = getObject(originalExpression, expression.object, source);
    property = expression.key.evaluate(source);
  } else {
    throw new Error('Expression \'' + originalExpression + '\' is not compatible with the validate binding-behavior.');
  }

  return { object: object, property: property };
}

var validationRenderer = exports.validationRenderer = _aureliaMetadata.protocol.create('aurelia:validation-renderer', function (target) {
  if (!(typeof target.render === 'function')) {
    return 'Validation renderers must implement: render(error: ValidationError, target: Element): void';
  }

  if (!(typeof target.unrender === 'function')) {
    return 'Validation renderers must implement: unrender(error: ValidationError, target: Element): void';
  }

  return true;
});

var Validator = exports.Validator = function () {
  function Validator() {
    _classCallCheck(this, Validator);
  }

  Validator.prototype.validateProperty = function validateProperty(object, propertyName) {
    var rules = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    throw new Error('A Validator must implement validateProperty');
  };

  Validator.prototype.validateObject = function validateObject(object) {
    var rules = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    throw new Error('A Validator must implement validateObject');
  };

  return Validator;
}();

var ValidationController = exports.ValidationController = (_dec = (0, _aureliaDependencyInjection.inject)(Validator), _dec(_class2 = function () {
  function ValidationController(validator) {
    _classCallCheck(this, ValidationController);

    this.bindings = new Map();
    this.renderers = [];
    this.validateTrigger = validateTrigger.blur;

    this.validator = validator;
  }

  ValidationController.prototype.addRenderer = function addRenderer(renderer) {
    for (var _iterator = this.bindings.values(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var _ref2 = _ref;
      var _target = _ref2.target;
      var errors = _ref2.errors;

      for (var i = 0, ii = errors.length; i < ii; i++) {
        renderer.render(errors[i], _target);
      }
    }
    this.renderers.push(renderer);
  };

  ValidationController.prototype.removeRenderer = function removeRenderer(renderer) {
    for (var _iterator2 = this.bindings.values(), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref3 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref3 = _i2.value;
      }

      var _ref4 = _ref3;
      var _target2 = _ref4.target;
      var errors = _ref4.errors;

      for (var i = 0, ii = errors.length; i < ii; i++) {
        renderer.unrender(errors[i], _target2);
      }
    }
    this.renderers.splice(this.renderers.indexOf(renderer), 1);
  };

  ValidationController.prototype.registerBinding = function registerBinding(binding, target) {
    var rules = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    var errors = [];
    this.bindings.set(binding, { target: target, rules: rules, errors: errors });
  };

  ValidationController.prototype.unregisterBinding = function unregisterBinding(binding) {
    this._resetBinding(binding);
    this.bindings.delete(binding);
  };

  ValidationController.prototype.validate = function validate() {
    var errors = [];
    for (var _iterator3 = this.bindings.keys(), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref5;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref5 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref5 = _i3.value;
      }

      var binding = _ref5;

      errors.splice.apply(errors, [errors.length, 0].concat(this._validateBinding(binding)));
    }
    return errors;
  };

  ValidationController.prototype.reset = function reset() {
    for (var _iterator4 = this.bindings.keys(), _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
      var _ref6;

      if (_isArray4) {
        if (_i4 >= _iterator4.length) break;
        _ref6 = _iterator4[_i4++];
      } else {
        _i4 = _iterator4.next();
        if (_i4.done) break;
        _ref6 = _i4.value;
      }

      var binding = _ref6;

      this._resetBinding(binding);
    }
  };

  ValidationController.prototype._renderError = function _renderError(error, target) {
    var renderers = this.renderers;
    var i = renderers.length;
    while (i--) {
      renderers[i].render(error, target);
    }
  };

  ValidationController.prototype._unrenderError = function _unrenderError(error, target) {
    var renderers = this.renderers;
    var i = renderers.length;
    while (i--) {
      renderers[i].unrender(error, target);
    }
  };

  ValidationController.prototype._updateErrors = function _updateErrors(errors, newErrors, target) {
    var error = void 0;
    while (error = errors.pop()) {
      this._unrenderError(error, target);
    }
    for (var i = 0, ii = newErrors.length; i < ii; i++) {
      error = newErrors[i];
      errors.push(error);
      this._renderError(error, target);
    }
  };

  ValidationController.prototype._validateBinding = function _validateBinding(binding) {
    var _bindings$get = this.bindings.get(binding);

    var target = _bindings$get.target;
    var rules = _bindings$get.rules;
    var errors = _bindings$get.errors;

    var _getPropertyInfo = getPropertyInfo(binding.sourceExpression, binding.source);

    var object = _getPropertyInfo.object;
    var property = _getPropertyInfo.property;

    var newErrors = this.validator.validateProperty(object, property, rules);
    this._updateErrors(errors, newErrors, target);
    return errors;
  };

  ValidationController.prototype._resetBinding = function _resetBinding(binding) {
    var _bindings$get2 = this.bindings.get(binding);

    var target = _bindings$get2.target;
    var errors = _bindings$get2.errors;

    this._updateErrors(errors, [], target);
  };

  return ValidationController;
}()) || _class2);
var ValidateBindingBehavior = exports.ValidateBindingBehavior = (_dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaTaskQueue.TaskQueue), _dec2(_class4 = function () {
  function ValidateBindingBehavior(taskQueue) {
    _classCallCheck(this, ValidateBindingBehavior);

    this.taskQueue = taskQueue;
  }

  ValidateBindingBehavior.prototype.getTarget = function getTarget(binding, view) {
    var target = binding.target;
    if (target instanceof Element) {
      return target;
    }
    var controller = void 0;
    for (var id in view.controllers) {
      controller = view.controllers[id];
      if (controller.viewModel === target) {
        break;
      }
    }
    return controller.view.firstChild.parentNode;
  };

  ValidateBindingBehavior.prototype.bind = function bind(binding, source, rules) {
    var _this = this;

    var target = this.getTarget(binding, source);

    var controller = source.container.get(_aureliaDependencyInjection.Optional.of(ValidationController, true));
    if (controller === null) {
      throw new Error('A ValidationController has not been registered.');
    }
    controller.registerBinding(binding, target, rules);
    binding.validationController = controller;

    if (controller.validateTrigger === validateTrigger.change) {
      binding.standardUpdateSource = binding.updateSource;
      binding.updateSource = function (value) {
        this.standardUpdateSource(value);
        this.validationController._validateBinding(this);
      };
    } else if (controller.validateTrigger === validateTrigger.blur) {
      binding.validateBlurHandler = function () {
        _this.taskQueue.queueMicroTask(function () {
          return controller._validateBinding(binding);
        });
      };
      binding.validateTarget = target;
      target.addEventListener('blur', binding.validateBlurHandler);
    }

    if (controller.validateTrigger !== validateTrigger.manual) {
      binding.standardUpdateTarget = binding.updateTarget;
      binding.updateTarget = function (value) {
        this.standardUpdateTarget(value);
        this.validationController._resetBinding(this);
      };
    }
  };

  ValidateBindingBehavior.prototype.unbind = function unbind(binding, source) {
    if (binding.standardUpdateSource) {
      binding.updateSource = binding.standardUpdateSource;
      binding.standardUpdateSource = null;
    }
    if (binding.standardUpdateTarget) {
      binding.updateTarget = binding.standardUpdateTarget;
      binding.standardUpdateTarget = null;
    }
    if (binding.validateBlurHandler) {
      binding.validateTarget.removeEventListener('blur', binding.validateBlurHandler);
      binding.validateBlurHandler = null;
      binding.validateTarget = null;
    }
    binding.validationController.unregisterBinding(binding);
    binding.validationController = null;
  };

  return ValidateBindingBehavior;
}()) || _class4);
var ValidationErrorsCustomAttribute = exports.ValidationErrorsCustomAttribute = (_dec3 = (0, _aureliaTemplating.customAttribute)('validation-errors', _aureliaBinding.bindingMode.twoWay), _dec4 = (0, _aureliaDependencyInjection.inject)(Element, _aureliaDependencyInjection.Lazy.of(ValidationController)), _dec3(_class5 = _dec4(_class5 = validationRenderer(_class5 = function () {
  function ValidationErrorsCustomAttribute(boundaryElement, controllerAccessor) {
    _classCallCheck(this, ValidationErrorsCustomAttribute);

    this.errors = [];

    this.boundaryElement = boundaryElement;
    this.controllerAccessor = controllerAccessor;
  }

  ValidationErrorsCustomAttribute.prototype.sort = function sort() {
    this.errors.sort(function (a, b) {
      if (a.target === b.target) {
        return 0;
      }
      return a.target.compareDocumentPosition(b.target) & 2 ? 1 : -1;
    });
  };

  ValidationErrorsCustomAttribute.prototype.render = function render(error, target) {
    if (!target || !(this.boundaryElement === target || this.boundaryElement.contains(target))) {
      return;
    }

    this.errors.push({ error: error, target: target });
    this.sort();
    this.value = this.errors;
  };

  ValidationErrorsCustomAttribute.prototype.unrender = function unrender(error, target) {
    var index = this.errors.findIndex(function (x) {
      return x.error === error;
    });
    if (index === -1) {
      return;
    }
    this.errors.splice(index, 1);
    this.value = this.errors;
  };

  ValidationErrorsCustomAttribute.prototype.bind = function bind() {
    this.controllerAccessor().addRenderer(this);
    this.value = this.errors;
  };

  ValidationErrorsCustomAttribute.prototype.unbind = function unbind() {
    this.controllerAccessor().removeRenderer(this);
  };

  return ValidationErrorsCustomAttribute;
}()) || _class5) || _class5) || _class5);

var ValidationRendererCustomAttribute = exports.ValidationRendererCustomAttribute = function () {
  function ValidationRendererCustomAttribute() {
    _classCallCheck(this, ValidationRendererCustomAttribute);
  }

  ValidationRendererCustomAttribute.prototype.created = function created(view) {
    this.container = view.container;
  };

  ValidationRendererCustomAttribute.prototype.bind = function bind() {
    this.controller = this.container.get(ValidationController);
    this.renderer = this.container.get(this.value);
    this.controller.addRenderer(this.renderer);
  };

  ValidationRendererCustomAttribute.prototype.unbind = function unbind() {
    this.controller.removeRenderer(this.renderer);
    this.controller = null;
    this.renderer = null;
  };

  return ValidationRendererCustomAttribute;
}();