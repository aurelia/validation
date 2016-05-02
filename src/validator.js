export class Validator {
  validate(object, prop) {
    throw new Error('A Validator must implement validate(...)');
  }
  getProperties() {
    throw new Error('A Validator must implement getProperties(...)');
  }
}

