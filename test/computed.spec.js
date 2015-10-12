import {Validation} from '../src/validation';
import {ObserverLocator} from 'aurelia-binding';
import {TaskQueue} from 'aurelia-task-queue';

class TestSubject {
  constructor() {
    this.a = 3;
    this.b = 10;
    let validation = new Validation(new ObserverLocator(new TaskQueue(), { debounceTimeout: 0 }));
    this.validation = validation.on(this)
                                .ensure('b', (config) => { config.computedFrom('a') })
                                .isLessThan(() => this.a);
  }  
}

// Note: Not sure what the best approach to testing those really is.
//       There is no good way to know when the async work is done, as we don't have a Promise or final callback in those tests... 
//       Keep in mind you have to wait for the observer microqueue (could be flushed if we wanted to),
//       the Promises inside the validation engine (using the browser micro-queue),
//       and the computed dependencies debouncer (set to 0 above for convenience).
//       I used setTimeouts, but this is slow and fragile.
describe('Computed properties', () => { 
 
	it('should trigger validation every time the dependency changes', (done) => {    
    let subject = new TestSubject();       
    let bProperty = subject.validation.validationProperties[0];
            
    // Be careful here: new TestSubject() sets up the validation, which triggers the first validation,
    // which is an async process. So a first delay is requried to not count that first validation.
    setTimeout(() => {
      // Note: we can't spy on bProperty.validate, as this is where the "if" shortcuting validation is.
      spyOn(bProperty.collectionOfValidationRules, 'validate').and.callThrough();
      subject.a = 5;
    }, 50);
    
    setTimeout(() => {   
      subject.a = 15;
    }, 100);
    
    setTimeout(() => {
      expect(bProperty.collectionOfValidationRules.validate.calls.count()).toEqual(2);
      done();      
    }, 150);
  });
  
  it('should not mark the computed property dirty', (done) => { 
    let subject = new TestSubject();
    
    subject.a = 7;           
    
    setTimeout(() => {      
      expect(subject.validation.result.properties.b.isDirty).toBe(false);
      done();
    }, 50);
  });
});