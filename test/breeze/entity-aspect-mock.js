export class EntityAspectMock
{
  constructor(shouldFailPropertyValidation, shouldFailEntityValidation){
    this.shouldFailPropertyValidation = shouldFailPropertyValidation;
    this.shouldFailEntityValidation = shouldFailEntityValidation;
    this.validationErrorsChangedCallbacks = [];

    this._validationErrors = [];
    this.properties = [];
    this.validationErrorsChanged = this;
  }
  subscribe(callback) { this.validationErrorsChangedCallbacks.push(callback); }
  clearValidationErrors(){
    this._validationErrors = [];
  }

  getValidationErrors (optionalProperty){
    if(optionalProperty)
    {
      var errors = [];
      var error = this._validationErrors.find( (e) => { return e.propertyName === optionalProperty });
      if(error)
        errors.push(error);
      return errors;
    }
    return this._validationErrors;
  }
  validateEntity()
  {
    if(this.shouldFailEntityValidation)
    {
      this.properties.forEach( (prop) =>{
        this.addValidationError(prop, "Failing entity validation");
      });
    }
    this.validationErrorsChangedCallbacks.forEach( (callback) => { callback();});
    return this.shouldFailEntityValidation;
  }
  validateProperty(property){
    if(!this.properties.includes(property))
      this.properties.push(property);
    if(this.shouldFailPropertyValidation)
    {
      this.addValidationError(property, "Failing property validation");
    }
    this.validationErrorsChangedCallbacks.forEach((callback) => {
      callback();
    });
    return this.shouldFailPropertyValidation;
  }

  addValidationError(property, message)
  {
    this._validationErrors.push( { propertyName : property, errorMessage : message });
  }
}
