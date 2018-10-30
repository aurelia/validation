System.register(['aurelia-pal', 'aurelia-binding', 'aurelia-dependency-injection', 'aurelia-task-queue', 'aurelia-templating', 'aurelia-framework', 'aurelia-logging'], function (exports, module) {
  'use strict';
  var DOM, AccessMember, AccessScope, AccessKeyed, BindingBehavior, ValueConverter, getContextFor, Parser, bindingBehavior, bindingMode, LiteralString, Binary, Conditional, LiteralPrimitive, CallMember, Optional, Lazy, TaskQueue, customAttribute, bindable, BindingLanguage, ViewResources, customAttribute$1, getLogger;
  return {
    setters: [function (module) {
      DOM = module.DOM;
    }, function (module) {
      AccessMember = module.AccessMember;
      AccessScope = module.AccessScope;
      AccessKeyed = module.AccessKeyed;
      BindingBehavior = module.BindingBehavior;
      ValueConverter = module.ValueConverter;
      getContextFor = module.getContextFor;
      Parser = module.Parser;
      bindingBehavior = module.bindingBehavior;
      bindingMode = module.bindingMode;
      LiteralString = module.LiteralString;
      Binary = module.Binary;
      Conditional = module.Conditional;
      LiteralPrimitive = module.LiteralPrimitive;
      CallMember = module.CallMember;
    }, function (module) {
      Optional = module.Optional;
      Lazy = module.Lazy;
    }, function (module) {
      TaskQueue = module.TaskQueue;
    }, function (module) {
      customAttribute = module.customAttribute;
      bindable = module.bindable;
      BindingLanguage = module.BindingLanguage;
      ViewResources = module.ViewResources;
    }, function (module) {
      customAttribute$1 = module.customAttribute;
    }, function (module) {
      getLogger = module.getLogger;
    }],
    execute: function () {

      exports({
        configure: configure,
        getTargetDOMElement: getTargetDOMElement,
        getPropertyInfo: getPropertyInfo,
        getAccessorExpression: getAccessorExpression,
        validateTrigger: void 0
      });

      /**
       * Gets the DOM element associated with the data-binding. Most of the time it's
       * the binding.target but sometimes binding.target is an aurelia custom element,
       * or custom attribute which is a javascript "class" instance, so we need to use
       * the controller's container to retrieve the actual DOM element.
       */
      function getTargetDOMElement(binding, view) {
          var target = binding.target;
          // DOM element
          if (target instanceof Element) {
              return target;
          }
          // custom element or custom attribute
          // tslint:disable-next-line:prefer-const
          for (var i = 0, ii = view.controllers.length; i < ii; i++) {
              var controller = view.controllers[i];
              if (controller.viewModel === target) {
                  var element = controller.container.get(DOM.Element);
                  if (element) {
                      return element;
                  }
                  throw new Error("Unable to locate target element for \"" + binding.sourceExpression + "\".");
              }
          }
          throw new Error("Unable to locate target element for \"" + binding.sourceExpression + "\".");
      }

      function getObject(expression, objectExpression, source) {
          var value = objectExpression.evaluate(source, null);
          if (value === null || value === undefined || value instanceof Object) {
              return value;
          }
          // tslint:disable-next-line:max-line-length
          throw new Error("The '" + objectExpression + "' part of '" + expression + "' evaluates to " + value + " instead of an object, null or undefined.");
      }
      /**
       * Retrieves the object and property name for the specified expression.
       * @param expression The expression
       * @param source The scope
       */
      function getPropertyInfo(expression, source) {
          var originalExpression = expression;
          while (expression instanceof BindingBehavior || expression instanceof ValueConverter) {
              expression = expression.expression;
          }
          var object;
          var propertyName;
          if (expression instanceof AccessScope) {
              object = getContextFor(expression.name, source, expression.ancestor);
              propertyName = expression.name;
          }
          else if (expression instanceof AccessMember) {
              object = getObject(originalExpression, expression.object, source);
              propertyName = expression.name;
          }
          else if (expression instanceof AccessKeyed) {
              object = getObject(originalExpression, expression.object, source);
              propertyName = expression.key.evaluate(source);
          }
          else {
              throw new Error("Expression '" + originalExpression + "' is not compatible with the validate binding-behavior.");
          }
          if (object === null || object === undefined) {
              return null;
          }
          return { object: object, propertyName: propertyName };
      }

      function isString(value) {
          return Object.prototype.toString.call(value) === '[object String]';
      }
      function isNumber(value) {
          return Object.prototype.toString.call(value) === '[object Number]';
      }

      var PropertyAccessorParser = exports('PropertyAccessorParser', /** @class */ (function () {
          function PropertyAccessorParser(parser) {
              this.parser = parser;
          }
          PropertyAccessorParser.prototype.parse = function (property) {
              if (isString(property) || isNumber(property)) {
                  return property;
              }
              var accessorText = getAccessorExpression(property.toString());
              var accessor = this.parser.parse(accessorText);
              if (accessor instanceof AccessScope
                  || accessor instanceof AccessMember && accessor.object instanceof AccessScope) {
                  return accessor.name;
              }
              throw new Error("Invalid property expression: \"" + accessor + "\"");
          };
          PropertyAccessorParser.inject = [Parser];
          return PropertyAccessorParser;
      }()));
      function getAccessorExpression(fn) {
          /* tslint:disable:max-line-length */
          var classic = /^function\s*\([$_\w\d]+\)\s*\{(?:\s*"use strict";)?\s*(?:[$_\w\d.['"\]+;]+)?\s*return\s+[$_\w\d]+\.([$_\w\d]+)\s*;?\s*\}$/;
          /* tslint:enable:max-line-length */
          var arrow = /^\(?[$_\w\d]+\)?\s*=>\s*[$_\w\d]+\.([$_\w\d]+)$/;
          var match = classic.exec(fn) || arrow.exec(fn);
          if (match === null) {
              throw new Error("Unable to parse accessor function:\n" + fn);
          }
          return match[1];
      }

      /*! *****************************************************************************
      Copyright (c) Microsoft Corporation. All rights reserved.
      Licensed under the Apache License, Version 2.0 (the "License"); you may not use
      this file except in compliance with the License. You may obtain a copy of the
      License at http://www.apache.org/licenses/LICENSE-2.0

      THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
      KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
      WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
      MERCHANTABLITY OR NON-INFRINGEMENT.

      See the Apache Version 2.0 License for specific language governing permissions
      and limitations under the License.
      ***************************************************************************** */
      /* global Reflect, Promise */

      var extendStatics = function(d, b) {
          extendStatics = Object.setPrototypeOf ||
              ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
              function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
          return extendStatics(d, b);
      };

      function __extends(d, b) {
          extendStatics(d, b);
          function __() { this.constructor = d; }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      }

      function __decorate(decorators, target, key, desc) {
          var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
          if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
          else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
          return c > 3 && r && Object.defineProperty(target, key, r), r;
      }

      /**
       * Validation triggers.
       */
      var validateTrigger;
      (function (validateTrigger) {
          /**
           * Manual validation.  Use the controller's `validate()` and  `reset()` methods
           * to validate all bindings.
           */
          validateTrigger[validateTrigger["manual"] = 0] = "manual";
          /**
           * Validate the binding when the binding's target element fires a DOM "blur" event.
           */
          validateTrigger[validateTrigger["blur"] = 1] = "blur";
          /**
           * Validate the binding when it updates the model due to a change in the view.
           */
          validateTrigger[validateTrigger["change"] = 2] = "change";
          /**
           * Validate the binding when the binding's target element fires a DOM "blur" event and
           * when it updates the model due to a change in the view.
           */
          validateTrigger[validateTrigger["changeOrBlur"] = 3] = "changeOrBlur";
      })(validateTrigger || (validateTrigger = exports('validateTrigger', {})));

      /**
       * Validates objects and properties.
       */
      var Validator = exports('Validator', /** @class */ (function () {
          function Validator() {
          }
          return Validator;
      }()));

      /**
       * The result of validating an individual validation rule.
       */
      var ValidateResult = exports('ValidateResult', /** @class */ (function () {
          /**
           * @param rule The rule associated with the result. Validator implementation specific.
           * @param object The object that was validated.
           * @param propertyName The name of the property that was validated.
           * @param error The error, if the result is a validation error.
           */
          function ValidateResult(rule, object, propertyName, valid, message) {
              if (message === void 0) { message = null; }
              this.rule = rule;
              this.object = object;
              this.propertyName = propertyName;
              this.valid = valid;
              this.message = message;
              this.id = ValidateResult.nextId++;
          }
          ValidateResult.prototype.toString = function () {
              return this.valid ? 'Valid.' : this.message;
          };
          ValidateResult.nextId = 0;
          return ValidateResult;
      }()));

      var ValidateEvent = exports('ValidateEvent', /** @class */ (function () {
          function ValidateEvent(
          /**
           * The type of validate event. Either "validate" or "reset".
           */
          type, 
          /**
           * The controller's current array of errors. For an array containing both
           * failed rules and passed rules, use the "results" property.
           */
          errors, 
          /**
           * The controller's current array of validate results. This
           * includes both passed rules and failed rules. For an array of only failed rules,
           * use the "errors" property.
           */
          results, 
          /**
           * The instruction passed to the "validate" or "reset" event. Will be null when
           * the controller's validate/reset method was called with no instruction argument.
           */
          instruction, 
          /**
           * In events with type === "validate", this property will contain the result
           * of validating the instruction (see "instruction" property). Use the controllerValidateResult
           * to access the validate results specific to the call to "validate"
           * (as opposed to using the "results" and "errors" properties to access the controller's entire
           * set of results/errors).
           */
          controllerValidateResult) {
              this.type = type;
              this.errors = errors;
              this.results = results;
              this.instruction = instruction;
              this.controllerValidateResult = controllerValidateResult;
          }
          return ValidateEvent;
      }()));

      /**
       * Orchestrates validation.
       * Manages a set of bindings, renderers and objects.
       * Exposes the current list of validation results for binding purposes.
       */
      var ValidationController = exports('ValidationController', /** @class */ (function () {
          function ValidationController(validator, propertyParser) {
              this.validator = validator;
              this.propertyParser = propertyParser;
              // Registered bindings (via the validate binding behavior)
              this.bindings = new Map();
              // Renderers that have been added to the controller instance.
              this.renderers = [];
              /**
               * Validation results that have been rendered by the controller.
               */
              this.results = [];
              /**
               * Validation errors that have been rendered by the controller.
               */
              this.errors = [];
              /**
               *  Whether the controller is currently validating.
               */
              this.validating = false;
              // Elements related to validation results that have been rendered.
              this.elements = new Map();
              // Objects that have been added to the controller instance (entity-style validation).
              this.objects = new Map();
              /**
               * The trigger that will invoke automatic validation of a property used in a binding.
               */
              this.validateTrigger = validateTrigger.blur;
              // Promise that resolves when validation has completed.
              this.finishValidating = Promise.resolve();
              this.eventCallbacks = [];
          }
          /**
           * Subscribe to controller validate and reset events. These events occur when the
           * controller's "validate"" and "reset" methods are called.
           * @param callback The callback to be invoked when the controller validates or resets.
           */
          ValidationController.prototype.subscribe = function (callback) {
              var _this = this;
              this.eventCallbacks.push(callback);
              return {
                  dispose: function () {
                      var index = _this.eventCallbacks.indexOf(callback);
                      if (index === -1) {
                          return;
                      }
                      _this.eventCallbacks.splice(index, 1);
                  }
              };
          };
          /**
           * Adds an object to the set of objects that should be validated when validate is called.
           * @param object The object.
           * @param rules Optional. The rules. If rules aren't supplied the Validator implementation will lookup the rules.
           */
          ValidationController.prototype.addObject = function (object, rules) {
              this.objects.set(object, rules);
          };
          /**
           * Removes an object from the set of objects that should be validated when validate is called.
           * @param object The object.
           */
          ValidationController.prototype.removeObject = function (object) {
              this.objects.delete(object);
              this.processResultDelta('reset', this.results.filter(function (result) { return result.object === object; }), []);
          };
          /**
           * Adds and renders an error.
           */
          ValidationController.prototype.addError = function (message, object, propertyName) {
              if (propertyName === void 0) { propertyName = null; }
              var resolvedPropertyName;
              if (propertyName === null) {
                  resolvedPropertyName = propertyName;
              }
              else {
                  resolvedPropertyName = this.propertyParser.parse(propertyName);
              }
              var result = new ValidateResult({ __manuallyAdded__: true }, object, resolvedPropertyName, false, message);
              this.processResultDelta('validate', [], [result]);
              return result;
          };
          /**
           * Removes and unrenders an error.
           */
          ValidationController.prototype.removeError = function (result) {
              if (this.results.indexOf(result) !== -1) {
                  this.processResultDelta('reset', [result], []);
              }
          };
          /**
           * Adds a renderer.
           * @param renderer The renderer.
           */
          ValidationController.prototype.addRenderer = function (renderer) {
              var _this = this;
              this.renderers.push(renderer);
              renderer.render({
                  kind: 'validate',
                  render: this.results.map(function (result) { return ({ result: result, elements: _this.elements.get(result) }); }),
                  unrender: []
              });
          };
          /**
           * Removes a renderer.
           * @param renderer The renderer.
           */
          ValidationController.prototype.removeRenderer = function (renderer) {
              var _this = this;
              this.renderers.splice(this.renderers.indexOf(renderer), 1);
              renderer.render({
                  kind: 'reset',
                  render: [],
                  unrender: this.results.map(function (result) { return ({ result: result, elements: _this.elements.get(result) }); })
              });
          };
          /**
           * Registers a binding with the controller.
           * @param binding The binding instance.
           * @param target The DOM element.
           * @param rules (optional) rules associated with the binding. Validator implementation specific.
           */
          ValidationController.prototype.registerBinding = function (binding, target, rules) {
              this.bindings.set(binding, { target: target, rules: rules, propertyInfo: null });
          };
          /**
           * Unregisters a binding with the controller.
           * @param binding The binding instance.
           */
          ValidationController.prototype.unregisterBinding = function (binding) {
              this.resetBinding(binding);
              this.bindings.delete(binding);
          };
          /**
           * Interprets the instruction and returns a predicate that will identify
           * relevant results in the list of rendered validation results.
           */
          ValidationController.prototype.getInstructionPredicate = function (instruction) {
              var _this = this;
              if (instruction) {
                  var object_1 = instruction.object, propertyName_1 = instruction.propertyName, rules_1 = instruction.rules;
                  var predicate_1;
                  if (instruction.propertyName) {
                      predicate_1 = function (x) { return x.object === object_1 && x.propertyName === propertyName_1; };
                  }
                  else {
                      predicate_1 = function (x) { return x.object === object_1; };
                  }
                  if (rules_1) {
                      return function (x) { return predicate_1(x) && _this.validator.ruleExists(rules_1, x.rule); };
                  }
                  return predicate_1;
              }
              else {
                  return function () { return true; };
              }
          };
          /**
           * Validates and renders results.
           * @param instruction Optional. Instructions on what to validate. If undefined, all
           * objects and bindings will be validated.
           */
          ValidationController.prototype.validate = function (instruction) {
              var _this = this;
              // Get a function that will process the validation instruction.
              var execute;
              if (instruction) {
                  // tslint:disable-next-line:prefer-const
                  var object_2 = instruction.object, propertyName_2 = instruction.propertyName, rules_2 = instruction.rules;
                  // if rules were not specified, check the object map.
                  rules_2 = rules_2 || this.objects.get(object_2);
                  // property specified?
                  if (instruction.propertyName === undefined) {
                      // validate the specified object.
                      execute = function () { return _this.validator.validateObject(object_2, rules_2); };
                  }
                  else {
                      // validate the specified property.
                      execute = function () { return _this.validator.validateProperty(object_2, propertyName_2, rules_2); };
                  }
              }
              else {
                  // validate all objects and bindings.
                  execute = function () {
                      var promises = [];
                      for (var _i = 0, _a = Array.from(_this.objects); _i < _a.length; _i++) {
                          var _b = _a[_i], object = _b[0], rules = _b[1];
                          promises.push(_this.validator.validateObject(object, rules));
                      }
                      for (var _c = 0, _d = Array.from(_this.bindings); _c < _d.length; _c++) {
                          var _e = _d[_c], binding = _e[0], rules = _e[1].rules;
                          var propertyInfo = getPropertyInfo(binding.sourceExpression, binding.source);
                          if (!propertyInfo || _this.objects.has(propertyInfo.object)) {
                              continue;
                          }
                          promises.push(_this.validator.validateProperty(propertyInfo.object, propertyInfo.propertyName, rules));
                      }
                      return Promise.all(promises).then(function (resultSets) { return resultSets.reduce(function (a, b) { return a.concat(b); }, []); });
                  };
              }
              // Wait for any existing validation to finish, execute the instruction, render the results.
              this.validating = true;
              var returnPromise = this.finishValidating
                  .then(execute)
                  .then(function (newResults) {
                  var predicate = _this.getInstructionPredicate(instruction);
                  var oldResults = _this.results.filter(predicate);
                  _this.processResultDelta('validate', oldResults, newResults);
                  if (returnPromise === _this.finishValidating) {
                      _this.validating = false;
                  }
                  var result = {
                      instruction: instruction,
                      valid: newResults.find(function (x) { return !x.valid; }) === undefined,
                      results: newResults
                  };
                  _this.invokeCallbacks(instruction, result);
                  return result;
              })
                  .catch(function (exception) {
                  // recover, to enable subsequent calls to validate()
                  _this.validating = false;
                  _this.finishValidating = Promise.resolve();
                  return Promise.reject(exception);
              });
              this.finishValidating = returnPromise;
              return returnPromise;
          };
          /**
           * Resets any rendered validation results (unrenders).
           * @param instruction Optional. Instructions on what to reset. If unspecified all rendered results
           * will be unrendered.
           */
          ValidationController.prototype.reset = function (instruction) {
              var predicate = this.getInstructionPredicate(instruction);
              var oldResults = this.results.filter(predicate);
              this.processResultDelta('reset', oldResults, []);
              this.invokeCallbacks(instruction, null);
          };
          /**
           * Gets the elements associated with an object and propertyName (if any).
           */
          ValidationController.prototype.getAssociatedElements = function (_a) {
              var object = _a.object, propertyName = _a.propertyName;
              var elements = [];
              for (var _i = 0, _b = Array.from(this.bindings); _i < _b.length; _i++) {
                  var _c = _b[_i], binding = _c[0], target = _c[1].target;
                  var propertyInfo = getPropertyInfo(binding.sourceExpression, binding.source);
                  if (propertyInfo && propertyInfo.object === object && propertyInfo.propertyName === propertyName) {
                      elements.push(target);
                  }
              }
              return elements;
          };
          ValidationController.prototype.processResultDelta = function (kind, oldResults, newResults) {
              // prepare the instruction.
              var instruction = {
                  kind: kind,
                  render: [],
                  unrender: []
              };
              // create a shallow copy of newResults so we can mutate it without causing side-effects.
              newResults = newResults.slice(0);
              var _loop_1 = function (oldResult) {
                  // get the elements associated with the old result.
                  var elements = this_1.elements.get(oldResult);
                  // remove the old result from the element map.
                  this_1.elements.delete(oldResult);
                  // create the unrender instruction.
                  instruction.unrender.push({ result: oldResult, elements: elements });
                  // determine if there's a corresponding new result for the old result we are unrendering.
                  var newResultIndex = newResults.findIndex(function (x) { return x.rule === oldResult.rule && x.object === oldResult.object && x.propertyName === oldResult.propertyName; });
                  if (newResultIndex === -1) {
                      // no corresponding new result... simple remove.
                      this_1.results.splice(this_1.results.indexOf(oldResult), 1);
                      if (!oldResult.valid) {
                          this_1.errors.splice(this_1.errors.indexOf(oldResult), 1);
                      }
                  }
                  else {
                      // there is a corresponding new result...
                      var newResult = newResults.splice(newResultIndex, 1)[0];
                      // get the elements that are associated with the new result.
                      var elements_1 = this_1.getAssociatedElements(newResult);
                      this_1.elements.set(newResult, elements_1);
                      // create a render instruction for the new result.
                      instruction.render.push({ result: newResult, elements: elements_1 });
                      // do an in-place replacement of the old result with the new result.
                      // this ensures any repeats bound to this.results will not thrash.
                      this_1.results.splice(this_1.results.indexOf(oldResult), 1, newResult);
                      if (!oldResult.valid && newResult.valid) {
                          this_1.errors.splice(this_1.errors.indexOf(oldResult), 1);
                      }
                      else if (!oldResult.valid && !newResult.valid) {
                          this_1.errors.splice(this_1.errors.indexOf(oldResult), 1, newResult);
                      }
                      else if (!newResult.valid) {
                          this_1.errors.push(newResult);
                      }
                  }
              };
              var this_1 = this;
              // create unrender instructions from the old results.
              for (var _i = 0, oldResults_1 = oldResults; _i < oldResults_1.length; _i++) {
                  var oldResult = oldResults_1[_i];
                  _loop_1(oldResult);
              }
              // create render instructions from the remaining new results.
              for (var _a = 0, newResults_1 = newResults; _a < newResults_1.length; _a++) {
                  var result = newResults_1[_a];
                  var elements = this.getAssociatedElements(result);
                  instruction.render.push({ result: result, elements: elements });
                  this.elements.set(result, elements);
                  this.results.push(result);
                  if (!result.valid) {
                      this.errors.push(result);
                  }
              }
              // render.
              for (var _b = 0, _c = this.renderers; _b < _c.length; _b++) {
                  var renderer = _c[_b];
                  renderer.render(instruction);
              }
          };
          /**
           * Validates the property associated with a binding.
           */
          ValidationController.prototype.validateBinding = function (binding) {
              if (!binding.isBound) {
                  return;
              }
              var propertyInfo = getPropertyInfo(binding.sourceExpression, binding.source);
              var rules;
              var registeredBinding = this.bindings.get(binding);
              if (registeredBinding) {
                  rules = registeredBinding.rules;
                  registeredBinding.propertyInfo = propertyInfo;
              }
              if (!propertyInfo) {
                  return;
              }
              var object = propertyInfo.object, propertyName = propertyInfo.propertyName;
              this.validate({ object: object, propertyName: propertyName, rules: rules });
          };
          /**
           * Resets the results for a property associated with a binding.
           */
          ValidationController.prototype.resetBinding = function (binding) {
              var registeredBinding = this.bindings.get(binding);
              var propertyInfo = getPropertyInfo(binding.sourceExpression, binding.source);
              if (!propertyInfo && registeredBinding) {
                  propertyInfo = registeredBinding.propertyInfo;
              }
              if (registeredBinding) {
                  registeredBinding.propertyInfo = null;
              }
              if (!propertyInfo) {
                  return;
              }
              var object = propertyInfo.object, propertyName = propertyInfo.propertyName;
              this.reset({ object: object, propertyName: propertyName });
          };
          /**
           * Changes the controller's validateTrigger.
           * @param newTrigger The new validateTrigger
           */
          ValidationController.prototype.changeTrigger = function (newTrigger) {
              this.validateTrigger = newTrigger;
              var bindings = Array.from(this.bindings.keys());
              for (var _i = 0, bindings_1 = bindings; _i < bindings_1.length; _i++) {
                  var binding = bindings_1[_i];
                  var source = binding.source;
                  binding.unbind();
                  binding.bind(source);
              }
          };
          /**
           * Revalidates the controller's current set of errors.
           */
          ValidationController.prototype.revalidateErrors = function () {
              for (var _i = 0, _a = this.errors; _i < _a.length; _i++) {
                  var _b = _a[_i], object = _b.object, propertyName = _b.propertyName, rule = _b.rule;
                  if (rule.__manuallyAdded__) {
                      continue;
                  }
                  var rules = [[rule]];
                  this.validate({ object: object, propertyName: propertyName, rules: rules });
              }
          };
          ValidationController.prototype.invokeCallbacks = function (instruction, result) {
              if (this.eventCallbacks.length === 0) {
                  return;
              }
              var event = new ValidateEvent(result ? 'validate' : 'reset', this.errors, this.results, instruction || null, result);
              for (var i = 0; i < this.eventCallbacks.length; i++) {
                  this.eventCallbacks[i](event);
              }
          };
          ValidationController.inject = [Validator, PropertyAccessorParser];
          return ValidationController;
      }()));

      /**
       * Binding behavior. Indicates the bound property should be validated.
       */
      var ValidateBindingBehaviorBase = /** @class */ (function () {
          function ValidateBindingBehaviorBase(taskQueue) {
              this.taskQueue = taskQueue;
          }
          ValidateBindingBehaviorBase.prototype.bind = function (binding, source, rulesOrController, rules) {
              var _this = this;
              // identify the target element.
              var target = getTargetDOMElement(binding, source);
              // locate the controller.
              var controller;
              if (rulesOrController instanceof ValidationController) {
                  controller = rulesOrController;
              }
              else {
                  controller = source.container.get(Optional.of(ValidationController));
                  rules = rulesOrController;
              }
              if (controller === null) {
                  throw new Error("A ValidationController has not been registered.");
              }
              controller.registerBinding(binding, target, rules);
              binding.validationController = controller;
              var trigger = this.getValidateTrigger(controller);
              // tslint:disable-next-line:no-bitwise
              if (trigger & validateTrigger.change) {
                  binding.vbbUpdateSource = binding.updateSource;
                  // tslint:disable-next-line:only-arrow-functions
                  // tslint:disable-next-line:space-before-function-paren
                  binding.updateSource = function (value) {
                      this.vbbUpdateSource(value);
                      this.validationController.validateBinding(this);
                  };
              }
              // tslint:disable-next-line:no-bitwise
              if (trigger & validateTrigger.blur) {
                  binding.validateBlurHandler = function () {
                      _this.taskQueue.queueMicroTask(function () { return controller.validateBinding(binding); });
                  };
                  binding.validateTarget = target;
                  target.addEventListener('blur', binding.validateBlurHandler);
              }
              if (trigger !== validateTrigger.manual) {
                  binding.standardUpdateTarget = binding.updateTarget;
                  // tslint:disable-next-line:only-arrow-functions
                  // tslint:disable-next-line:space-before-function-paren
                  binding.updateTarget = function (value) {
                      this.standardUpdateTarget(value);
                      this.validationController.resetBinding(this);
                  };
              }
          };
          ValidateBindingBehaviorBase.prototype.unbind = function (binding) {
              // reset the binding to it's original state.
              if (binding.vbbUpdateSource) {
                  binding.updateSource = binding.vbbUpdateSource;
                  binding.vbbUpdateSource = null;
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
          return ValidateBindingBehaviorBase;
      }());

      /**
       * Binding behavior. Indicates the bound property should be validated
       * when the validate trigger specified by the associated controller's
       * validateTrigger property occurs.
       */
      var ValidateBindingBehavior = exports('ValidateBindingBehavior', /** @class */ (function (_super) {
          __extends(ValidateBindingBehavior, _super);
          function ValidateBindingBehavior() {
              return _super !== null && _super.apply(this, arguments) || this;
          }
          ValidateBindingBehavior.prototype.getValidateTrigger = function (controller) {
              return controller.validateTrigger;
          };
          ValidateBindingBehavior.inject = [TaskQueue];
          ValidateBindingBehavior = __decorate([
              bindingBehavior('validate')
          ], ValidateBindingBehavior);
          return ValidateBindingBehavior;
      }(ValidateBindingBehaviorBase)));
      /**
       * Binding behavior. Indicates the bound property will be validated
       * manually, by calling controller.validate(). No automatic validation
       * triggered by data-entry or blur will occur.
       */
      var ValidateManuallyBindingBehavior = exports('ValidateManuallyBindingBehavior', /** @class */ (function (_super) {
          __extends(ValidateManuallyBindingBehavior, _super);
          function ValidateManuallyBindingBehavior() {
              return _super !== null && _super.apply(this, arguments) || this;
          }
          ValidateManuallyBindingBehavior.prototype.getValidateTrigger = function () {
              return validateTrigger.manual;
          };
          ValidateManuallyBindingBehavior.inject = [TaskQueue];
          ValidateManuallyBindingBehavior = __decorate([
              bindingBehavior('validateManually')
          ], ValidateManuallyBindingBehavior);
          return ValidateManuallyBindingBehavior;
      }(ValidateBindingBehaviorBase)));
      /**
       * Binding behavior. Indicates the bound property should be validated
       * when the associated element blurs.
       */
      var ValidateOnBlurBindingBehavior = exports('ValidateOnBlurBindingBehavior', /** @class */ (function (_super) {
          __extends(ValidateOnBlurBindingBehavior, _super);
          function ValidateOnBlurBindingBehavior() {
              return _super !== null && _super.apply(this, arguments) || this;
          }
          ValidateOnBlurBindingBehavior.prototype.getValidateTrigger = function () {
              return validateTrigger.blur;
          };
          ValidateOnBlurBindingBehavior.inject = [TaskQueue];
          ValidateOnBlurBindingBehavior = __decorate([
              bindingBehavior('validateOnBlur')
          ], ValidateOnBlurBindingBehavior);
          return ValidateOnBlurBindingBehavior;
      }(ValidateBindingBehaviorBase)));
      /**
       * Binding behavior. Indicates the bound property should be validated
       * when the associated element is changed by the user, causing a change
       * to the model.
       */
      var ValidateOnChangeBindingBehavior = exports('ValidateOnChangeBindingBehavior', /** @class */ (function (_super) {
          __extends(ValidateOnChangeBindingBehavior, _super);
          function ValidateOnChangeBindingBehavior() {
              return _super !== null && _super.apply(this, arguments) || this;
          }
          ValidateOnChangeBindingBehavior.prototype.getValidateTrigger = function () {
              return validateTrigger.change;
          };
          ValidateOnChangeBindingBehavior.inject = [TaskQueue];
          ValidateOnChangeBindingBehavior = __decorate([
              bindingBehavior('validateOnChange')
          ], ValidateOnChangeBindingBehavior);
          return ValidateOnChangeBindingBehavior;
      }(ValidateBindingBehaviorBase)));
      /**
       * Binding behavior. Indicates the bound property should be validated
       * when the associated element blurs or is changed by the user, causing
       * a change to the model.
       */
      var ValidateOnChangeOrBlurBindingBehavior = exports('ValidateOnChangeOrBlurBindingBehavior', /** @class */ (function (_super) {
          __extends(ValidateOnChangeOrBlurBindingBehavior, _super);
          function ValidateOnChangeOrBlurBindingBehavior() {
              return _super !== null && _super.apply(this, arguments) || this;
          }
          ValidateOnChangeOrBlurBindingBehavior.prototype.getValidateTrigger = function () {
              return validateTrigger.changeOrBlur;
          };
          ValidateOnChangeOrBlurBindingBehavior.inject = [TaskQueue];
          ValidateOnChangeOrBlurBindingBehavior = __decorate([
              bindingBehavior('validateOnChangeOrBlur')
          ], ValidateOnChangeOrBlurBindingBehavior);
          return ValidateOnChangeOrBlurBindingBehavior;
      }(ValidateBindingBehaviorBase)));

      /**
       * Creates ValidationController instances.
       */
      var ValidationControllerFactory = exports('ValidationControllerFactory', /** @class */ (function () {
          function ValidationControllerFactory(container) {
              this.container = container;
          }
          ValidationControllerFactory.get = function (container) {
              return new ValidationControllerFactory(container);
          };
          /**
           * Creates a new controller instance.
           */
          ValidationControllerFactory.prototype.create = function (validator) {
              if (!validator) {
                  validator = this.container.get(Validator);
              }
              var propertyParser = this.container.get(PropertyAccessorParser);
              return new ValidationController(validator, propertyParser);
          };
          /**
           * Creates a new controller and registers it in the current element's container so that it's
           * available to the validate binding behavior and renderers.
           */
          ValidationControllerFactory.prototype.createForCurrentScope = function (validator) {
              var controller = this.create(validator);
              this.container.registerInstance(ValidationController, controller);
              return controller;
          };
          return ValidationControllerFactory;
      }()));
      ValidationControllerFactory['protocol:aurelia:resolver'] = true;

      var ValidationErrorsCustomAttribute = exports('ValidationErrorsCustomAttribute', /** @class */ (function () {
          function ValidationErrorsCustomAttribute(boundaryElement, controllerAccessor) {
              this.boundaryElement = boundaryElement;
              this.controllerAccessor = controllerAccessor;
              this.controller = null;
              this.errors = [];
              this.errorsInternal = [];
          }
          ValidationErrorsCustomAttribute.inject = function () {
              return [DOM.Element, Lazy.of(ValidationController)];
          };
          ValidationErrorsCustomAttribute.prototype.sort = function () {
              this.errorsInternal.sort(function (a, b) {
                  if (a.targets[0] === b.targets[0]) {
                      return 0;
                  }
                  // tslint:disable-next-line:no-bitwise
                  return a.targets[0].compareDocumentPosition(b.targets[0]) & 2 ? 1 : -1;
              });
          };
          ValidationErrorsCustomAttribute.prototype.interestingElements = function (elements) {
              var _this = this;
              return elements.filter(function (e) { return _this.boundaryElement.contains(e); });
          };
          ValidationErrorsCustomAttribute.prototype.render = function (instruction) {
              var _loop_1 = function (result) {
                  var index = this_1.errorsInternal.findIndex(function (x) { return x.error === result; });
                  if (index !== -1) {
                      this_1.errorsInternal.splice(index, 1);
                  }
              };
              var this_1 = this;
              for (var _i = 0, _a = instruction.unrender; _i < _a.length; _i++) {
                  var result = _a[_i].result;
                  _loop_1(result);
              }
              for (var _b = 0, _c = instruction.render; _b < _c.length; _b++) {
                  var _d = _c[_b], result = _d.result, elements = _d.elements;
                  if (result.valid) {
                      continue;
                  }
                  var targets = this.interestingElements(elements);
                  if (targets.length) {
                      this.errorsInternal.push({ error: result, targets: targets });
                  }
              }
              this.sort();
              this.errors = this.errorsInternal;
          };
          ValidationErrorsCustomAttribute.prototype.bind = function () {
              if (!this.controller) {
                  this.controller = this.controllerAccessor();
              }
              // this will call render() with the side-effect of updating this.errors
              this.controller.addRenderer(this);
          };
          ValidationErrorsCustomAttribute.prototype.unbind = function () {
              if (this.controller) {
                  this.controller.removeRenderer(this);
              }
          };
          __decorate([
              bindable({ defaultBindingMode: bindingMode.oneWay })
          ], ValidationErrorsCustomAttribute.prototype, "controller", void 0);
          __decorate([
              bindable({ primaryProperty: true, defaultBindingMode: bindingMode.twoWay })
          ], ValidationErrorsCustomAttribute.prototype, "errors", void 0);
          ValidationErrorsCustomAttribute = __decorate([
              customAttribute('validation-errors')
          ], ValidationErrorsCustomAttribute);
          return ValidationErrorsCustomAttribute;
      }()));

      var ValidationRendererCustomAttribute = exports('ValidationRendererCustomAttribute', /** @class */ (function () {
          function ValidationRendererCustomAttribute() {
          }
          ValidationRendererCustomAttribute.prototype.created = function (view) {
              this.container = view.container;
          };
          ValidationRendererCustomAttribute.prototype.bind = function () {
              this.controller = this.container.get(ValidationController);
              this.renderer = this.container.get(this.value);
              this.controller.addRenderer(this.renderer);
          };
          ValidationRendererCustomAttribute.prototype.unbind = function () {
              this.controller.removeRenderer(this.renderer);
              this.controller = null;
              this.renderer = null;
          };
          ValidationRendererCustomAttribute = __decorate([
              customAttribute$1('validation-renderer')
          ], ValidationRendererCustomAttribute);
          return ValidationRendererCustomAttribute;
      }()));

      /**
       * Sets, unsets and retrieves rules on an object or constructor function.
       */
      var Rules = exports('Rules', /** @class */ (function () {
          function Rules() {
          }
          /**
           * Applies the rules to a target.
           */
          Rules.set = function (target, rules) {
              if (target instanceof Function) {
                  target = target.prototype;
              }
              Object.defineProperty(target, Rules.key, { enumerable: false, configurable: false, writable: true, value: rules });
          };
          /**
           * Removes rules from a target.
           */
          Rules.unset = function (target) {
              if (target instanceof Function) {
                  target = target.prototype;
              }
              target[Rules.key] = null;
          };
          /**
           * Retrieves the target's rules.
           */
          Rules.get = function (target) {
              return target[Rules.key] || null;
          };
          /**
           * The name of the property that stores the rules.
           */
          Rules.key = '__rules__';
          return Rules;
      }()));

      // tslint:disable:no-empty
      var ExpressionVisitor = /** @class */ (function () {
          function ExpressionVisitor() {
          }
          ExpressionVisitor.prototype.visitChain = function (chain) {
              this.visitArgs(chain.expressions);
          };
          ExpressionVisitor.prototype.visitBindingBehavior = function (behavior) {
              behavior.expression.accept(this);
              this.visitArgs(behavior.args);
          };
          ExpressionVisitor.prototype.visitValueConverter = function (converter) {
              converter.expression.accept(this);
              this.visitArgs(converter.args);
          };
          ExpressionVisitor.prototype.visitAssign = function (assign) {
              assign.target.accept(this);
              assign.value.accept(this);
          };
          ExpressionVisitor.prototype.visitConditional = function (conditional) {
              conditional.condition.accept(this);
              conditional.yes.accept(this);
              conditional.no.accept(this);
          };
          ExpressionVisitor.prototype.visitAccessThis = function (access) {
              access.ancestor = access.ancestor;
          };
          ExpressionVisitor.prototype.visitAccessScope = function (access) {
              access.name = access.name;
          };
          ExpressionVisitor.prototype.visitAccessMember = function (access) {
              access.object.accept(this);
          };
          ExpressionVisitor.prototype.visitAccessKeyed = function (access) {
              access.object.accept(this);
              access.key.accept(this);
          };
          ExpressionVisitor.prototype.visitCallScope = function (call) {
              this.visitArgs(call.args);
          };
          ExpressionVisitor.prototype.visitCallFunction = function (call) {
              call.func.accept(this);
              this.visitArgs(call.args);
          };
          ExpressionVisitor.prototype.visitCallMember = function (call) {
              call.object.accept(this);
              this.visitArgs(call.args);
          };
          ExpressionVisitor.prototype.visitPrefix = function (prefix) {
              prefix.expression.accept(this);
          };
          ExpressionVisitor.prototype.visitBinary = function (binary) {
              binary.left.accept(this);
              binary.right.accept(this);
          };
          ExpressionVisitor.prototype.visitLiteralPrimitive = function (literal) {
              literal.value = literal.value;
          };
          ExpressionVisitor.prototype.visitLiteralArray = function (literal) {
              this.visitArgs(literal.elements);
          };
          ExpressionVisitor.prototype.visitLiteralObject = function (literal) {
              this.visitArgs(literal.values);
          };
          ExpressionVisitor.prototype.visitLiteralString = function (literal) {
              literal.value = literal.value;
          };
          ExpressionVisitor.prototype.visitArgs = function (args) {
              for (var i = 0; i < args.length; i++) {
                  args[i].accept(this);
              }
          };
          return ExpressionVisitor;
      }());

      var ValidationMessageParser = exports('ValidationMessageParser', /** @class */ (function () {
          function ValidationMessageParser(bindinqLanguage) {
              this.bindinqLanguage = bindinqLanguage;
              this.emptyStringExpression = new LiteralString('');
              this.nullExpression = new LiteralPrimitive(null);
              this.undefinedExpression = new LiteralPrimitive(undefined);
              this.cache = {};
          }
          ValidationMessageParser.prototype.parse = function (message) {
              if (this.cache[message] !== undefined) {
                  return this.cache[message];
              }
              var parts = this.bindinqLanguage.parseInterpolation(null, message);
              if (parts === null) {
                  return new LiteralString(message);
              }
              var expression = new LiteralString(parts[0]);
              for (var i = 1; i < parts.length; i += 2) {
                  expression = new Binary('+', expression, new Binary('+', this.coalesce(parts[i]), new LiteralString(parts[i + 1])));
              }
              MessageExpressionValidator.validate(expression, message);
              this.cache[message] = expression;
              return expression;
          };
          ValidationMessageParser.prototype.coalesce = function (part) {
              // part === null || part === undefined ? '' : part
              return new Conditional(new Binary('||', new Binary('===', part, this.nullExpression), new Binary('===', part, this.undefinedExpression)), this.emptyStringExpression, new CallMember(part, 'toString', []));
          };
          ValidationMessageParser.inject = [BindingLanguage];
          return ValidationMessageParser;
      }()));
      var MessageExpressionValidator = exports('MessageExpressionValidator', /** @class */ (function (_super) {
          __extends(MessageExpressionValidator, _super);
          function MessageExpressionValidator(originalMessage) {
              var _this = _super.call(this) || this;
              _this.originalMessage = originalMessage;
              return _this;
          }
          MessageExpressionValidator.validate = function (expression, originalMessage) {
              var visitor = new MessageExpressionValidator(originalMessage);
              expression.accept(visitor);
          };
          MessageExpressionValidator.prototype.visitAccessScope = function (access) {
              if (access.ancestor !== 0) {
                  throw new Error('$parent is not permitted in validation message expressions.');
              }
              if (['displayName', 'propertyName', 'value', 'object', 'config', 'getDisplayName'].indexOf(access.name) !== -1) {
                  getLogger('aurelia-validation')
                      // tslint:disable-next-line:max-line-length
                      .warn("Did you mean to use \"$" + access.name + "\" instead of \"" + access.name + "\" in this validation message template: \"" + this.originalMessage + "\"?");
              }
          };
          return MessageExpressionValidator;
      }(ExpressionVisitor)));

      /**
       * Dictionary of validation messages. [messageKey]: messageExpression
       */
      var validationMessages = exports('validationMessages', {
          /**
           * The default validation message. Used with rules that have no standard message.
           */
          default: "${$displayName} is invalid.",
          required: "${$displayName} is required.",
          matches: "${$displayName} is not correctly formatted.",
          email: "${$displayName} is not a valid email.",
          minLength: "${$displayName} must be at least ${$config.length} character${$config.length === 1 ? '' : 's'}.",
          maxLength: "${$displayName} cannot be longer than ${$config.length} character${$config.length === 1 ? '' : 's'}.",
          minItems: "${$displayName} must contain at least ${$config.count} item${$config.count === 1 ? '' : 's'}.",
          maxItems: "${$displayName} cannot contain more than ${$config.count} item${$config.count === 1 ? '' : 's'}.",
          equals: "${$displayName} must be ${$config.expectedValue}.",
      });
      /**
       * Retrieves validation messages and property display names.
       */
      var ValidationMessageProvider = exports('ValidationMessageProvider', /** @class */ (function () {
          function ValidationMessageProvider(parser) {
              this.parser = parser;
          }
          /**
           * Returns a message binding expression that corresponds to the key.
           * @param key The message key.
           */
          ValidationMessageProvider.prototype.getMessage = function (key) {
              var message;
              if (key in validationMessages) {
                  message = validationMessages[key];
              }
              else {
                  message = validationMessages['default'];
              }
              return this.parser.parse(message);
          };
          /**
           * Formulates a property display name using the property name and the configured
           * displayName (if provided).
           * Override this with your own custom logic.
           * @param propertyName The property name.
           */
          ValidationMessageProvider.prototype.getDisplayName = function (propertyName, displayName) {
              if (displayName !== null && displayName !== undefined) {
                  return (displayName instanceof Function) ? displayName() : displayName;
              }
              // split on upper-case letters.
              var words = propertyName.toString().split(/(?=[A-Z])/).join(' ');
              // capitalize first letter.
              return words.charAt(0).toUpperCase() + words.slice(1);
          };
          ValidationMessageProvider.inject = [ValidationMessageParser];
          return ValidationMessageProvider;
      }()));

      /**
       * Validates.
       * Responsible for validating objects and properties.
       */
      var StandardValidator = exports('StandardValidator', /** @class */ (function (_super) {
          __extends(StandardValidator, _super);
          function StandardValidator(messageProvider, resources) {
              var _this = _super.call(this) || this;
              _this.messageProvider = messageProvider;
              _this.lookupFunctions = resources.lookupFunctions;
              _this.getDisplayName = messageProvider.getDisplayName.bind(messageProvider);
              return _this;
          }
          /**
           * Validates the specified property.
           * @param object The object to validate.
           * @param propertyName The name of the property to validate.
           * @param rules Optional. If unspecified, the rules will be looked up using the metadata
           * for the object created by ValidationRules....on(class/object)
           */
          StandardValidator.prototype.validateProperty = function (object, propertyName, rules) {
              return this.validate(object, propertyName, rules || null);
          };
          /**
           * Validates all rules for specified object and it's properties.
           * @param object The object to validate.
           * @param rules Optional. If unspecified, the rules will be looked up using the metadata
           * for the object created by ValidationRules....on(class/object)
           */
          StandardValidator.prototype.validateObject = function (object, rules) {
              return this.validate(object, null, rules || null);
          };
          /**
           * Determines whether a rule exists in a set of rules.
           * @param rules The rules to search.
           * @parem rule The rule to find.
           */
          StandardValidator.prototype.ruleExists = function (rules, rule) {
              var i = rules.length;
              while (i--) {
                  if (rules[i].indexOf(rule) !== -1) {
                      return true;
                  }
              }
              return false;
          };
          StandardValidator.prototype.getMessage = function (rule, object, value) {
              var expression = rule.message || this.messageProvider.getMessage(rule.messageKey);
              // tslint:disable-next-line:prefer-const
              var _a = rule.property, propertyName = _a.name, displayName = _a.displayName;
              if (propertyName !== null) {
                  displayName = this.messageProvider.getDisplayName(propertyName, displayName);
              }
              var overrideContext = {
                  $displayName: displayName,
                  $propertyName: propertyName,
                  $value: value,
                  $object: object,
                  $config: rule.config,
                  // returns the name of a given property, given just the property name (irrespective of the property's displayName)
                  // split on capital letters, first letter ensured to be capitalized
                  $getDisplayName: this.getDisplayName
              };
              return expression.evaluate({ bindingContext: object, overrideContext: overrideContext }, this.lookupFunctions);
          };
          StandardValidator.prototype.validateRuleSequence = function (object, propertyName, ruleSequence, sequence, results) {
              var _this = this;
              // are we validating all properties or a single property?
              var validateAllProperties = propertyName === null || propertyName === undefined;
              var rules = ruleSequence[sequence];
              var allValid = true;
              // validate each rule.
              var promises = [];
              var _loop_1 = function (i) {
                  var rule = rules[i];
                  // is the rule related to the property we're validating.
                  // tslint:disable-next-line:triple-equals | Use loose equality for property keys
                  if (!validateAllProperties && rule.property.name != propertyName) {
                      return "continue";
                  }
                  // is this a conditional rule? is the condition met?
                  if (rule.when && !rule.when(object)) {
                      return "continue";
                  }
                  // validate.
                  var value = rule.property.name === null ? object : object[rule.property.name];
                  var promiseOrBoolean = rule.condition(value, object);
                  if (!(promiseOrBoolean instanceof Promise)) {
                      promiseOrBoolean = Promise.resolve(promiseOrBoolean);
                  }
                  promises.push(promiseOrBoolean.then(function (valid) {
                      var message = valid ? null : _this.getMessage(rule, object, value);
                      results.push(new ValidateResult(rule, object, rule.property.name, valid, message));
                      allValid = allValid && valid;
                      return valid;
                  }));
              };
              for (var i = 0; i < rules.length; i++) {
                  _loop_1(i);
              }
              return Promise.all(promises)
                  .then(function () {
                  sequence++;
                  if (allValid && sequence < ruleSequence.length) {
                      return _this.validateRuleSequence(object, propertyName, ruleSequence, sequence, results);
                  }
                  return results;
              });
          };
          StandardValidator.prototype.validate = function (object, propertyName, rules) {
              // rules specified?
              if (!rules) {
                  // no. attempt to locate the rules.
                  rules = Rules.get(object);
              }
              // any rules?
              if (!rules || rules.length === 0) {
                  return Promise.resolve([]);
              }
              return this.validateRuleSequence(object, propertyName, rules, 0, []);
          };
          StandardValidator.inject = [ValidationMessageProvider, ViewResources];
          return StandardValidator;
      }(Validator)));

      /**
       * Part of the fluent rule API. Enables customizing property rules.
       */
      var FluentRuleCustomizer = exports('FluentRuleCustomizer', /** @class */ (function () {
          function FluentRuleCustomizer(property, condition, config, fluentEnsure, fluentRules, parsers) {
              if (config === void 0) { config = {}; }
              this.fluentEnsure = fluentEnsure;
              this.fluentRules = fluentRules;
              this.parsers = parsers;
              this.rule = {
                  property: property,
                  condition: condition,
                  config: config,
                  when: null,
                  messageKey: 'default',
                  message: null,
                  sequence: fluentRules.sequence
              };
              this.fluentEnsure._addRule(this.rule);
          }
          /**
           * Validate subsequent rules after previously declared rules have
           * been validated successfully. Use to postpone validation of costly
           * rules until less expensive rules pass validation.
           */
          FluentRuleCustomizer.prototype.then = function () {
              this.fluentRules.sequence++;
              return this;
          };
          /**
           * Specifies the key to use when looking up the rule's validation message.
           */
          FluentRuleCustomizer.prototype.withMessageKey = function (key) {
              this.rule.messageKey = key;
              this.rule.message = null;
              return this;
          };
          /**
           * Specifies rule's validation message.
           */
          FluentRuleCustomizer.prototype.withMessage = function (message) {
              this.rule.messageKey = 'custom';
              this.rule.message = this.parsers.message.parse(message);
              return this;
          };
          /**
           * Specifies a condition that must be met before attempting to validate the rule.
           * @param condition A function that accepts the object as a parameter and returns true
           * or false whether the rule should be evaluated.
           */
          FluentRuleCustomizer.prototype.when = function (condition) {
              this.rule.when = condition;
              return this;
          };
          /**
           * Tags the rule instance, enabling the rule to be found easily
           * using ValidationRules.taggedRules(rules, tag)
           */
          FluentRuleCustomizer.prototype.tag = function (tag) {
              this.rule.tag = tag;
              return this;
          };
          ///// FluentEnsure APIs /////
          /**
           * Target a property with validation rules.
           * @param property The property to target. Can be the property name or a property accessor function.
           */
          FluentRuleCustomizer.prototype.ensure = function (subject) {
              return this.fluentEnsure.ensure(subject);
          };
          /**
           * Targets an object with validation rules.
           */
          FluentRuleCustomizer.prototype.ensureObject = function () {
              return this.fluentEnsure.ensureObject();
          };
          Object.defineProperty(FluentRuleCustomizer.prototype, "rules", {
              /**
               * Rules that have been defined using the fluent API.
               */
              get: function () {
                  return this.fluentEnsure.rules;
              },
              enumerable: true,
              configurable: true
          });
          /**
           * Applies the rules to a class or object, making them discoverable by the StandardValidator.
           * @param target A class or object.
           */
          FluentRuleCustomizer.prototype.on = function (target) {
              return this.fluentEnsure.on(target);
          };
          ///////// FluentRules APIs /////////
          /**
           * Applies an ad-hoc rule function to the ensured property or object.
           * @param condition The function to validate the rule.
           * Will be called with two arguments, the property value and the object.
           * Should return a boolean or a Promise that resolves to a boolean.
           */
          FluentRuleCustomizer.prototype.satisfies = function (condition, config) {
              return this.fluentRules.satisfies(condition, config);
          };
          /**
           * Applies a rule by name.
           * @param name The name of the custom or standard rule.
           * @param args The rule's arguments.
           */
          FluentRuleCustomizer.prototype.satisfiesRule = function (name) {
              var args = [];
              for (var _i = 1; _i < arguments.length; _i++) {
                  args[_i - 1] = arguments[_i];
              }
              var _a;
              return (_a = this.fluentRules).satisfiesRule.apply(_a, [name].concat(args));
          };
          /**
           * Applies the "required" rule to the property.
           * The value cannot be null, undefined or whitespace.
           */
          FluentRuleCustomizer.prototype.required = function () {
              return this.fluentRules.required();
          };
          /**
           * Applies the "matches" rule to the property.
           * Value must match the specified regular expression.
           * null, undefined and empty-string values are considered valid.
           */
          FluentRuleCustomizer.prototype.matches = function (regex) {
              return this.fluentRules.matches(regex);
          };
          /**
           * Applies the "email" rule to the property.
           * null, undefined and empty-string values are considered valid.
           */
          FluentRuleCustomizer.prototype.email = function () {
              return this.fluentRules.email();
          };
          /**
           * Applies the "minLength" STRING validation rule to the property.
           * null, undefined and empty-string values are considered valid.
           */
          FluentRuleCustomizer.prototype.minLength = function (length) {
              return this.fluentRules.minLength(length);
          };
          /**
           * Applies the "maxLength" STRING validation rule to the property.
           * null, undefined and empty-string values are considered valid.
           */
          FluentRuleCustomizer.prototype.maxLength = function (length) {
              return this.fluentRules.maxLength(length);
          };
          /**
           * Applies the "minItems" ARRAY validation rule to the property.
           * null and undefined values are considered valid.
           */
          FluentRuleCustomizer.prototype.minItems = function (count) {
              return this.fluentRules.minItems(count);
          };
          /**
           * Applies the "maxItems" ARRAY validation rule to the property.
           * null and undefined values are considered valid.
           */
          FluentRuleCustomizer.prototype.maxItems = function (count) {
              return this.fluentRules.maxItems(count);
          };
          /**
           * Applies the "equals" validation rule to the property.
           * null, undefined and empty-string values are considered valid.
           */
          FluentRuleCustomizer.prototype.equals = function (expectedValue) {
              return this.fluentRules.equals(expectedValue);
          };
          return FluentRuleCustomizer;
      }()));
      /**
       * Part of the fluent rule API. Enables applying rules to properties and objects.
       */
      var FluentRules = exports('FluentRules', /** @class */ (function () {
          function FluentRules(fluentEnsure, parsers, property) {
              this.fluentEnsure = fluentEnsure;
              this.parsers = parsers;
              this.property = property;
              /**
               * Current rule sequence number. Used to postpone evaluation of rules until rules
               * with lower sequence number have successfully validated. The "then" fluent API method
               * manages this property, there's usually no need to set it directly.
               */
              this.sequence = 0;
          }
          /**
           * Sets the display name of the ensured property.
           */
          FluentRules.prototype.displayName = function (name) {
              this.property.displayName = name;
              return this;
          };
          /**
           * Applies an ad-hoc rule function to the ensured property or object.
           * @param condition The function to validate the rule.
           * Will be called with two arguments, the property value and the object.
           * Should return a boolean or a Promise that resolves to a boolean.
           */
          FluentRules.prototype.satisfies = function (condition, config) {
              return new FluentRuleCustomizer(this.property, condition, config, this.fluentEnsure, this, this.parsers);
          };
          /**
           * Applies a rule by name.
           * @param name The name of the custom or standard rule.
           * @param args The rule's arguments.
           */
          FluentRules.prototype.satisfiesRule = function (name) {
              var _this = this;
              var args = [];
              for (var _i = 1; _i < arguments.length; _i++) {
                  args[_i - 1] = arguments[_i];
              }
              var rule = FluentRules.customRules[name];
              if (!rule) {
                  // standard rule?
                  rule = this[name];
                  if (rule instanceof Function) {
                      return rule.call.apply(rule, [this].concat(args));
                  }
                  throw new Error("Rule with name \"" + name + "\" does not exist.");
              }
              var config = rule.argsToConfig ? rule.argsToConfig.apply(rule, args) : undefined;
              return this.satisfies(function (value, obj) {
                  var _a;
                  return (_a = rule.condition).call.apply(_a, [_this, value, obj].concat(args));
              }, config)
                  .withMessageKey(name);
          };
          /**
           * Applies the "required" rule to the property.
           * The value cannot be null, undefined or whitespace.
           */
          FluentRules.prototype.required = function () {
              return this.satisfies(function (value) {
                  return value !== null
                      && value !== undefined
                      && !(isString(value) && !/\S/.test(value));
              }).withMessageKey('required');
          };
          /**
           * Applies the "matches" rule to the property.
           * Value must match the specified regular expression.
           * null, undefined and empty-string values are considered valid.
           */
          FluentRules.prototype.matches = function (regex) {
              return this.satisfies(function (value) { return value === null || value === undefined || value.length === 0 || regex.test(value); })
                  .withMessageKey('matches');
          };
          /**
           * Applies the "email" rule to the property.
           * null, undefined and empty-string values are considered valid.
           */
          FluentRules.prototype.email = function () {
              // regex from https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
              /* tslint:disable:max-line-length */
              return this.matches(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
                  /* tslint:enable:max-line-length */
                  .withMessageKey('email');
          };
          /**
           * Applies the "minLength" STRING validation rule to the property.
           * null, undefined and empty-string values are considered valid.
           */
          FluentRules.prototype.minLength = function (length) {
              return this.satisfies(function (value) { return value === null || value === undefined || value.length === 0 || value.length >= length; }, { length: length })
                  .withMessageKey('minLength');
          };
          /**
           * Applies the "maxLength" STRING validation rule to the property.
           * null, undefined and empty-string values are considered valid.
           */
          FluentRules.prototype.maxLength = function (length) {
              return this.satisfies(function (value) { return value === null || value === undefined || value.length === 0 || value.length <= length; }, { length: length })
                  .withMessageKey('maxLength');
          };
          /**
           * Applies the "minItems" ARRAY validation rule to the property.
           * null and undefined values are considered valid.
           */
          FluentRules.prototype.minItems = function (count) {
              return this.satisfies(function (value) { return value === null || value === undefined || value.length >= count; }, { count: count })
                  .withMessageKey('minItems');
          };
          /**
           * Applies the "maxItems" ARRAY validation rule to the property.
           * null and undefined values are considered valid.
           */
          FluentRules.prototype.maxItems = function (count) {
              return this.satisfies(function (value) { return value === null || value === undefined || value.length <= count; }, { count: count })
                  .withMessageKey('maxItems');
          };
          /**
           * Applies the "equals" validation rule to the property.
           * null and undefined values are considered valid.
           */
          FluentRules.prototype.equals = function (expectedValue) {
              return this.satisfies(function (value) { return value === null || value === undefined || value === '' || value === expectedValue; }, { expectedValue: expectedValue })
                  .withMessageKey('equals');
          };
          FluentRules.customRules = {};
          return FluentRules;
      }()));
      /**
       * Part of the fluent rule API. Enables targeting properties and objects with rules.
       */
      var FluentEnsure = exports('FluentEnsure', /** @class */ (function () {
          function FluentEnsure(parsers) {
              this.parsers = parsers;
              /**
               * Rules that have been defined using the fluent API.
               */
              this.rules = [];
          }
          /**
           * Target a property with validation rules.
           * @param property The property to target. Can be the property name or a property accessor
           * function.
           */
          FluentEnsure.prototype.ensure = function (property) {
              this.assertInitialized();
              var name = this.parsers.property.parse(property);
              var fluentRules = new FluentRules(this, this.parsers, { name: name, displayName: null });
              return this.mergeRules(fluentRules, name);
          };
          /**
           * Targets an object with validation rules.
           */
          FluentEnsure.prototype.ensureObject = function () {
              this.assertInitialized();
              var fluentRules = new FluentRules(this, this.parsers, { name: null, displayName: null });
              return this.mergeRules(fluentRules, null);
          };
          /**
           * Applies the rules to a class or object, making them discoverable by the StandardValidator.
           * @param target A class or object.
           */
          FluentEnsure.prototype.on = function (target) {
              Rules.set(target, this.rules);
              return this;
          };
          /**
           * Adds a rule definition to the sequenced ruleset.
           * @internal
           */
          FluentEnsure.prototype._addRule = function (rule) {
              while (this.rules.length < rule.sequence + 1) {
                  this.rules.push([]);
              }
              this.rules[rule.sequence].push(rule);
          };
          FluentEnsure.prototype.assertInitialized = function () {
              if (this.parsers) {
                  return;
              }
              throw new Error("Did you forget to add \".plugin('aurelia-validation')\" to your main.js?");
          };
          FluentEnsure.prototype.mergeRules = function (fluentRules, propertyName) {
              // tslint:disable-next-line:triple-equals | Use loose equality for property keys
              var existingRules = this.rules.find(function (r) { return r.length > 0 && r[0].property.name == propertyName; });
              if (existingRules) {
                  var rule = existingRules[existingRules.length - 1];
                  fluentRules.sequence = rule.sequence;
                  if (rule.property.displayName !== null) {
                      fluentRules = fluentRules.displayName(rule.property.displayName);
                  }
              }
              return fluentRules;
          };
          return FluentEnsure;
      }()));
      /**
       * Fluent rule definition API.
       */
      var ValidationRules = exports('ValidationRules', /** @class */ (function () {
          function ValidationRules() {
          }
          ValidationRules.initialize = function (messageParser, propertyParser) {
              this.parsers = {
                  message: messageParser,
                  property: propertyParser
              };
          };
          /**
           * Target a property with validation rules.
           * @param property The property to target. Can be the property name or a property accessor function.
           */
          ValidationRules.ensure = function (property) {
              return new FluentEnsure(ValidationRules.parsers).ensure(property);
          };
          /**
           * Targets an object with validation rules.
           */
          ValidationRules.ensureObject = function () {
              return new FluentEnsure(ValidationRules.parsers).ensureObject();
          };
          /**
           * Defines a custom rule.
           * @param name The name of the custom rule. Also serves as the message key.
           * @param condition The rule function.
           * @param message The message expression
           * @param argsToConfig A function that maps the rule's arguments to a "config"
           * object that can be used when evaluating the message expression.
           */
          ValidationRules.customRule = function (name, condition, message, argsToConfig) {
              validationMessages[name] = message;
              FluentRules.customRules[name] = { condition: condition, argsToConfig: argsToConfig };
          };
          /**
           * Returns rules with the matching tag.
           * @param rules The rules to search.
           * @param tag The tag to search for.
           */
          ValidationRules.taggedRules = function (rules, tag) {
              return rules.map(function (x) { return x.filter(function (r) { return r.tag === tag; }); });
          };
          /**
           * Returns rules that have no tag.
           * @param rules The rules to search.
           */
          ValidationRules.untaggedRules = function (rules) {
              return rules.map(function (x) { return x.filter(function (r) { return r.tag === undefined; }); });
          };
          /**
           * Removes the rules from a class or object.
           * @param target A class or object.
           */
          ValidationRules.off = function (target) {
              Rules.unset(target);
          };
          return ValidationRules;
      }()));

      // Exports
      /**
       * Aurelia Validation Configuration API
       */
      var AureliaValidationConfiguration = exports('AureliaValidationConfiguration', /** @class */ (function () {
          function AureliaValidationConfiguration() {
              this.validatorType = StandardValidator;
          }
          /**
           * Use a custom Validator implementation.
           */
          AureliaValidationConfiguration.prototype.customValidator = function (type) {
              this.validatorType = type;
          };
          /**
           * Applies the configuration.
           */
          AureliaValidationConfiguration.prototype.apply = function (container) {
              var validator = container.get(this.validatorType);
              container.registerInstance(Validator, validator);
          };
          return AureliaValidationConfiguration;
      }()));
      /**
       * Configures the plugin.
       */
      function configure(
      // tslint:disable-next-line:ban-types
      frameworkConfig, callback) {
          // the fluent rule definition API needs the parser to translate messages
          // to interpolation expressions.
          var messageParser = frameworkConfig.container.get(ValidationMessageParser);
          var propertyParser = frameworkConfig.container.get(PropertyAccessorParser);
          ValidationRules.initialize(messageParser, propertyParser);
          // configure...
          var config = new AureliaValidationConfiguration();
          if (callback instanceof Function) {
              callback(config);
          }
          config.apply(frameworkConfig.container);
          // globalize the behaviors.
          if (frameworkConfig.globalResources) {
              frameworkConfig.globalResources(ValidateBindingBehavior, ValidateManuallyBindingBehavior, ValidateOnBlurBindingBehavior, ValidateOnChangeBindingBehavior, ValidateOnChangeOrBlurBindingBehavior, ValidationErrorsCustomAttribute, ValidationRendererCustomAttribute);
          }
      }

    }
  };
});
