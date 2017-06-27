var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { bindingMode } from 'aurelia-binding';
import { Lazy } from 'aurelia-dependency-injection';
import { customAttribute, bindable } from 'aurelia-templating';
import { ValidationController } from './validation-controller';
import { DOM } from 'aurelia-pal';
var ValidationErrorsCustomAttribute = (function () {
    function ValidationErrorsCustomAttribute(boundaryElement, controllerAccessor) {
        this.boundaryElement = boundaryElement;
        this.controllerAccessor = controllerAccessor;
        this.controller = null;
        this.errors = [];
        this.errorsInternal = [];
    }
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
    ValidationErrorsCustomAttribute.inject = [DOM.Element, Lazy.of(ValidationController)];
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
}());
export { ValidationErrorsCustomAttribute };
