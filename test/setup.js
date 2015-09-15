import {ValidationLocale} from '../src/validation-locale';
import {data} from '../src/resources/en-US';
import {ValidationConfigDefaults} from '../src/validation-config'

ValidationLocale.Repository.default =
  ValidationLocale.Repository.addLocale('en-US', data);
ValidationConfigDefaults._defaults.localeResources =  'src/resources/';
