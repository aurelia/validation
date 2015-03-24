import {Validation} from '../validation/validation';

export class ValidationRulesCollection {
    constructor(){
        this.isRequired = false;
        this.validationRules = [];
        this.validationCollections = [];
    }

    validate(newValue)
    {
        var response = {
            isValid : true,
            message : null,
            failingRule : null
        };
        if (Validation.Utilities.isEmptyValue(newValue)) {
            if(this.isRequired)
            {
                response.isValid = false;
                response.message = Validation.Locale.translate('isRequired');
                response.failingRule = 'isRequired';
            }
        }
        else {
            //validate rules
            for (let i = 0; i < this.validationRules.length; i++) {
                var rule = this.validationRules[i];
                if (!rule.validate(newValue)) {
                    response.isValid = false;
                    response.message = rule.explain();
                    response.failingRule = rule.ruleName;
                    break;
                }
            }
        }
        if(response.isValid)
        {
            for(let i = 0; i < this.validationCollections.length; i++)
            {
                let validationCollectionResponse = this.validationCollections[i].validate(newValue);
                if(!validationCollectionResponse.isValid)
                {
                    response.isValid = false;
                    response.message = validationCollectionResponse.message;
                    response.failingRule = validationCollectionResponse.failingRule;
                    break;
                }
            }
        }
        return response;
    }
    addValidationRule(validationRule) {
        if (validationRule.validate === undefined) //Can ES6 check on base class??
            throw new exception("That's not a valid validationRule");
        this.validationRules.push(validationRule);
    }
    addValidationRuleCollection(validationRulesCollection) {
        this.validationCollections.push(validationRulesCollection);
    }
    notEmpty(){
        this.isRequired = true;
    }
}

export class SwitchCaseValidationRulesCollection{

    constructor(conditionExpression){
        this.conditionExpression = conditionExpression;
        this.innerCollections = [];
        this.defaultCollection = new ValidationRulesCollection();
        this.caseLabel = '';
        this.defaultCaseLabel = { description : 'this is the case label for \'default\'' };
    }

    case(caseLabel)
    {
        this.caseLabel = caseLabel;
        this.getCurrentCollection(caseLabel, true); //force creation
    }

    default(){
        this.caseLabel = this.defaultCaseLabel;
    }

    getCurrentCollection(caseLabel,  createIfNotExists = false)
    {
        if(caseLabel === this.defaultCaseLabel)
            return this.defaultCollection;
        var currentCollection = null;
        for(let i = 0; i < this.innerCollections.length; i++)
        {
            currentCollection = this.innerCollections[i];
            if(currentCollection.caseLabel === caseLabel)
                return currentCollection.collection;
        }
        if(createIfNotExists)
        {
            currentCollection = {
                caseLabel : caseLabel,
                collection : new ValidationRulesCollection()
            };
            this.innerCollections.push(currentCollection);
            return currentCollection.collection;
        }
        return null;
    }

    validate(newValue) {
        var collection = this.getCurrentCollection(this.conditionExpression(newValue));
        if(collection !== null)
            return collection.validate(newValue);
        else
            return this.defaultCollection.validate(newValue);
    }
    addValidationRule(validationRule) {
        var currentCollection =  this.getCurrentCollection(this.caseLabel, true);
        currentCollection.addValidationRule(validationRule);
    }
    addValidationRuleCollection(validationRulesCollection) {
        var currentCollection =  this.getCurrentCollection(this.caseLabel, true);
        currentCollection.addValidationRuleCollection(validationRulesCollection);
    }

    notEmpty(){
        var collection = this.getCurrentCollection(this.caseLabel);
        if(collection !== null)
            collection.notEmpty();
        else
            this.defaultCollection.notEmpty();
    }
}