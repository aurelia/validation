import {base} from './rules/base';
import {LengthRule} from './rules/length';
import {RequiredRule} from './rules/required';
import {DateRule} from './rules/date';
import {DatetimeRule} from './rules/datetime';
import {EmailRule} from './rules/email';
import {EqualityRule} from './rules/equality';
import {UrlRule} from './rules/url';
import {NumericalityRule} from './rules/numericality';

export function length(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, LengthRule);
}

export function required(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, RequiredRule);
}

export function date(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, DateRule);
}

export function datetime(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, DatetimeRule);
}

export function email(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, EmailRule);
}

export function equality(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, EqualityRule);
}

export function url(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, UrlRule);
}

export function numericality(targetOrConfig, key, descriptor) {
  return base(targetOrConfig, key, descriptor, NumericalityRule);
}
