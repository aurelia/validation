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

If you're feeling experimental or cannot wait for the next release, you could also install the latest version by executing:
```
jspm install aurelia-validation=github:aurelia/validation@master
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
- add a simple validation so that both firstName and lastname are required and have to have a length isBetweenOrEqualTo 3 and 10 characters.
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
              .isNotEmpty()
              .hasMinLength(3)
              .hasMaxLength(10)
        .ensure('lastName') 
              .isNotEmpty()
              .hasMinLength(3)
              .hasMaxLength(10) ;
  }
```
We now have a working validation, but nothing changes behaviorally. If the validation fails, there's no way to inform the end-user of his/her mistakes.
First, let's make sure that the 'welcome' function can only be executed if the validation is valid:
``` javascript
  welcome(){
    this.validation.validate() //the validate will fulfil when validation is valid, and reject if not
      .then( () => {
        alert(`Welcome, ${this.fullName}! `);
      });
  }
```
Secondly, let's provide some visual hints to the users. Open your **welcome.html** file and add the validate custom attribute:
``` html 
    <form role="form" submit.delegate="welcome()" validate.bind="validation" > 
```

*Gulp watch* to see the validation in action ([or watch this sample](http://aurelia.io/validation/#/)).


# Validation types

tl;dr: [watch these samples](http://aurelia.io/validation/#/validators)

####isNotEmpty()
This is a special case, dictating that the field is 'required' and cannot be empty.
Empty means null, undefined, '', or if it has a length property (arrays and strings) that the length is 0.
>The isNotEmpty rule is always checked first before any other validation rule.  This means that without the isNotEmpty rule, the .hasMinLength(5) rule would still consider a value of '' as valid because the field is allowed to be empty.

####containsNoSpaces()
Validates that the value entered contains no whitespaces.

####containsOnly(regex)
Validates that value entered tests true for the given *regex*.
> Note: for now this is a synonymn for *matches(regegx)*, however in the future we will try to add the possibility to prevent invalid input for any of the *containsOnly* validation rules.

####containsOnlyAlpha()
Validates that the value entered contains only alpha (lowercase and uppercase letters).

####containsOnlyAlphaOrWhitespace()
Validates that the value entered contains only alpha (lowercase and uppercase letters) or whitespaces.

####containsOnlyAlphanumerics()
Validates that the value entered contains only alphanumerics.

####containsOnlyAlphanumericsOrWhitespace()
Validates that the value entered contains only alphanumerics or whitespaces.

####containsOnlyDigits()
Validates that the value entered contains only digits (0-9)

####containsOnlyLetters()
Synonymn for *containsOnlyAlpha()*

####containsOnlyLettersOrWhitespace()
Synonymn for *containsOnlyAlphaOrWhitespace()*

####hasLengthBetween(minimumValue, maximumValue)
Validates that the value entered is greater than or equal to the provided *minimumValue* and less than or equal to the provided *maximumValue*. 

####hasMinLength(minimumLength)e
Validates that the value entered has a length greater than or equal to the provided *minimumLength*.

####hasMaxLength(maximumLength)
Validates that the value entered has a length less than or equal to the provided *maximumLength*.

####isBetween(minValue, maxValue)
Validates that the value entered is greater than or equal to the provided *minValue* and less than or equal to the provided *maxValue*.
>Arguments can be values or functions that return a value. See ['config.computedFrom'](https://github.com/aurelia/validation/blob/master/doc/Intro.md#configcomputedfromarrayofbindingpaths).

####isEmail()
Validates that the value entered is a properly formed email address.

####isEqualTo(otherValue, otherValueLabel)
Validates that the value entered is strictly equal to the *otherValue*.
Optionally takes an *otherValueLabel*, which will be used in the error message.
>Arguments can be values or functions that return a value. See ['config.computedFrom'](https://github.com/aurelia/validation/blob/master/doc/Intro.md#configcomputedfromarrayofbindingpaths).

####isGreaterThan(minValue)
Validates that the value entered is strictly greater than the provided *minValue*.
>Arguments can be values or functions that return a value. See ['config.computedFrom'](https://github.com/aurelia/validation/blob/master/doc/Intro.md#configcomputedfromarrayofbindingpaths).

####isGreaterThanOrEqualTo(minValue)
Validates that the value entered is greater than or equal to the provided *minValue*.
>Arguments can be values or functions that return a value. See ['config.computedFrom'](https://github.com/aurelia/validation/blob/master/doc/Intro.md#configcomputedfromarrayofbindingpaths).

####isLessThan(maxValue)
Validates that the value entered is strictly smaller than the provided *maxValue*.
>Arguments can be values or functions that return a value. See ['config.computedFrom'](https://github.com/aurelia/validation/blob/master/doc/Intro.md#configcomputedfromarrayofbindingpaths).

####isLessThanOrEqualTo(maxValue)
Validates that the value entered is smaller than or equal to the provided *maxValue*.
>Arguments can be values or functions that return a value. See ['config.computedFrom'](https://github.com/aurelia/validation/blob/master/doc/Intro.md#configcomputedfromarrayofbindingpaths).

####isIn(collection)
Validates that at least one of the values in the *collection* is equal to the value entered.
>Arguments can be values or functions that return a value. See ['config.computedFrom'](https://github.com/aurelia/validation/blob/master/doc/Intro.md#configcomputedfromarrayofbindingpaths).

####isNumber()
Validates that the value entered is numeric.
This supports properly formatted numbers, like '-1,000.00'. (Accepted format depends on the current locale, see **I18N**)

####isStrongPassword(minimumComplexityLevel)
Validates that the value entered is a strong password. A strong password contains each of the following groups: lowercase characters, uppercase characters, digits and special characters.
Optionally takes a *minumumComplexityLevel* of 2, 3 or 4 (default) to allow weak, medium or strong passwords only.
This matches the number of groups (lowercase/uppercase/digits/special characters) that need to be present.
>Note: optimal user experience when preceded with .hasLengthBetween(8,16)
 
####isNotEqualTo(otherValue, otherValueLabel)
Validates that the value entered is not stritly equal to the *otherValue*.
Optionally takes an *otherValueLabel*, which will be used in the error message.
Arguments can be values or functions that return a value. See 'config.computedFrom'.

####isURL()
Validates that the value entered is a valid URL.
Supports web addresses, 'localhost', IP4 and IP6 addresses. Supports query parameters. Supports no protocol, ftp, http or https.
 
####matches(regex)
Validates that the value entered is valid according to the provided *regex* (RegExp).

####passes(customFunction, threshold)
Validates that the value entered is valid according to the provided *customFunction*.
Your *customFunction* is a function that takes two arguments: *newValue* (the value currently being evaluated) and optionally: *threshold*, and returns either...
- true, null, '', undefined or a promise that resolves to the forementioned values: for valid.
- a non-empty string or a promise that resolves to a non-empty string: for invalid. Your non-empty string will be used as the validation message.
- false, any other object or a promise that resolves to the forementioned values: for invalid.
- a promise that rejects to a non-empty string: for invalid. Your non-empty string will be used as the validation message.
- a promise that rejects to anything else: for invalid. 
 
>See ['config.computedFrom'](https://github.com/aurelia/validation/blob/master/doc/Intro.md#configcomputedfromarrayofbindingpaths).

>Note: there is a default message for failing *passes()* rules which states 'invalid value'. For UX purposes, it's suggested to have your custom function return a message, return a promise that resolves or rejects to a message, or  follow the call to *passes()* by a call to *withMessage()*

####passesRule(validationRule)
Validates that the message passes the provided *validationRule* (ValidationRule). See **custom validation**.

####withMessage(message)
Adds a custom message for the previously appended validation rule. *message* is either a static string or a function that takes two arguments: *newValue* (the value that has been evaluated) and **threshold**.


#Logical operators
tl;dr: [watch these samples](http://aurelia.io/validation/#/logical-operators)
##if(conditionalExpression)
###Basic usage
Pass a function (*conditionalExpression*) that returns true of false.
Any conditions that come after the *if(conditionalExpression)* operator will only be evaluated if the *conditionalExpression* evaluates to true.
```javascript
        this.validation = validation.on(this)
            .ensure('state', (config) => {config.computedFrom('country')} )
                .if(() => { return subject.country === 'US'; })
                    .isIn(['TX', 'FL'])
                .endIf()
                .isNotEmpty();
```

###else()
Optionally, chain any *if(conditionalExpression)* with an *else()*. Any conditions that come after the *else()* will only be evaluated if the *conditionalExpression* evaluates to false.
```javascript
        this.validation = validation.on(this)
            .ensure('state', (config) => {config.computedFrom('country')} )
                .if(() => { return subject.country === 'US'; })
                    .isIn(['TX', 'FL'])
                .else()
                    .isNotEmpty()
                .endIf();
```

###*endIf()* and nested cases
The *if(conditionalExpression)* is automatically terminated when you move to the next property (*ensure(propertyName)*). However we suggest you always close your conditional statements with an *endIf* for readability. Especially when nesting statements...
```javascript
        this.validation = validation.on(this)
            .ensure('state', (config) => {config.computedFrom(['country', 'age'])} )
                .if(() => { return subject.country === 'US'; })
                    .isIn(['TX', 'FL'])
                    .if( () => { return subject.state === 'FL'})
                        .passes( () => {return subject.age >= 65;})
                    .endIf() //without endif, the 'else' would apply if state !== 'FL'
                .else()
                    .passes( () => { return subject.age >= 18;})
                .endIf()
                .isNotEmpty();  //Without the endif, the 'isNotEmpty' would only apply to the above else case
```

##switch(conditionalExpression)
###Basic usage
Pass a function (*conditionalExpression*) that returns any label (string, number, ...).
Only the validation statements chained to the *case(label)* that isEqualTo the returned label, will be evaluated.
```javascript
        this.validation = validation.on(this)
            .ensure('state', (config) => {config.computedFrom('country')} )
            .isNotEmpty()
            .switch(() => {return subject.country;})
                .case('US')
                    .isIn(['TX','FL'])
                .case('Belgium')
                    .isIn(['WVL', 'OVL'])
            .endSwitch();
```

###default
If for a given switch statement, no label is matched, the switch will be evaluated as valid.
To add a default case, use the *default()* method.
```javascript
        this.validation = validation.on(this)
            .ensure('state', (config) => {config.computedFrom('country')} )
            .isNotEmpty()
            .switch(() => {return subject.country;})
                .case('US')
                    .isIn(['TX','FL'])
                .case('Belgium')
                    .isIn(['WVL', 'OVL'])
                .default()
                    .hasMinLength(3)
            .endSwitch();
```

###Omitting the *conditionalExpression*
If *switch()* is being called without a *conditionExpression*, it will use the currently evaluated value of the underlying property as a label.
```javascript
        this.validation = validation.on(this)
            .ensure('customerLevel', (config) => {config.computedFrom('income')} )
            .isNotEmpty()
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


#onValidate(validationCallback, failureCallback)
Using the .onValidate(), you can register a callback that is called when the entire subject is validated.  Your function should return an object (or a promise that resolves to an object) that has properties matching each validation property you want to modify, for example:
```javacript
validation = validation.on(this) 
  .ensure('firstName').isNotEmpty()
  .onValidate( () => {
    return {
      firstName : true, //is valid
      lastName : null, //is valid
      middleName : '', //is valid
      addressLine1 : false, //is not valid
      addressLine2 : 'should be in Antarctica' //is not valid with custom message
    });
```

You're not required to return each property in the validation group, and you're not required to return the same properties every time.

You can optionally pass a failureCallback which will be executed if your validationCallback function fails (ie: an exception occurs). Also, if your validationCallback function fails, the validation group will not be considered valid.

#Alternative validation setup
##The @ensure decorator
TL:DR; [Here's an example](http://aurelia.io/validation/#/).
Having a fluent API allows you to keep your code that sets up the validation logic tightly together. However, some people prefer to keep each aspect of their validation close to the property on which it reflects.  You can do this by adding a decorator called @ensure on each property that requires validation.  
The @ensure decorator takes a callback function that will be called when validation is actually set up.
For example:
``` javascript
import {Validation} from 'aurelia-validation';
import {ensure} from 'aurelia-validation';
import {inject} from 'aurelia-framework';

@inject(Validation)
export class Person {
  @ensure(function(it){ it.isNotEmpty().hasLengthBetween(3,10) })
  firstName = 'John';

  constructor(validation) {
    this.validation = validation.on(this);
  }
}
```
As you can see in the example, the callback function you pass to your @ensure decorator can use any of [the validation types mentioned above](https://github.com/aurelia/validation/blob/master/doc/Intro.md#validation-types).

When setting up the validation (*validation.on(this)*), the validation will automaticaly loop over your properties and set up the decorated validation rules for each one.

##Breeze (.onBreezeEntity(entity))
If you are working with breeze.js, your entityManager might already have validation rules in place to protect the integrity of your breeze entities.
Using the validation.onBreezeEntity(entity), you can wrap an 'aurelia-validation' validation over the 'breeze' validation.
``` javascript
  createTodo(initialValues, validation) {
    var entity = this.manager.createEntity('TodoItem', initialValues);
    entity.validation = validation.onBreezeEntity(entity);
    return entity;
  }
```
This gives you the added benefit that you can bind the 'breeze' validation errors in your client using the validate-custom-element:

``` HTML
<form submit.delegate="addItem()" validate.bind="newTodoItem.validation">
        <div class="form-group">
          <label >What needs to be done?</label>
          <input type="text" value.bind="newTodoItem.Description" validate="Description" placeholder="What needs to be done?">
        </div>
        <div class="form-group">
          <button type="submit">Add it</button>
        </div>
      </form>
```
Both client 'breeze' validation errors as the additional ones sent back from the server when attempting to save, will be displayed in the UI.

Additionally, you can use 'aurelia-validation' 's beautiful API to add additional validation rules on top of the 'breeze' validation:
``` javascript
  createTodo(initialValues, validation) {
    var entity = this.manager.createEntity('TodoItem', initialValues);
    entity.validation = validation.onBreezeEntity(entity)
      //optionally add more validation rules
      .ensure("Description").isNotEmpty().hasMinLength(5);
    return entity;
  }
```


#I18N

####Changing locale
Changing the locale is done on a 'global' level by calling *config.useLocale(localeIdentifier)*.

See ['Configuration'](https://github.com/aurelia/validation/blob/master/doc/Intro.md#configuseviewstrategyviewstrategyinstance). 

>Note: error messages already resolved are will be automatically updated when the locale changes.


####Supported locales
- en-US (default)
- fr-FR
- nl-BE
- nl-NL
- de-DE
- sv-SE
- tr-TR
- es-MX

> We could use a little help here...

# Custom validation

#### The ValidationRule class
If you need a complex validation rule, you can extract that into a seperate class that inherits from **ValidationRule** and pass it to the *passes(validationRule)* function.
For example:
``` javascript
import {ValidationRule} from './plugins/validation/'; 
export class MyValidationRule extends ValidationRule{
	constructor (isValid) {
		super(
			isValid, //pass any object as 'threshold'
			(newValue, threshold) => { //pass a validation function
				 return threshold;
			}
			(newValue, threshold) => { //Optionally pass a function that will provide an error message
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
              .isNotEmpty()
              .hasMinLength(3)
              .hasMaxLength(10)
        .ensure('lastName') 
              .isNotEmpty()
              .hasMinLength(3)
              .hasMaxLength(10)
        .ensure('ssn')
              .isNotEmpty()
              .SSN();
```

#Visualization (ValidateCustomAttribute)
##Basic usage
To show validation messages, add the validate custom attribute to any DOM element (the form element is most common) and bind it to your validation instance.
``` html 
    <form role="form" submit.delegate="welcome()" validate.bind="validation" > 
```

The validateCustomAttribute will loop through all nested child elements and try to determine which controls are data-bound to which properties, and if there are validation rules for those properties, it will show visual clues.

##Visual clues and customization
The validate custom attribute uses a strategy based onTwitter Bootstrap by default (see 'configuration') to provide visual clues about valid/invalid properties.
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

To change the default visualisation, see ['config.useViewStrategy'](https://github.com/aurelia/validation/blob/master/doc/Intro.md#configuseviewstrategyviewstrategyinstance).

##How are elements and validation rules matched
The validate custom attribute, once bound to a validation instance, will loop over every child element and try to match elements against validation rules.
A simple example:
```javascript
this.validation = validation.on(this).ensure('firstName').isNotEmpty();
```
```html
<form role="form" class="form-horizontal" validate.bind="validation">
  <div class="form-group">
    <label class="col-sm-2 control-label">First Name</label> 
    <input type="text" placeholder="first name" class="form-control" value.bind="firstName"> 
  </div> 
</form>
```
In this case, the validate custom attribute will recognize the *value.bind="firstName"* attribute and match it against the validation rule you set up with *ensure('firstName')*.

As your viewmodels become more complex or if you start using binding converters, the binding path you used to set up the validation rules might be different than the binding path you used in your view, so you'll need to give the validate custom attribute some extra clues as to which elements should be matched against which validation rules.

Consider this more complex example:
```javascript
this.contact.validation = validation.on(this.contact).ensure('firstName').isNotEmpty();
```

```html
<form role="form" class="form-horizontal" validate.bind="contact.validation">
  <div class="form-group">
    <label class="col-sm-2 control-label">First Name</label> 
    <input type="text" placeholder="first name" class="form-control" value.bind="contact.firstName" validate="firstName"> 
  </div> 
</form>
```
Pay attention to the two validate custom attributes in this example's HTML:
- *validate.bind="contact.validation"* this validate custom attribute will bind the validation to the form.
- *validate="firstName"* this validateCustomAttribute will only tell the parent validateCustomAttribute that this input element should be decorated with the validation result of the rules for *"firstName"*.  This is only needed because the validation rule was created with *ensure('firstName')*, whereas the binding for the same input element has a different binding path: *value.bind="contact.FirstName"*

##Preventing form submission
tl;dr: [watch these samples](http://aurelia.io/validation/#/form-submission)
You could disable your submit function by binding it to the *validation.result.isValid* property: 
``` html
<button type=submit" disabled.bind="!validation.result.isValid" >
```
This has a bit of a weird side effect: a validation message is only shown if the user actually changes the value of a form element, ie. the underlying field is 'dirty'.  Again: there are no visual clues as to what form elements are invalid until the user actually changes the value of a field.
In contrast, calling the *validation.validate()* function will force all validation rules to be re-evaluated, as well as forcing every field to be considered 'dirty', then return a promise that will either resolve or reject, indicating if the entire validation has passed or failed.
In summary: if you do not disable the submit button, but instead call the *validate()* function in your code

``` javascript
this.validation.validate().then( () => {
  //validation is valid, perform action on form submission
});
```

You will have the following user experience:
- all fields in a form show no validation messages
- when the user changes the value, validation messages & visual clues will be shown for each field he/she has edited
- when the user hit submit, all input elements on the form will show validation messages & visual clues
- if all validation rules have passed, the form submission code will actually run. If not, the user will clearly see what properties are valid, which are invalid, and why
    
If you expect the validation to take a while (AJAX call) you can still disable your submit button while validation is taking place:
``` html
<button type=submit" disabled.bind="validation.isValidating" >
```

#ValidationResult
If you need more information about your model's validation status or if you want to bind your validation messages yourself, you can investigate the *validation.result* property.
The *validation.result* property is a *validationResult* object that describes if your model is currently valid, as well as giving detail about each property.
For example, suppose you have a validation set up like this:
```javascript
    this.validation = validation.on(this)
        .ensure('firstName').isNotEmpty().isBetweenOrEqualTo(3,80)
        .ensure('lastName').isNotEmpty().isBetweenOrEqualTo(3,80)
        .ensure('isEmail').isNotEmpty().isEmail();
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
            isEmail : {
                isValid : false,
                isDirty : true,
                message : 'is not a valid isEmail address',
                failingRule : 'EmailValidationRule'
            },
    }
```
Each property will be updated when the validation on that property is triggered (when the value changes, or when the *validate()* is called).
Each property contains four pieces of information:
- *isValid* : a boolean indicating if this property is valid
- *isDirty* : a boolean indicating if this property is dirty (ie: if the value has changed since the validation has been created).  This will also be set to true if the *validate()* is called. (*The isDirty property is used for UX purposes. A model can have invalid defaults, but we don't want to show the user error messages yet until the user actually changes the value, or the user clicks a submit button that triggers the validate().*)
- *message* : a localized error message. See **I18N**
- *failingRule* : a non localized error message identifier of the first rule that failed. Possible values are
  - 'isRequired'
  - 'onValidateCallback'
  - 'AlphaNumericOrWhitespaceValidationRule'
  - 'AlphaNumericValidationRule'
  - 'BetweenLengthValidationRule'
  - 'BetweenValueValidationRule'
  - 'CustomFunctionValidationRule'
  - 'DigitValidationRule'
  - 'EmailValidationRule'
  - 'EqualityValidationRule'
  - 'InEqualityValidationRule'
  - 'EqualityWithOtherLabelValidationRule'
  - 'InEqualityWithOtherLabelValidationRule'
  - 'InCollectionValidationRule'
  - 'MinimumLengthValidationRule'
  - 'MinimumValueValidationRule'
  - 'MaximumLengthValidationRule'
  - 'MaximumValueValidationRule'
  - 'NumericValidationRule'
  - 'RegexValidationRule'
  - 'ContainsOnlyValidationRule'
  - 'StrongPasswordValidationRule'
  - 'MediumPasswordValidationRule'

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

If you need to clear or reset the validationResult, calling *.clear()* on the validation itself will cause the entire validationResult to be reset to valid and non-dirty.
``` javascript
reset(){
  this.firstName = "John";
  this.lastName = "Doe";
  this.validation.clear();
}
```

#Configuration
##One config to rule them all
The validation plugin has one global configuration instance, which is passed to an optional callback function when you first install the plugin:
``` javascript
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-validation', (config) => { config.useLocale('nl-NL') }); 

  aurelia.start().then(a => a.setRoot('app', document.body)); 
}
```

When setting up a validation, or when setting up a validation rule, a child config is passed to an optional callback function as well.
``` javascript
this.validation = validation.on(this, (config) => { config.useDebounceTimeout(150) } )
  .ensure('confirmPassword', (config) => { (config) => {config.computedFrom('password') })
    .isEqualTo( () => { return this.password; });
```

The configuration on the property level will delegate missing config to it's parent at the group-level, which in turn will delegate missing config to it's parent at the global level, which in turn will delegate missing config to the plugin's defaults.

>Note: if you want to access the global configuration instance at a later point in time, you can inject it:
``` javascript
import {ValidationConfig} from 'aurelia-validation';
import {inject} from 'aurelia-framework';

//@inject(ValidationConfig) 
export class MyVM{
  constructor(config)
  {
    
  }
}
```

##Possible configuration
>Note: all these can be chained: 
``` javascript
(config) => { config.useLocale('tr-TR').useDebounceTimeout(150) }
```

###config.useDebounceTimeout(debounceTimeout)
``` javascript
(config) => {config.useDebounceTimemout(150) }
```
Sets the debounce timeout, in ms.  Default is 0. 
Whenever the value changes, the validation plugin will wait the assigned debounce timeout and will only evaluate if there are no subsequent changes within the allowed timeout. 
This is especially useful when using asyncrhoneous validation, to avoid doing validation calls while the user is typing.
Valid on:
- global level
- group level
- property level

###config.computedFrom([arrayOfBindingPaths])
``` javascript
.ensure('confirmPassword', (config) => {config.computedFrom(['password'])})
  .isEqualTo( () => {return this.password }, 'the entered password');
```
Signals that validation on one property should be re-evaluated when a dependent property changes. There is no default.
Valid on:
- property level
 
###config.useLocale(localeIdentifier)
``` javascript
(config) => {config.useLocale('fr-FR') }
```
Uses the specified locale. Default is ('en-US').
Valid on:
- global level
- group level
 
###config.useViewStrategy(viewStrategyInstance)
``` javascript
(config) => { config.useViewStrategy(ValidateCustomAttributeViewStrategy.TWBootstrapAppendToInput }
```
Uses the specified view strategy. This view strategy is consumed by the ValidateCustomAttribute. Possible values are: ValidateCustomAttributeViewStrategy.TWBootstrapAppendToMessage, ValidateCustomAttributeViewStrategy.TWBootstrapAppendToInput and any class that inherits from ValidateCustomAttributeViewStrategyBase.
