class ValidationMetadata
{
  constructor(){
    this.properties = [];
  }
  getOrCreateProperty(propertyName)
  {
    var property = this.properties.find(x => x.propertyName === propertyName);
    if(property === undefined)
    {
      property = new ValidationPropertyMetadata(propertyName);
      this.properties.push(property);
    }
    return property;
  }
  setup(validation)
  {
    this.properties.forEach( (property) => {
      property.setup(validation);
    });
  }
}
class ValidationPropertyMetadata{
  constructor(propertyName){
    this.propertyName = propertyName;
    this.setupSteps = [];
  }
  addSetupStep(setupStep){
    this.setupSteps.push(setupStep);
  }
  setup(validation){
    validation.ensure(this.propertyName);
    this.setupSteps.forEach((setupStep) => {
      setupStep(validation);
    });
  }
}


export function ensure(setupStep){
  return function(target, propertyName){
    if(target._validationMetadata === undefined){
      target._validationMetadata = new ValidationMetadata();
    }
    var property = target._validationMetadata.getOrCreateProperty(propertyName);
    property.addSetupStep(setupStep);
  }
}
