import {inject} from 'aurelia-framework';
import {Validation} from 'aurelia-validation';

@inject(Validation)
export class App {
  firstName = 'Luke';
  lastName = 'Skywalker';
  hasValidated = false;
  validationMessages = [];
  constructor(validation) {
    this.validation = validation;
    this.validation = validation.on(this)
      .ensure('firstName')
        .isNotEmpty()
        .hasMinLength(3)
        .hasMaxLength(10)
      .ensure('lastName')
        .isNotEmpty()
        .hasMinLength(3)
        .hasMaxLength(10);
  }
  validate() {
    this.hasValidated = true;
    this.validationMessages = [];
    this.validation.validate()
      .catch(result => {
        for (let prop in result.properties) {
          let thisProp = result.properties[prop];
          if (!thisProp.isValid) {
            this.validationMessages.push(thisProp.message);
          }
        }
      });
  }
}
