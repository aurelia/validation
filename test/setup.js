import {ValidationLocale} from '../src/validation/validation-locale';
import {data} from '../src/resources/en-US';
import {ValidationConfigDefaults} from '../src/validation/validation-config'

ValidationLocale.Repository.default =
  ValidationLocale.Repository.addLocale('en-US', data);
ValidationConfigDefaults._defaults.localeResources =  'src/resources/';
