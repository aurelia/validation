import {ObserverLocator} from 'aurelia-binding';
import * as AllRules from '../validation/validationRules';
import * as AllCollections from '../validation/validationRulesCollection'
import {ValidationGroup} from '../validation/validationGroup';
import {ValidationLocaleRepository} from '../validation/validationLocaleRepository';

export class Validation {
    static inject() {
        return [ObserverLocator];
    }

    constructor(observerLocator) {
        this.observerLocator = observerLocator;
    }

    on(subject) {
        return new ValidationGroup(subject, this.observerLocator);
    }
}

Validation.Utilities = {
    isEmptyValue(val) {
        if (typeof val === 'function') {
            return this.isEmptyValue(val());
        }
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
Validation.Locale = new ValidationLocaleRepository();

