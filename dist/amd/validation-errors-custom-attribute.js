var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", 'aurelia-binding', 'aurelia-dependency-injection', 'aurelia-templating', './validation-controller'], function (require, exports, aurelia_binding_1, aurelia_dependency_injection_1, aurelia_templating_1, validation_controller_1) {
    "use strict";
    var ValidationErrorsCustomAttribute = (function () {
        function ValidationErrorsCustomAttribute(boundaryElement, controllerAccessor) {
            this.boundaryElement = boundaryElement;
            this.controllerAccessor = controllerAccessor;
            this.errors = [];
        }
        ValidationErrorsCustomAttribute.prototype.sort = function () {
            this.errors.sort(function (a, b) {
                if (a.targets[0] === b.targets[0]) {
                    return 0;
                }
                return a.targets[0].compareDocumentPosition(b.targets[0]) & 2 ? 1 : -1;
            });
        };
        ValidationErrorsCustomAttribute.prototype.interestingElements = function (elements) {
            var _this = this;
            return elements.filter(function (e) { return _this.boundaryElement.contains(e); });
        };
        ValidationErrorsCustomAttribute.prototype.render = function (instructions) {
            var _loop_1 = function(instruction) {
                if (instruction.type === 'add') {
                    var targets = this_1.interestingElements(instruction.newElements);
                    if (targets.length) {
                        this_1.errors.push({ error: instruction.newError, targets: targets });
                    }
                }
                else if (instruction.type === 'remove') {
                    var instr_1 = instruction; // TypeScript bug
                    var index = this_1.errors.findIndex(function (x) { return x.error === instr_1.oldError; });
                    if (index !== -1) {
                        this_1.errors.splice(index, 1);
                    }
                }
                else if (instruction.type === 'update') {
                    var instr_2 = instruction; // TypeScript bug
                    var index = this_1.errors.findIndex(function (x) { return x.error === instr_2.oldError; });
                    var targets = this_1.interestingElements(instruction.newElements);
                    if (index !== -1) {
                        this_1.errors.splice(index, 1);
                    }
                    if (targets.length) {
                        this_1.errors.push({ error: instruction.newError, targets: targets });
                    }
                }
            };
            var this_1 = this;
            for (var _i = 0, instructions_1 = instructions; _i < instructions_1.length; _i++) {
                var instruction = instructions_1[_i];
                _loop_1(instruction);
            }
            this.sort();
            this.value = this.errors;
        };
        ValidationErrorsCustomAttribute.prototype.bind = function () {
            this.controllerAccessor().addRenderer(this);
            this.value = this.errors;
        };
        ValidationErrorsCustomAttribute.prototype.unbind = function () {
            this.controllerAccessor().removeRenderer(this);
        };
        ValidationErrorsCustomAttribute.inject = [Element, aurelia_dependency_injection_1.Lazy.of(validation_controller_1.ValidationController)];
        ValidationErrorsCustomAttribute = __decorate([
            aurelia_templating_1.customAttribute('validation-errors', aurelia_binding_1.bindingMode.twoWay)
        ], ValidationErrorsCustomAttribute);
        return ValidationErrorsCustomAttribute;
    }());
    exports.ValidationErrorsCustomAttribute = ValidationErrorsCustomAttribute;
});
