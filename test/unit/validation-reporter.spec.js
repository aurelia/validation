import {ValidationReporter} from 'src/validation-reporter';

describe('ValidationReporter', () => {
  let validationReporter;

  beforeEach(() => {
    validationReporter = new ValidationReporter();
  });

  describe('.subscribe', () => {
    it('returns a validation observer', () => {
      let result = validationReporter.subscribe(errors => {});
      expect(typeof result.dispose).toEqual('function');
    });

    it('receives errors when called', () => {
      let observer = { callback: errors => {} };
      spyOn(observer, 'callback');
      let result = validationReporter.subscribe(observer.callback);
      validationReporter.publish([{name: 1}]);
      expect(observer.callback).toHaveBeenCalled();
    });
  });

  describe('.destroyObserver', () => {
    it('deletes matching observer', () => {
      let fakeCallback = function () {};
      let subscription = validationReporter.subscribe(fakeCallback);
      expect(validationReporter.__callbacks__[subscription.id]).not.toEqual(undefined);
      subscription.dispose();
      expect(validationReporter.__callbacks__[subscription.id]).toEqual(undefined);
    });
  });
});
