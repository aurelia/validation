import * as validate from 'validate.js';
export {length, required, date, datetime, email, equality, url, numericality} from './decorators';
export {ValidationEngine} from './validation-engine';

export function configure(config) {
  config.globalResources('./validate-custom-attribute');
}
