export class ValidationLocale{
  constructor(defaults, data)
  {
    this.defaults = defaults;
    this.currentLocale = data;
  }
  getValueFor(identifier, category) {
    if (this.currentLocale && this.currentLocale[category]) {
      var currentLocaleSetting = this.currentLocale[category][identifier];
      if (currentLocaleSetting !== undefined && currentLocaleSetting !== null)
        return currentLocaleSetting;
    }
    if (this.defaults[category]) {
      var defaultSetting = this.defaults[category][identifier];
      if (defaultSetting !== undefined && defaultSetting !== null)
        return defaultSetting;
    }
    throw 'validation: I18N: Could not find: ' + identifier + ' in category: ' + category;
  }


  setting(settingIdentifier) {
    return this.getValueFor(settingIdentifier, 'settings');
  }

  translate(translationIdentifier, newValue, threshold) {
    var translation = this.getValueFor(translationIdentifier, 'messages');
    if (typeof translation === 'function') {
      return translation(newValue, threshold);
    }
    if (typeof translation === 'string') {
      return translation;
    }
    throw 'Validation message for ' + translationIdentifier + 'was in an unsupported format';
  }
}

class ValidationLocaleRepository  {
  constructor(){
    this.default = null;
    this.instances = new Map();
    this.defaults = {
      settings: {
        'numericRegex': /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/
      },
      messages: {}
    };
  }
  load(localeIdentifier, basePath) {
    if(!basePath)
      basePath = 'aurelia-validation/resources/';
    return new Promise((resolve, reject) => {
      if(this.instances.has(localeIdentifier)) {
        resolve(this.instances.get(localeIdentifier));
      }
      else {
        System.import(basePath + localeIdentifier).then((resource) => {
          resolve(this.addLocale(localeIdentifier, resource.data));
        });
      }
    });
  }
  addLocale(localeIdentifier, data)
  {
    var instance = new ValidationLocale(this.defaults, data);
    this.instances.set(localeIdentifier, instance);
    if(this.default === null)
      this.default = instance;
    return instance;
  }
}
ValidationLocale.Repository = new ValidationLocaleRepository();
