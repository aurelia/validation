import {ValidationLocale} from '../src/validation/validation-locale';

export class Expectations {
  constructor(expect, done) {
    this.done = done;
    this.expect = expect;
    this.expectation = Promise.resolve(true);
  }

  assertTestResult(expectedResult, actualResult, fulfil, reject) {
    this.expect(actualResult).toBe(expectedResult);
    if (expectedResult === actualResult)
      fulfil();
    else
      reject();
  }

  expectAsync(somePromise) {
    return {
      toBe: (shouldSucceed) => {
        this.expectation = this.expectation
          .then( () => {
            if(typeof(somePromise) === 'function')
            {
              return somePromise();
            }
            else
              return somePromise;
          } )
          .then( (promiseResult) => {
            this.expect(promiseResult).toBe(shouldSucceed);
          }, (failResult) => {
            this.expect(failResult).toBe('assertion should not fail');
          });
      }
    };
  }


  assert(assertion, shouldSucceed) {
    this.expectation = this.expectation.then(
      () => {
        return new Promise((fulfil, reject) => {
          var thePromise = assertion;
          if(typeof(thePromise) === 'function')
          {
            thePromise = thePromise();
          }
          thePromise.then(
            () => {
              this.assertTestResult(shouldSucceed, true, fulfil, reject);
            },
            () => {
              this.assertTestResult(shouldSucceed, false, fulfil, reject);
            }
          );
        });
      }
    );
    return this;
  }

  validate() {
    this.expectation.then(
      () => {
        this.done();
      },
      () => {
        this.done();
      }
    );
  }
}
