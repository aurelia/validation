import {inject} from 'aurelia-framework';
import {length, required, date, datetime, email, equality, url, numericality} from 'aurelia-validate';
import {ValidationReporter} from 'aurelia-validation';

export class App {
  static inject = [ValidationReporter];
  model;
  constructor(reporter) {
    this.model = new Model();
    this.reporter = reporter;
    reporter.add(this.model)
  }
}

class Model {
  @length({ minimum: 5, maximum: 25 }) firstName = 'Luke';
  @required lastName = 'Skywalker';
  @date lastUpdated = new Date();
  @datetime lastTimeUpdated = new Date();
  @email email = 'luke@skywalker.net';
  @length({ minimum: 5, maximum: 25 }) password = 'equal';
  @equality confirmPassword = 'equal';
  @url website = 'http://www.google.com';
  @numericality friendCount = 25;
  @numericality({ noStrings: true }) age = 25;
}
