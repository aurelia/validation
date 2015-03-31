import {ObserverLocator} from 'aurelia-binding';
import {Validation} from '../src/validation/validation';


class TestSubject {
  constructor(validation, firstName){
    this.firstName = firstName;
    this.validation = validation.on(this)
      .ensure('firstName')
      .notEmpty();
  }

  static createInstance(firstName) {
    return new TestSubject(new Validation(new ObserverLocator()), firstName);
  }
}

describe('Basic validation tests', () => {
  it('should fail if a notempty property is null', () => {
    var subject = TestSubject.createInstance(null);
    expect(subject.validation.result.isValid).toBe(false);
  });


  it('should fail if a notempty property is an empty string', () => {
    var subject = TestSubject.createInstance('');
    expect(subject.validation.result.isValid).toBe(false);
  });


  it('should fail if a notempty property contains only whitespace', () => {
    var subject = TestSubject.createInstance('            ');
    expect(subject.validation.result.isValid).toBe(false);
  });


  it('should not fail if a notempty property is a random string', () => {
    var subject = TestSubject.createInstance('a random string');
    expect(subject.validation.result.isValid).toBe(true);
  });


  it('should fail if an array is empty', () => {
    var subject = TestSubject.createInstance([]);
    expect(subject.validation.result.isValid).toBe(false);
  });


  it('should not fail on an array with elements', () => {
    var subject = TestSubject.createInstance(['some element']);
    expect(subject.validation.result.isValid).toBe(true);
  });


  it('should not fail on an array with empty element', () => {
    var subject = TestSubject.createInstance(['']);
    expect(subject.validation.result.isValid).toBe(true);
  });


  it('should not fail if value is a function', () => {
    var subject = TestSubject.createInstance(() => { return 'Demo'; });
    expect(subject.validation.result.isValid).toBe(true);
  });

  it('should evaluate immediately without marking the property as dirty', () => {
    var subject = { firstName : 'John' };

    subject.validation = new Validation(new ObserverLocator()).on(subject)
        .ensure('firstName').notEmpty().betweenLength(5,10);

    expect(subject.validation.result.isValid).toBe(false);
    expect(subject.validation.result.properties.firstName.isDirty).toBe(false);

    subject.validation.checkAll();
    expect(subject.validation.result.isValid).toBe(false);
    expect(subject.validation.result.properties.firstName.isDirty).toBe(true);
  });


  it('should update the validation automatically when the property changes', (done) => {
    var subject = { company : { name : 'Bob the builder construction, Inc.' } };

    subject.validation = new Validation(new ObserverLocator()).on(subject)
      .ensure('company.name')
      .notEmpty().betweenLength(5,10);

    expect(subject.validation.result.isValid).toBe(false);
    subject.company.name = 'Bob, Inc.';

    setTimeout(()=>{
      expect(subject.validation.result.isValid).toBe( true );
      done();
    }, 0);
  });

  it('should update the validation automatically when the property changes with nested properties', (done) => {
    var subject = TestSubject.createInstance(null);
    expect(subject.validation.result.isValid).toBe(false);
    subject.firstName = 'Bob the builder';

    setTimeout(()=>{
      expect(subject.validation.result.isValid).toBe( true );
      done();
    }, 0);
  });


  it('should update the validation checkAll is called', () =>{
    var subject = TestSubject.createInstance(null);
    expect(subject.validation.result.isValid).toBe(false);
    subject.firstName = 'Bob the builder';
    expect(subject.validation.checkAll()).toBe( true );
  });


  it('should update if an array gains elements', () => {
    var subject = TestSubject.createInstance([]);
    expect(subject.validation.result.isValid).toBe(false);
    subject.firstName.push('bob the builder');
    expect(subject.validation.checkAll()).toBe( true );
    subject.firstName.pop();
    expect(subject.validation.checkAll()).toBe( false );
  });


  it('should update if an array is overwritten', () => {
    var subject = TestSubject.createInstance(['a', 'b', 'c']);
    expect(subject.validation.result.isValid).toBe(true);

    subject.firstName = [];
    expect(subject.validation.checkAll()).toBe(false);
  });

  it('should use a custom message if one is provided', () => {
    var subject = TestSubject.createInstance("Bob");
    subject.validation.ensure('firstName').minLength(10).withMessage("Not valid!");

    expect(subject.validation.checkAll()).toBe(false);
    expect(subject.validation.result.properties.firstName.message).toBe("Not valid!");
  });
  it('should use a custom message function if one is provided', () => {
    var subject = TestSubject.createInstance("Bob");
    subject.validation.ensure('firstName').minLength(10).withMessage((newValue, threshold) => {return newValue + " is not valid!";});

    expect(subject.validation.checkAll()).toBe(false);
    expect(subject.validation.result.properties.firstName.message).toBe("Bob is not valid!");
  });
});
