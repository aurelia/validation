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
        this.assert(() => {
          return somePromise;
        }, shouldSucceed);
      }
    };
  }

  assert(assertion, shouldSucceed) {
    this.expectation = this.expectation.then(
      () => {
        return new Promise((fulfil, reject) => {
          assertion().then(
            () => {
              this.assertTestResult(shouldSucceed, true, fulfil, reject);
            },
            () => {
              this.assertTestResult(shouldSucceed, false, fulfil, reject);
            }
          );
        });
      },
      () => {
        return Promise.reject();
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
