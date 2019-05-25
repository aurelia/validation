import { ValidationRules } from '../../src/aurelia-validation';

ValidationRules.customRule(
    'matchesProperty',
    (value, obj, otherPropertyName) =>
        value === null
        || value === undefined
        || value === ''
        || obj[otherPropertyName] === null
        || obj[otherPropertyName] === undefined
        || obj[otherPropertyName] === ''
        || value === obj[otherPropertyName],
    '${$displayName} must match ${$getDisplayName($config.otherPropertyName)}',
    otherPropertyName => ({ otherPropertyName })
);

export class RegistrationFormWithDecorators {
    public name: string = '';
    public email: string = '';
    public password: string = '';
    public confirmPassword: string = '';
    public age: number = 0;
    public adultName: string = '';
    
}
