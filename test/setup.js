import {ValidationLocale} from '../src/validation/validation-locale';
import {data} from '../src/resources/en-US';

ValidationLocale.Repository.default =
  ValidationLocale.Repository.addLocale('en-US', data);
