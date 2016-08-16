import {ValidationParser} from './validation-parser';
import {ValidationRules} from './ruleset-builder';

export function configure({ container }: any) {
  const parser = container.get(ValidationParser);
  ValidationRules.initialize(parser);
}

ValidationRules
  .ensure('firstName').displayName('First Name').required().withMessage('${$displayName} is mandatory you ass')
  .ensure('lastName').displayName('Last Name').required().withMessageKey('mdreqln')
  .ensure('ssn').displayName('SSN').satisfies(value => /\d{3}-\d{2}-\d{4}/.test(value)).withMessage('${$displayName} is not a valid ssn')
  .ensure('phones[$all].areaCode').displayName('Area Code')
    .required()
    .matches(/\d{3}/)
  .ensure('phones[$all].number').displayName('Number')
    .required()
    .matches(/\d{3}-\d{4}/);

interface Person {
  id: number;
  firstName: string;
  lastName: string;

  phones: {
    type: 'cell'|'home'|'fax',
    areaCode: string;
    number: string;
  }[];

  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
  };

  mailingAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
  };
}


ValidationRules
  .ensure((p: Person) => p.firstName).required()
  .ensure(p => p.id)
    .required()
    .minLength(3)
    .maxLength(50)

  .ensure(p => p.phones[$all].type).displayName('Type')
    .required()
    .matches(/(cell)|(home)|(fax)/)
  .ensure(p => p.phones[$all].areaCode).displayName('Area Code')
    .required()
    .matches(/\d{3}/)
  .ensure(p => p.phones[$all].number).displayName('Number')
    .required()
    .matches(/\d{3}-\d{4}/)

  .ensure(p => p.address.line1).displayName('Line 1')
    .required()
  .ensure(p => p.address.city).displayName('City')
    .required()
  .ensure(p => p.address.state).displayName('State')
    .required()
  .ensure(p => p.address.zip).displayName('Zip')
    .required()
    .matches(/^something$/)

  .ensure(p => p.mailingAddress.line1).displayName('Line 1')
    .required()
  .ensure(p => p.address.city).displayName('City')
    .required()
  .ensure(p => p.address.state).displayName('State')
    .required()
  .ensure(p => p.address.zip).displayName('Zip')
    .required()
    .matches(/^something$/);

//////////////////////////////////////////////
interface Phone {
  type: 'cell'|'home'|'fax',
  areaCode: string;
  number: string;
}

interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
}

interface Person2 {
  firstName: string;
  lastName: string;
  phones: Phone[];
  address: Address;
  mailingAddress: Address;
}


let phoneRuleSet = ValidationRules
  .ensure((p: Phone) => p.type).displayName('Type')
    .required()
    .matches(/(cell)|(home)|(fax)/)
  .ensure(p => p.areaCode).displayName('Area Code')
    .required()
    .matches(/\d{3}/)
  .ensure(p => p.number).displayName('Number')
    .required()
    .matches(/\d{3}-\d{4}/)
  .rules;

let addressRuleSet = ValidationRules
  .ensure((a: Address) => a.line1).displayName('Line 1')
    .required()
  .ensure(a => a.city).displayName('City')
    .required()
  .ensure(a => a.state).displayName('State')
    .required()
  .ensure(a => a.zip).displayName('Zip')
    .required()
    .matches(/^something$/)
  .rules;


ValidationRules
  .ensure((p: Person2) => p.firstName).required()
  .ensure(p => p.lastName)
    .required()
    .minLength(3)
    .maxLength(50)
  .compose(p => p.phones[$all], phoneRuleSet)
  .compose(p => p.address, addressRuleSet)
  .compose(p => p.mailingAddress, addressRuleSet);

////////////////////////////////////////////////////////////////////////
/*
function isUsernameAvailable(username: string): Promise<boolean> {
  return Promise.resolve(username !== 'test');
}

function emailAvailable(email: string): Promise<boolean> {
  return Promise.resolve(email !== 'test@gmail.com');
}

interface NewAccount {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  emailMe: boolean;
}

ruleSet = ValidationRules
  .ensure<NewAccount>(a => a.username).displayName('User Name')
    .required()
    .satisfies(isUsernameAvailable).withMessage('${displayName}: "${value}" is not available.')
  .ensure(a => a.email).displayName('Email')
    .required().when(a => a.emailMe)
    .empty().when(a => !a.emailMe)
    .email()
    .satisfies(emailAvailable).withMessage('${displayName}: "${value}" is already registered.')
  .ensure(a => a.lastName).displayName('Last Name')
    .required()
  .compile();



interface RegistrationForm {
  firstName: string;
  lastName: string;

  password: string;
  verifyPassword: string;

  password2: string;
  verifyPassword2: string;
}

interface PizzaSpecial {
  type: 'family'|'kids'|'special';
  toppings: string[];
}

interface PizzaSpecial2 {
  type: 'family'|'kids'|'special';
  pepperoni: boolean;
  onions: boolean;
  anchovies: boolean;
  olives: boolean;
}

ValidationRules.ensure<PizzaSpecial>(p => p.toppings).maxItems(2);

let pizzaRuleSet = ValidationRules.ensure<PizzaSpecial>('$this')
  .satisfies(p => [p.pepperoni, p.anchovies, p.onions, p.olives].filter(x=> x).length <= , null, 'maxToppings');

let pizzaRuleSet2 = ValidationRules.ensure<PizzaSpecial>('$this')
  .toppingsRule();
*/
/*

<checkbox-multi-select value.bind="pizza.toppings & validate" options.bind="toppings"></check

Rules that are not specific to a single property.

* display characteristics
* guarantee we can retrieve result of specific validation rulelink



*/

// ValidationRules
//   .ensure<RegistrationForm>('$this').displayName('Registration')
//     .satisfies(model => model.password === model.verifyPassword, null, 'some weird rule')
//       .withMessage('Password and Verify Password must match.')
//   .ensure<RegistrationForm>('$this')
//     .satisfies(model => model.password2 === model.verifyPassword2, null, 'some weird rule2')
//       .withMessage('Password and Verify Password must match.')
//   .ensure<RegistrationForm>('$this').displayName('Registration')
//     .fieldsMatch('passwrod', 'verifyPassword')
//       .withMessage('Password and Verify Password must match.')
//   .ensure<RegistrationForm>('$this')
//     .fieldsMatch('passwrod', 'verifyPassword')

// var passwordRuleset = ValidationRules
//   .ensure<RegistrationForm>(m => m.password2)
//     .satisfies((value, model) => value === model.verifyPassword)

/*

<div validation-errors.bind="firstNameErrors"

1. ability to validate specific item in ruleset programmatically.

*/


