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
let ValidationErrorsCustomAttribute = class ValidationErrorsCustomAttribute {
    constructor(boundaryElement, controllerAccessor) {
        this.boundaryElement = boundaryElement;
        this.controllerAccessor = controllerAccessor;
        this.controller = null;
        this.errors = [];
        this.errorsInternal = [];
    }
    sort() {
        this.errorsInternal.sort((a, b) => {
            if (a.targets[0] === b.targets[0]) {
                return 0;
            }
            // tslint:disable-next-line:no-bitwise
            return a.targets[0].compareDocumentPosition(b.targets[0]) & 2 ? 1 : -1;
        });
    }
    interestingElements(elements) {
        return elements.filter(e => this.boundaryElement.contains(e));
    }
    render(instruction) {
        for (const { result } of instruction.unrender) {
            const index = this.errorsInternal.findIndex(x => x.error === result);
            if (index !== -1) {
                this.errorsInternal.splice(index, 1);
            }
        }
        for (const { result, elements } of instruction.render) {
            if (result.valid) {
                continue;
            }
            const targets = this.interestingElements(elements);
            if (targets.length) {
                this.errorsInternal.push({ error: result, targets });
            }
        }
        this.sort();
        this.errors = this.errorsInternal;
    }
    bind() {
        if (!this.controller) {
            this.controller = this.controllerAccessor();
        }
        // this will call render() with the side-effect of updating this.errors
        this.controller.addRenderer(this);
    }
    unbind() {
        if (this.controller) {
            this.controller.removeRenderer(this);
        }
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
export { ValidationErrorsCustomAttribute };
