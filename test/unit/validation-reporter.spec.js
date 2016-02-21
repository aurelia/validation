import {ValidationReporter} from 'src/validation-reporter';

describe('ValidationReporter', () => {
  let reporter;

  beforeEach(() => {
    reporter = new ValidationReporter();
  });

  describe('.add', () => {
    it('throws an error if not overridden', () => {
      expect(() => { reporter.add(); }).toThrow(new Error('A ValidationReporter must implement add(...)'));
    });
  });
});
