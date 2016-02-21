export class ValidationReporter {
  add(object) {
    throw new Error('A ValidationReporter must implement add(...)');
  }
  remove(object) {
    throw new Error('A ValidationReporter must implement remove(...)');
  }
  subscribe(callback) {
    throw new Error('A ValidationReporter must implement subscribe(...)');
  }
  publish(errors) {
    throw new Error('A ValidationReporter must implement publish(...)');
  }
  destroyObserver(observer) {
    throw new Error('A ValidationReporter must implement destroyObserver(...)');
  }
}
