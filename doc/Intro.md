[![Join the chat at https://gitter.im/aurelia/disucss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/discuss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# Installation


#### Install via JSPM
Go into your project and verify it's already `npm install`'ed and `jspm install`'ed. Now execute following command to install the plugin via JSPM:

```
jspm install aurelia-validation
```

this will add the plugin into your `jspm_packages` folder as well as an mapping-line into your `config.js` as:

```
"aurelia-validation": "github:aurelia-validation@X.X.X",
```



#### Migrate from aurelia-app to aurelia-main 
You'll need to register the plugin when your aurelia app is bootstrapping. If you have an aurelia app because you cloned a sample, there's a good chance that the app is bootstrapping based on default conventions. In that case, open your **index.html** file and look at the *body* tag.
``` html
<body aurelia-app>
```
Change the *aurelia-app* attribute to *aurelia-app="main"*.
``` html
<body aurelia-main="main">
```
The aurelia framework will now bootstrap the application by looking for your **main.js** file and executing the exported *configure* method. Go ahead and add a new **main.js** file with these contents:
``` javascript
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging();

  aurelia.start().then(a => a.setRoot('app', document.body)); 
}

```

#### Load the plugin
During bootstrapping phase, you can now include the validation plugin:

``` javascript
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-validation'); //Add this line to load the plugin

  aurelia.start().then(a => a.setRoot('app', document.body)); 
}
```

# Getting started

Let's set up the **welcome.js** model from the [skeleton-navigation](http://github.com/aurelia/skeleton-navigation) with some validation. 
After importing the validation plugin in our model we'll do three things: 
- add a simple validation so that both firstName and lastname are required and have to have a length between 3 and 10 characters.
- prevent the 'welcome' function from executing if the model isn't valid
- add validation messages to the view to provide hints to the end-user

The original model looks like this:
``` javacript
export class Welcome{
  constructor(){
    this.heading = 'Welcome to the Aurelia Navigation App!';
    this.firstName = 'John';
    this.lastName = 'Doe';
  }

  get fullName(){
    return `${this.firstName} ${this.lastName}`;
  }

  welcome(){
    alert(`Welcome, ${this.fullName}!`);
  }
}
```
We start with importing the validation class
``` javacript
import {Validation} from 'aurelia-validation';
export class Welcome{
  static inject() { return [Validation]; }
  constructor(validation){
    this.heading = 'Welcome to the Aurelia Navigation App!';
    this.firstName = 'John';
    this.lastName = 'Doe';
  }

  get fullName(){
    return `${this.firstName} ${this.lastName}`;
  }

  welcome(){
    alert(`Welcome, ${this.fullName}!`);
  }
}
```
 

Great, we're all set, now let's add our first validation:
``` javascript
  constructor(validation){
    this.heading = 'Welcome to the Aurelia Navigation App!';
    this.firstName = 'John';
    this.lastName = 'Doe'; 
    
    this.validation = validation.on(this)
        .ensure('firstName') 
              .notEmpty() 
              .minLength(3)
              .maxLength(10) 
        .ensure('lastName') 
              .notEmpty() 
              .minLength(3)
              .maxLength(10) ;
  }
```
We now have a working validation, but nothing changes behaviorally. If the validation fails, there's no way to inform the end-user of his/her mistakes.
First, let's make sure that the 'welcome' function can only be executed if the validation is valid:
``` javascript
  welcome(){
    if(this.validation.checkAll()) //add this
      alert(`Welcome, ${this.fullName}! `);
  }
```
Secondly, let's provide some visual hints to the users. Open your **welcome.html** file and add the validate attached behavior:
``` html 
    <form role="form" submit.delegate="welcome()" validate.bind="validation" > 
```

*Gulp watch* to see the validation in action!


# Validation types

####notEmpty()
This is a special case, dictating that the field is 'required' and cannot be empty.
Empty means null, undefined, '', or if it has a length property (arrays and strings) that the length is 0.
>Note: strings are always trimmed before they evaluated.
>The notEmpty rule is always checked first before any other validation rule.  This means that without the notEmpty rule, the .minLength(5) rule would still consider a value of '' as valid because the field is allowed to be empty.

####between(minimumValue, maximumValue)
Validates that the value entered is greater than or equal to the provided *minimumValue* and strictly smaller than the provided *maximumValue*.

####betweenLength(minimumLength, maximumLength)
Validates that the length of the value entered is greater than or equal to the provided *minimumLength* and strictly less than the provided *maximumLength*.

####email()
Validates that the value entered is a properly formed email address.

####equals(otherValue, otherValueLabel)
Validates that the value entered equals the *otherValue*.
Optionally takes an *otherValueLabel*, which will be used in the error message.

####in(collection)
Validates that at least one of the values in the *collection* is equal to the value entered.

####isAlphanumeric()
Validates that the value entered contains only lowercase characters, uppercase characters, or digits.

####isAlphanumericOrWhitespace()
Validates that the value entered contains only lowercase characters, uppercase characters, digits or whitespace.

####isDigit()
Validates that the value entered contains only digits.

####isStrongPassword(minimumComplexityLevel)
Validates that the value entered is a strong password. A strong password contains each of the following groups: lowercase characters, uppercase characters, digits and special characters.
Optionally takes a *minumumComplexityLevel* of 2, 3 or 4 (default) to allow weak, medium or strong passwords only.
This matches the number of groups (lowercase/uppercase/digits/special characters) that need to be present.
>Note: optimal user experience when preceded with .betweenLength(8,16)

####isNumeric()
Validates that the value entered is numeric.
This supports properly formatted numbers, like '-1,000.00'. (This depends on the current locale, see **I18N**)

####minLength(minimumLength)
Validates that the length of the value entered is greater than or equal to the provided *minimumLength*.

####minimum(minimumValue)
Validates that the value entered is greater than or equal to the provided *minimumValue*.

####matches(regex)
Validates that the value entered is valid according to the provided *regex* (RegExp).

####matchesRegex(regexString)
Validates that the value entered is valid according to the provided *regexString* (string).

####maxLength(maximumLength)
Validates that the length of the value entered is strictly less than the provided *maximumLength*.

####maximum(maximumValue)
Validates that the value entered is strictly smaller than the provided *maximumValue*.

####notEquals(otherValue, otherValueLabel)
Validates that the value entered does not equal the *otherValue*. 
Optionally takes an *otherValueLabel*, which will be used in the error message.

####passes(customFunction, threshold)
Validates that the value entered is valid according to the provided *customFunction*.
Your *customFunction* is a function that takes two arguments: *newValue* (the value currently being evaluated) and optionally: *threshold*, and returns true/false.
>Note: there is a default message for *passes*, but this one is usually followed by a call to *withMessage*

####passesRule(validationRule)
Validates that the message passes the provided *validationRule* (ValidationRule). See **custom validation**.

####withMessage(message)
Adds a custom message for the previously appended validation rule. *message* is either a static string or a function that takes two arguments: *newValue* (the value that has been evaluated) and **threshold**.


#Logical operators
##if(conditionalExpression)
###Basic usage
Pass a function (*conditionalExpression*) that returns true of false.
Any conditions that come after the *if(conditionalExpression)* operator will only be evaluated if the *conditionalExpression* evaluates to true.
```javascript
        this.validation = validation.on(this)
            .ensure('state')
                .if(() => { return subject.country === 'US'; })
                    .in(['TX', 'FL'])
                .endIf()
                .notEmpty();
```

###else()
Optionally, chain any *if(conditionalExpression)* with an *else()*. Any conditions that come after the *else()* will only be evaluated if the *conditionalExpression* evaluates to false.
```javascript
        this.validation = validation.on(this)
            .ensure('state')
                .if(() => { return subject.country === 'US'; })
                    .in(['TX', 'FL'])
                .else()
                    .notEmpty()
                .endIf();
```

###*endIf()* and nested cases
The *if(conditionalExpression)* is automatically terminated when you move to the next property (*ensure(propertyName)*). However we suggest you always close your conditional statements with an *endIf* for readability. Especially when nesting statements...
```javascript
        this.validation = validation.on(this)
            .ensure('state')
                .if(() => { return subject.country === 'US'; })
                    .in(['TX', 'FL'])
                    .if( () => { return subject.state === 'FL'})
                        .passes( () => {return subject.age >= 65;})
                    .endIf() //without endif, the 'else' would apply if state !== 'FL'
                .else()
                    .passes( () => { return subject.age >= 18;})
                .endIf()
                .notEmpty();  //Without the endif, the 'notEmpty' would only apply to the above else case
```

##switch(conditionalExpression)
###Basic usage
Pass a function (*conditionalExpression*) that returns any label (string, number, ...).
Only the validation statements chained to the *case(label)* that equals the returned label, will be evaluated.
```javascript
        this.validation = validation.on(this)
            .ensure('state')
            .notEmpty()
            .switch(() => {return subject.country;})
                .case('US')
                    .in(['TX','FL'])
                .case('Belgium')
                    .in(['WVL', 'OVL'])
            .endSwitch();
```

###default
If for a given switch statement, no label is matched, the switch will be evaluated as valid.
To add a default case, use the *default()* method.
```javascript
        this.validation = validation.on(this)
            .ensure('state')
            .notEmpty()
            .switch(() => {return subject.country;})
                .case('US')
                    .in(['TX','FL'])
                .case('Belgium')
                    .in(['WVL', 'OVL'])
                .default()
                    .minLength(3)
            .endSwitch();
```

###Omitting the *conditionalExpression*
If *switch()* is being called without a *conditionExpression*, it will use the currently evaluated value of the underlying property as a label.
```javascript
        this.validation = validation.on(this)
            .ensure('customerLevel')
            .notEmpty()
            .switch()
                .case('Gold')
                    .passes( () => { return this.income > 100000;} ).withMessage('Customer needs a higher income to be a Gold member')
                .case('Silver')
                    .passes( () => { return this.income > 60000;} ).withMessage('Customer needs a higher income to be a silver member')
                .default()
                    .passes( () => { return this.income > 20000;} ).withMessage('Customer needs a higher income to be a member')
            .endSwitch();
```

###*endSwitch()* and nested cases
The *if(conditionalExpression)* is automatically terminated when you move to the next property (*ensure(propertyName)*). However we suggest you always close your conditional statements with an *endSwitch* for readability.
Especially when nesting statements...


#I18N

####Changing locale
Changing the locale is done on a 'global' level by calling *Validation.Locale.load(localeIdentifier)*

``` javascript
import {Validation} from 'aurelia-validation';
//Then, when you need to change the locale
Validation.Locale.load('nl-BE')
    .then(()=>{
        var currentLocale = Validation.Locale.currentLocaleIdentifier; //'nl-BE'
    });
```
The *load* method takes a *localeIdentifier* (see 'Supported locales') and returns a promise that completes when the locale is fully loaded.
>Note: error messages already resolved are not currently updated when the locale changes


####Supported locales
- en-US (default)
- fr-FR
- nl-BE
- nl-NL
- de-DE
- sv-SE
- tr-TR

> We could use a little help here...

# Custom validation

#### The ValidationRule class
If you need a complex validation rule, you can extract that into a seperate class that inherits from **ValidationRule** and pass it to the *passes(validationRule)* function.
For example:
``` javascript
import {ValidationRule} from './plugins/validation/'; 
export class MinimumLengthValidationRule extends ValidationRule{
	constructor (minimumLength) {
		super(
			minimumLength,
			(newValue, minimumLength) => {
				 return newValue.length !== undefined && newValue.length >= minimumLength;
			}
			(newValue, threshold) => {
				return `needs to be at least ${threshold} characters long`;
			},
		);
	}
}
```
The ValidationRule base class needs three constructor arguments:
- **threshold**: any javascript object that will be used as the 'threshold'.
- **onValidate**: a javascript function that takes two arguments (**newValue**: the current value that needs to be evaluated, and **threshold**: the javascript object that you passed earlier).
- **message**: a static string or a javascript function that takes two arguments (**newValue**: the current value that was evaluated, and **threshold**: the javascript object that you passed earlier) and returns a string that's used as the message when the property is not valid


>Note: It suggested to name your variables **newValue** and **threshold**, so that custom (*withMessage*) or localized messages will properly work.

####Custom validation functions
In addition to calling *passes(myCustomValidationRule)*, you can add custom validation functions to the **ValidationGroup** object's prototype.

``` javascript
import {Router} from 'aurelia-router';
import {ValidationGroup} from './plugins/validation/'; 

export class App {
  static inject() { return [Router]; }
  constructor(router) {
    this.router = router;
    this.router.configure(config => {
      config.title = 'Aurelia';
      config.map([
        { route: ['','welcome'],  moduleId: 'welcome',      nav: true, title:'Welcome' },
        { route: 'flickr',        moduleId: 'flickr',       nav: true },
        { route: 'child-router',  moduleId: 'child-router', nav: true, title:'Child Router' }
      ]);
    });

    ValidationGroup.prototype.SSN = function()
    {
      this.matches(/^[0-9]{3}\-?[0-9]{2}\-?[0-9]{4}$/)
          .withMessage((newValue, threshold) => {return `not a valid SSN`;});
      return this;
    }

  }
}

```
>Note: Your function can add custom validation rules by calling *this.passes(customValidationFunction)*, *this.passesRule(customValidationRule)* or any other validation function. Provide a specific error message by calling *withMessage(validationMessage)*. Your function should always end with **return this;** to enable the fluent API.

Then, when you're setting up validation, you can use your new method:
``` javascript
    this.validation = validation.on(this)
        .ensure('firstName') 
              .notEmpty() 
              .minLength(3)
              .maxLength(10) 
        .ensure('lastName') 
              .notEmpty() 
              .minLength(3)
              .maxLength(10)
        .ensure('ssn')
              .notEmpty()
              .SSN();
```
#Customizing the visualization
##Basic usage
To show validation messages, add the validateAttachedBehavior to any DOM element (the form element is most common) and bind it to your validation instance.
``` html 
    <form role="form" submit.delegate="welcome()" validate.bind="validation" > 
```

The validateAttachedBehavior will loop through all nested child elements and try to determine which controls are data-bound to which properties, and if there are validation rules for those properties, it will show visual clues.

##Visual clues and customization
The validateAttachedBehavior uses TW Bootstrap by default to provide visual clues about valid/invalid properties.
- for each input element, it will tyr to find the parent form-group element and add the appropriate TW BS has-error or has-success classes
- for each input element, it will try to find the labels for that element and append a message with the TW BS help-block class. The content of this element is kept in sync with the validation message (or left empty for valid properties)
- this added message element will have a aurelia-valiation-message class. This allows you to apply specific styling. For example, to make sure that validation messages are shown next to the corresponding label and the label is colored without adding a TW bootstrap "control-label" class, you can add these style to styles/styles.css:
```css
	.aurelia-validation-message{
	  display:  inline;
	  margin-left : 5px;
	}
	.has-success label {
	  color: #3c763d;
	}
	.has-warning label {
	  color: #8a6d3b;
	}

```

On a global application level, you can prevent the validateAttachedBehavior from appending this message to the labels, or you can have it append this message to the input control themselves. To do this, inject the *validateAttachedBehaviorConfig* instance in your app and set the *appendMessageToLabel* or *appendMessageToInput* properties.

```javascript 
import {ValidateAttachedBehaviorConfig} from 'aurelia-validation';
export class App {
  static inject() { return [ValidateAttachedBehaviorConfig]; }
  constructor(validateAttachedBehaviorConfig) { 
    //Configuring the way validation shows messages:
    validateAttachedBehaviorConfig.appendMessageToLabel = false;
    validateAttachedBehaviorConfig.appendMessageToInput = true;
  }
}
```

##How are elements and validation rules matched
The validateAttachedBehavior, once bound to a validation instance, will loop over every child element and try to match elements against validation rules.
A simple example:
```javascript
this.validation = validation.on(this).ensure('firstName').notEmpty();
```
```html
<form role="form" class="form-horizontal" validate.bind="validation">
  <div class="form-group">
    <label class="col-sm-2 control-label">First Name</label> 
    <input type="text" placeholder="first name" class="form-control" value.bind="firstName"> 
  </div> 
</form>
```
In this case, the validateAttachedBehavior will recognize the *value.bind="firstName"* attribute and match it against the validation rule you set up with *ensure('firstName')*.

As your viewmodels become more complex or if you start using binding converters, the binding path you used to set up the validation rules might be different than the binding path you used in your view, so you'll need to give the validateAttachedBehavior some extra clues as to which elements should be matched against which validation rules.

Consider this more complex example:
```javascript
this.contact.validation = validation.on(this.contact).ensure('firstName').notEmpty();
```

```html
<form role="form" class="form-horizontal" validate.bind="contact.validation">
  <div class="form-group">
    <label class="col-sm-2 control-label">First Name</label> 
    <input type="text" placeholder="first name" class="form-control" value.bind="contact.firstName" validate="firstName"> 
  </div> 
</form>
```
Pay attention to the two validateAttachedBehavior attributes in this example's HTML:
- *validate.bind="contact.validation"* this validateAttachedBehavior will bind the validation to the form.
- *validate="firstName"* this validateAttachedBehavior will only tell the parent validateAttachedBehavior that this input element should be decorated with the validation result of the rules for *"firstName"*.  This is only needed because the validation rule was created with *ensure('firstName')*, whereas the binding for the same input element has a different binding path: *value.bind="contact.FirstName"*

There is an array property named *bindingPathAttributes* on the *validateAttachedBehaviorConfig* instance that you can inject in your app, which holds the attributes that the validateAttachedBehavior will try to use to match elements to validationRules.  

##Preventing form submission
You could disable your submit function by binding it to the *validation.result.isValid* property: 
```html
<button type=submit" disabled.bind="!validation.result.isValid" >
```
This has a bit of a weird side effect: a validation message is only shown if the user actually changes the value of a form element, ie. the underlying field is 'dirty'.  Again: there are no visual clues as to what form elements are invalid until the user actually changes the value of a field.
In contrast, calling the *validation.checkAll()* function will force all validation rules to be re-evaluated, as well as forcing every field to be considered 'dirty', then return a bool indicating if the entire validation has passed or failed.
In summary: if you do not disable the submit button, but instead call the *checkAll* function in your code

```javascript
if(this.validation.checkAll()){
  //perform action on form submission
}
```
You will have the following user experience:
- all fields in a form show no validation messages
- when the user changes the value, validation messages & visual clues will be shown for each field he/she has edited
- when the user hit submit, all input elements on the form will show validation messages & visual clues
- if all validation rules have passed, the form submission code will actually run. If not, the user will clearly see what properties are valid, which are invalid, and why
    

#ValidationResult
If you need more information about your model's validation status or if you want to bind your validation messages yourself, you can investigate the *validation.result* property.
The *validation.result* property is a *validationResult* object that describes if your model is currently valid, as well as giving detail about each property.
For example, suppose you have a validation set up like this:
```javascript
    this.validation = validation.on(this)
        .ensure('firstName').notEmpty().between(3,80)
        .ensure('lastName').notEmpty().between(3,80)
        .ensure('email').notEmpty().email();
```
For this validation, the *validation.result* object would (qua form) look like this:
```javascript
    {
        isValid : false,
        properties :
            firstName : {
                isValid : true,
                isDirty : true,
                message : null,
                failingRule : null
            },
            lastName : {
                isValid : false,
                isDirty : true,
                message : 'is required',
                failingRule : 'isRequired'
            },
            email : {
                isValid : false,
                isDirty : true,
                message : 'is not a valid email address',
                failingRule : 'EmailValidationRule'
            },
    }
```
Each property will be updated when the validation on that property is triggered (when the value changes, or when the *checkAll()* is called).
Each property contains four pieces of information:
- *isValid* : a boolean indicating if this property is valid
- *isDirty* : a boolean indicating if this property is dirty (ie: if the value has changed since the validation has been created).  This will also be set to true if the *checkAll()* is called. (*The isDirty property is used for UX purposes. A model can have invalid defaults, but we don't want to show the user error messages yet until the user actually changes the value, or the user clicks a submit button that triggers the checkAll().*)
- *message* : a localized error message. See **I18N**
- *failingRule* : a non localized error message identifier of the first rule that failed. Possible values are
  - 'isRequired'
  - 'AlphaNumericOrWhitespaceValidationRule'
  - 'AlphaNumericValidationRule'
  - 'BetweenLengthValidationRule'
  - 'BetweenValueValidationRule'
  - 'CustomFunctionValidationRule'
  - 'DigitValidationRule'
  - 'EmailValidationRule'
  - 'EqualityValidationRule'
  - 'InCollectionValidationRule'
  - 'MinimumLengthValidationRule'
  - 'MinimumValueValidationRule'
  - 'MaximumLengthValidationRule'
  - 'MaximumValueValidationRule'
  - 'NumericValidationRule'
  - 'RegexValidationRule'
  - 'StrongPasswordValidationRule'

In addition, each allows you to register a callback that is notified when the property has been re-evaluated and it caused a change in the *isValid*, *isDirty*, *message* or *failingRule*.
```javascript
    this.validation.result.firstName
        .onValidate(
            (firstNameValidationResult) => {
                if(firstNameValidationResult.failingRule === 'isRequired')
                {
                    alert('First name is required');
                }
            }
        );
```
