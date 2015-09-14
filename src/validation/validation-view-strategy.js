export class ValidationViewStrategy {
  constructor() {
    this.bindingPathAttributes = ['validate', 'value.bind', 'value.two-way'];
  }

  getValidationProperty(validation, element) {
    let atts = element.attributes;
    for (let i = 0; i < this.bindingPathAttributes.length; i++) {
      let attributeName = this.bindingPathAttributes[i];
      let bindingPath;
      let validationProperty;
      if (atts[attributeName]) {
        bindingPath = atts[attributeName].value.trim();
        if (bindingPath.indexOf('|') !== -1) {
          bindingPath = bindingPath.split('|')[0].trim();
        }

        validationProperty = validation.result.properties[bindingPath];
        if (attributeName === 'validate' && (validationProperty === null || validationProperty === undefined)) {
          //Dev explicitly stated to show validation on a field, but there's no rules for this field
          //Hence, we add an empty validationProperty for that field, without any rules
          //This way, when 'checkAll()' is called, the input element 'turns green'
          validation.ensure(bindingPath);
          validationProperty = validation.result.properties[bindingPath];
        }
        return validationProperty;
      }
    }

    return null;
  }

  prepareElement(validationProperty, element) {
    throw Error('View strategy must implement prepareElement(validationProperty, element)');
  }

  updateElement(validationProperty, element) {
    throw Error('View strategy must implement updateElement(validationProperty, element)');
  }
}
