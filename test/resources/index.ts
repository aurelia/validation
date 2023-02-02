import { FrameworkConfiguration } from 'aurelia-framework';
import { CustomInput } from './custom-input';
import { NullableObjectForm } from './nullable-object-form';
import { NumberValueCustomAttribute, NumberInputCustomElement } from './number-value';
import { RegistrationForm } from './registration-form';
import { TriggerForm } from './trigger-form';
import { ValidationErrorsFormOne } from './validation-errors-form-one';

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    NumberValueCustomAttribute,
    NumberInputCustomElement,
    RegistrationForm,
    TriggerForm,
    ValidationErrorsFormOne,
    NullableObjectForm,
    CustomInput,
  ]);
}
