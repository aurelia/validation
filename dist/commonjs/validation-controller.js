'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationController = undefined;

var _dec, _class;

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _validator = require('./validator');

var _validateTrigger = require('./validate-trigger');

var _propertyInfo = require('./property-info');



var ValidationController = exports.ValidationController = (_dec = (0, _aureliaDependencyInjection.inject)(_validator.Validator), _dec(_class = function () {
  function ValidationController(validator) {
    

    this.bindings = new Map();
    this.renderers = [];
    this.validateTrigger = _validateTrigger.validateTrigger.blur;

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
      var target = _ref2.target;
      var errors = _ref2.errors;

      for (var i = 0, ii = errors.length; i < ii; i++) {
        renderer.render(errors[i], target);
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
      var target = _ref4.target;
      var errors = _ref4.errors;

      for (var i = 0, ii = errors.length; i < ii; i++) {
        renderer.unrender(errors[i], target);
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

    var _getPropertyInfo = (0, _propertyInfo.getPropertyInfo)(binding.sourceExpression, binding.source);

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
}()) || _class);