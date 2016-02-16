import {ValidationReporter} from 'src/validation-reporter';
import {ValidationReporterStub} from '../fixtures/validation-reporter-stub';
import {Container} from 'aurelia-dependency-injection';

describe('base rule', () => {
  let object = {};
  let container;
  let validationReporterStub = new ValidationReporterStub();

  beforeEach(() => {
    container = new Container();
    container.registerInstance(ValidationReporter, validationReporterStub);
  });

  describe('.publish', () => {
    beforeEach(() => {
      spyOn(validationReporterStub, 'publish');
    });

    it('todo', () => {
      // expect(validationReporterStub.publish).toHaveBeenCalled();
    });
  });
});