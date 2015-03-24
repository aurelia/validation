import {ValidationLocaleDefaults} from '../resources/defaults';

export class ValidationLocaleRepository{
    constructor() {
        this.defaults = new ValidationLocaleDefaults();
        this.currentLocale = null;
        this.currentLocaleIdentifier = null;
    }

    reset(){
        this.currentLocaleIdentifier = null;
        this.currentLocale = null;
    }

    load(lang){
        var self = this;
        return new Promise( ( resolve, reject) => {
            if (self.currentLocaleIdentifier === lang && self.currentLocale !== null) {
                resolve(true);
                return;
            }
            self.currentLocaleIdentifier = lang;
            System.import('./src/resources/' + self.currentLocaleIdentifier).then(function (resource) {
                self.currentLocale = resource.data;
                resolve(true);
            });
        });
    }

    getValueFor(identifier, category)
    {
        if(this.currentLocale && this.currentLocale[category])
        {
            var currentLocaleSetting = this.currentLocale[category][identifier];
            if(currentLocaleSetting !== undefined && currentLocaleSetting !== null)
                return currentLocaleSetting;
        }
        if(this.defaults[category])
        {
            var defaultSetting = this.defaults[category][identifier];
            if(defaultSetting !== undefined && defaultSetting !== null)
                return defaultSetting;
        }
        throw 'Could not find validation : ' + identifier + ' in category: ' + category;
    }


    setting(settingIdentifier){
        return this.getValueFor(settingIdentifier, 'settings');
    }

    translate(translationIdentifier, newValue, threshold) {
        var translation = this.getValueFor(translationIdentifier, 'messages');
        if (typeof translation === 'function') {
            return translation(newValue, threshold);
        }
        if(typeof translation === 'string') {
            return translation;
        }
        throw 'Validation message for ' + translationIdentifier + 'was in an unsupported format';
    }
}
