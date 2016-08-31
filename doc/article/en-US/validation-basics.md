---
{
  "name": "Validation: Basics",
  "culture": "en-US",
  "description": "The basics of validation with Aurelia.",
  "engines" : { "aurelia-doc" : "^1.0.0" },
  "author": {
    "name": "Jeremy Danyow",
  	"url": "http://danyow.net"
  },
  "contributors": [],
  "translators": [],
  "keywords": ["Validation", "Data Binding", "JavaScript", "TypeScript"]
}
---

## [Introduction](aurelia-doc://section/1/version/1.0.0)

This article covers the basics of validation with Aurelia's validation plugin. You'll learn how to add validation to your applications using a fluent rule API and minimal changes to your templates.

To get started you'll need to install `aurelia-validation` using `jspm install aurelia-validation` or `npm install aurelia-validation --save`. Afterwards, add `.plugin('aurelia-validation')` to the configuration in your `main.js` to ensure the plugin is loaded at application startup.

If you're using the `aurelia-cli`, add the following configuration to your `aurelia.json` after you've installed the package with npm. 

<code-listing heading="aurelia.json">
  <source-code lang="ES 2015">
    {
      "name": "aurelia-validation",
      "path": "../node_modules/aurelia-validation/dist/amd",
      "main": "aurelia-validation"
    }
  </source-code>
</code-listing>

If you're not sure where to put this, search your `aurelia.json` for *aurelia-templating-resources* and put it underneath.

## [Defining Rules](aurelia-doc://section/2/version/1.0.0)

Aurelia Validation's standard rule engine uses a fluent syntax to define a set of rules. There are four parts to the syntax:
1. Selecting a property using `.ensure`
2. Associating rules with the property using `.required`, `.matches`, etc
3. Customizing property rules using `.withMessage`, `.when`, etc
4. Applying the ruleset to a class or instance using `.on`

### ensure

To begin defining a ruleset, use the `ValidationRules` class. Start by targetting a property using `ValidationRules.ensure(...)`. The `ensure` method accepts one argument representing the property name. The argument can be a string or a simple property access expression. If you're using TypeScript you'll probably want to use a property access expression because you'll get the benefit of intellisense, refactoring and avoid using "magic strings" that can be a maintenance issue.

<code-listing heading="Ensure">
  <source-code lang="ES 2015">
    ValidationRules
      .ensure('firstName')...

    ValidationRules
      .ensure(p => p.firstName)...
  </source-code>
  <source-code lang="TypeScript">
    ValidationRules
      .ensure('firstName')...

    ValidationRules
      .ensure((p: Person) => p.firstName)...
  </source-code>
</code-listing>

### displayName

Once you've targetted a property using `ensure` you can define the property's display name using `.displayName(name: string)`. Display names are used in validation messages. Specifying a display name is optional. If you do not explicitly set the display name the validation engine will attempt to compute the display name for you by splitting the property name on upper-case letters. A `firstName` property's display name would be `First Name`.

<code-listing heading="displayName">
  <source-code lang="ES 2015">
    ValidationRules      
      .ensure('ssn').displayName('SSN')...
  </source-code>
</code-listing>

### Applying Rules

After targetting a property with `ensure` and optionally setting it's display name you can begin associating rules with the property using the built-in rule methods:

* `required()` validates a the property is not null, undefined or whitespace.
* `matches(regex)` validates the property matches the specified regular expression.
* `email()` validates an email address.
* `minLength(length)` and `maxLength(length)` validate the length of string properties.
* `minItems(count)` and `maxItems(count)` validate the number of items in an array.
* `satisfies((value: any, object?: any) => boolean|Promise<boolean>)` validates the supplied function returns `true` or a `Promise` that resolves to `true`. The function will be invoked with two arguments:
  * the property's current value.
  * the object the property belongs to.

### withMessage

All rules have a standard message that can be overriden on a case-by-case basis using `.withMessage(message)`. The `message` argument is a string that will be interpretted as an interpolation binding expression and evaluated against the validated object when a validation error occurs. The interpolation binding expression can access any of the object's properties as well as the contextual properties listed below:

* `$displayName`: the display name of the property.
* `$propertyName`: the name of the property.
* `$value`: the property value (at the moment the validation rule was executed).
* `$object`: the object that owns the property.
* `$config`: an object containing the rule's configuration. For example, the config for a `minLength` rule will have a `length` property.

Here's an example:

<code-listing heading="withMessage">
  <source-code lang="ES 2015">
    ValidationRules      
      .ensure('ssn').displayName('SSN')
        .required().withMessage(`\${$displayName} cannot be blank.`);
        .matches(/\d{3}-\d{2}-\d{4}/).withMessage(`\"${$value}" is not a valid \${$displayName}.`);
  </source-code>
</code-listing>

### withMessageKey

Another way to override messages on a case-by-case basis is to use the `.withMessageKey(key)` fluent API. Key is a string representing a key in the `validationMessages` dictionary. You can add new keys to the dictionary using the following code:

<code-listing heading="withMessageKey">
  <source-code lang="ES 2015">
    import {validationMessages} from 'aurelia-validation';

    validationMessages['invalidAirportCode'] = `\${$displayName} is not a valid airport code.`;

    ValidationRules
      .ensure('airportCode)
        .matches(/^[A-Z]{3}$/).withMessageKey('invalidAirportCode')...
  </source-code>
</code-listing>

### Conditional Validation

You may run into situations where you only want a rule to be evaluated when certain conditions are met. Use the `.when(condition: (object) => boolean)` fluent API to define a condition that must be met before the rule is evaluated. `when` accepts one argument, a function that takes the object and returns a boolean that indicates whether the rule should (`true`) or should not (`false`) be evaluated.

<code-listing heading="Conditional Validation">
  <source-code lang="ES 2015">
    ValidationRules
      .ensure('email')
        .email()
        .required()
          .when(order => order.shipmentNotifications)
          .withMessage('Email is required when shipment notifications have been requested.');
  </source-code>
</code-listing>

### Tagging Rules

Use the `.tag(tag: string)` method to tag a specific property rule with a name. You can retrieve rules with a specific tag using `let someRules = ValidationRules.taggedRules(rules, tag)`. This can come in handy when you want to execute a specific rule or subset of rules. The documentation for the ValidationController (below) shows how to validate specific objects/properties/rules. You can also use the subset of rules with the Validator API (also documented below).

### on

Once your ruleset has been defined you can apply them to a class using the `.on` method. This will ensure the validation engine can locate the rules when evaluating a particular object.

<code-listing heading="Applying Rules to a Class">
  <source-code lang="ES 2015">
    export class Person {
      firstName = '';
      lastName = '';
    }

    ValidationRules
      .ensure('firstName').required()
      .ensure('lastName').required()
      .on(Person);
  </source-code>
</code-listing>

`.on` can apply the rules to a plain JavaScript object as well:

<code-listing heading="Applying Rules to an Object">
  <source-code lang="ES 2015">
    let patient = {
      firstName: '',
      lastName: ''
    };

    ValidationRules
      .ensure('firstName').required()
      .ensure('lastName').required()
      .on(patient);
  </source-code>
</code-listing>

There is no requirement to apply the rules directly to an object or class, you can capture the ruleset in a variable or property using `.rule` instead:

<code-listing heading="Storing Rules in a Property">
  <source-code lang="ES 2015">
    const personRules = ValidationRules
      .ensure('firstName').required()
      .ensure('lastName').required()
      .rules;
  </source-code>
</code-listing>

## [Customizing Messages](aurelia-doc://section/3/version/1.0.0)

The previous section showed how to customize the message of an individual property rule. You can override messages system-wide by replacing a rule's default message in the `validationMessages` dictionary:

<code-listing heading="Overriding Messages">
  <source-code lang="ES 2015">
    import {validationMessages} from 'aurelia-validation';

    validationMessages['required'] = `\${$displayName} is missing!`;
  </source-code>
</code-listing>

You can override the `ValidationMessageProvider`'s `getMessage(key: string): Expression` method to enable more dynamic message logic:

<code-listing heading="Overriding getMessage">
  <source-code lang="ES 2015">
    import {ValidationMessageProvider} from 'aurelia-validation';

    ValidationMessageProvider.prototype.standardGetMessage = ValidationMessageProvider.prototype.getMessage;
    ValidationMessageProvider.prototype.getMessage = function(key) {
      const translation = i18next.t(key);
      return this.parser.parseMessage(translation);
    };
  </source-code>
</code-listing>

You can also override the `ValidationMessageProvider`'s `computeDisplayName(propertyName: string): string` method:

<code-listing heading="Overriding computeDisplayName">
  <source-code lang="ES 2015">
    import {ValidationMessageProvider} from 'aurelia-validation';

    ValidationMessageProvider.prototype.computeDisplayName = function(propertyName) {
      return i18next.t(propertyName);
    };
  </source-code>
</code-listing>

## [Validation Controller](aurelia-doc://section/4/version/1.0.0)

The `ValidationController` orchestrates the UI process of validating properties in response to various triggers and surfacing validation errors via renderers. Typically you'll have one validation controller instance per "form" view model. Depending on the use-case you may have multiple.

### Creating a Controller

Validation controllers can be created using the `NewInstance` resolver:

<code-listing heading="Creating a Controller">
  <source-code lang="ES 2015">
    import {inject, NewInstance} from 'aurelia-dependency-injection';
    import {ValidationController} from 'aurelia-validation';

    @inject(NewInstance.of(ValidationController))
    export class RegistrationForm {
      controller = null;

      constructor(controller) {
        this.controller = controller;
      }
    }
  </source-code>
</code-listing>

Or with the `ValidationControllerFactory`:

<code-listing heading="Creating a Controller">
  <source-code lang="ES 2015">
    import {ValidationControllerFactory} from 'aurelia-validation';

    @inject(ValidationControllerFactory))
    export class RegistrationForm {
      controller = null;

      constructor(controllerFactory) {
        this.controller = controllerFactory.createForCurrentScope();
      }
    }
  </source-code>
  <source-code lang="TypeScript">
    import {autoinject} from 'aurelia-dependency-injection';
    import {ValidationControllerFactory, ValidationController} from 'aurelia-validation';

    @autoinject
    export class RegistrationForm {
      controller: ValidationController;

      constructor(controllerFactory: ValidationControllerFactory) {
        this.controller = controllerFactory.createForCurrentScope();
      }
    }
  </source-code>
</code-listing>

Both techniques create a new instance of a `ValidationController` and register the instance in the component's container enabling other components in the validation library to access the approriate controller instance without needing a lot of boilerplate code or markup.

If you'd like to be completely explicit when wiring up controllers with view models and bindings, or if you need to use multiple controllers in your component, you can use the `Factory` resolver or the `ValidationControllerFactory`'s `create` method to create controller instances. Using these approaches will not automatically register the controller instance in the container which will prevent the automatic wire-up of controllers with bindings and renderers and will force you to specify the controller instance in your bindings and add renderers to the controller manually.

### Setting the Validate Trigger

Once you've created a controller you can set it's `validationTrigger` to either `blur`, `change` or `manual`. The default is `blur` which means the validation controller will validate the property accessed in a binding when the binding's associated element "blurs" (loses focus). 

When the trigger is `change`, each change the binding makes to the model property will trigger validation of the property. Use the `throttle`, `debounce` and `updateTrigger` binding behaviors in conjunction with the `change` validate trigger to customize the behavior. 

Use the `manual` trigger to indicate the controller should not automatically validate properties used in bindings. Errors will only be displayed when you invoke the controller's `validate` method and will be cleared when you invoke the controller's `reset` method.

<code-listing heading="Setting the validate trigger">
  <source-code lang="ES 2015">
    import {ValidationControllerFactory, validateTrigger} from 'aurelia-validation';

    @inject(ValidationControllerFactory))
    export class RegistrationForm {
      controller = null;

      constructor(controller) {
        this.controller = ValidationControllerFactory.createForCurrentScope();

        this.controller.validateTrigger = validateTrigger.manual;
      }
    }
  </source-code>
</code-listing>

### validate & reset

You can force the validation controller to run validation by invoking the `validate()` method. Validate will run the validation, render any resulting validation errors and return a `Promise` that resolves with an array of validation errors. *The promise will only reject when there is an unexpected application error. Be sure to catch these rejections like you would any other unexpected application error.*

Invoking the validate method with no arguments will validate all bindings and objects registered with the controller. You can supply a validate instruction to limit the validation to a specific object, property and ruleset:

<code-listing heading="validate">
  <source-code lang="ES 2015">
    controller.validate();
    controller.validate({ object: person });
    controller.validate({ object: person, rules: myRules });
    controller.validate({ object: person, propertyName: 'firstName' });    
    controller.validate({ object: person, propertyName: 'firstName', rules: myRules });    
  </source-code>
</code-listing>

The opposite method to `validate` is `reset`. Calling reset with no arguments will unrender any previously rendered errors. You can supply a reset instruction to limit the validation to a specific object or property:

<code-listing heading="reset">
  <source-code lang="ES 2015">
    controller.reset();
    controller.reset({ object: person });
    controller.reset({ object: person, propertyName: 'firstName' });    
  </source-code>
</code-listing>

### addError & removeError

You may need to surface validation errors from other sources. Perhaps while attempting to save a change the server returned a business rule error. You can display the server error using the controller's `addError(message: string, object: any, propertyName?: string): ValidationError` method. The method returns the resulting `ValidationError` instance which can be used to unrender the error using `removeError(validationError: ValidationError)`.

### addRenderer & removeRenderer

The validation controller renders errors by sending them to classes that implement the `ValidationRenderer` interface. The library ships with a built-in renderer that "renders" the errors to an array property for data-binding/templating purposes. This is covered in the [displaying errors](aurelia-doc://section/11/version/1.0.0) section below. You can create you're own [custom renderer](aurelia-doc://section/12/version/1.0.0) and add it to the controller's set of renderers using the `addRenderer(renderer)` method.

## [Validate Binding Behavior](aurelia-doc://section/5/version/1.0.0)

The `validate` binding behavior enables quick and easy validation for two-way data-bindings. The behavior registers the binding instance with a controller, enabling the system to validate the binding's associated property when the validate trigger occurs (blur / change). The binding behavior is able to identify the object and property name to validate in all sorts of binding expressions:

<code-listing heading="Automatic Binding Validation">
  <source-code lang="HTML">
    <input type="text" value.bind="firstName & validate">
    
    <input type="text" value.bind="person.firstName & validate">
    
    <input type="text" value.bind="person['firstName'] | upperCase & validate">

    <input type="text" value.bind="currentEntity[p] & debounce & validate">    
  </source-code>
</code-listing>

`validate` accepts a couple of optional arguments enabling you to explicitly specify the rules and controller instance:

<code-listing heading="Explicit Binding Validation">
  <source-code lang="HTML">
    <input type="text" value.bind="firstName & validate:personController">
    
    <input type="text" value.bind="firstName & validate:personRules">

    <input type="text" value.bind="firstName & validate:personController:personRules">
  </source-code>
</code-listing>

## [Displaying Errors](aurelia-doc://section/6/version/1.0.0)

The controller exposes two properties that are useful for creating error UIs using standard Aurelia templating techniques:

* `errors`: An array of the current `ValidationError` instances.
* `validating`: a boolean that indicates whether the controller is currently executing validation.

Assuming your view-model had a controller property you could add a simple error summary to your form using a repeat:

<code-listing heading="Simple Validation Summary">
  <source-code lang="HTML">
    <form>
      <ul if.bind="controller.errors">
        <li repeat.for="error of controller.errors">
          ${error.message}
        </li>
      </ul>
      ...
      ...
    </form>
  </source-code>
</code-listing>

To build more sophisticated error UIs you might need a list of errors specific to a particular binding or set of bindings. The `validation-errors` custom attribute creates an array containing all validation errors relevant to the element the `validation-errors` attribute appears on and it's descendent elements. Here's an example using bootstrap style form markup:

<code-listing heading="validation-errors custom attribute">
  <source-code lang="HTML">
    <form>
      <div class="form-group" validation-errors.bind="firstNameErrors"
           class.bind="firstNameErrors.length ? 'has-error' : ''">
        <label for="firstName">First Name</label>
        <input type="text" class="form-control" id="firstName" 
               placeholder="First Name"
               value.bind="firstName & validate">
        <span class="help-block" repeat.for="errorInfo of firstNameErrors">
          ${errorInfo.error.message}
        <span>
      </div>

      <div class="form-group" validation-errors.bind="lastNameErrors"
           class.bind="lastNameErrors.length ? 'has-error' : ''">
        <label for="lastName">Last Name</label>
        <input type="text" class="form-control" id="lastName"
               placeholder="Last Name"
              value.bind="lastName & validate">
        <span class="help-block" repeat.for="errorInfo of lastNameErrors">
          ${errorInfo.error.message}
        <span>
      </div>
    </form>
  </source-code>
</code-listing>

This first form-group div uses the `validation-errors` custom attribute to create a `firstNameErrors` property. When there are items in the array the bootstrap `has-error` class is applied to the form-group div. Each error message is displayed below the input using `help-block` spans. The same approach is used to display the lastName field's errors.

The `validation-errors` custom attribute is implements the `ValidationRenderer` interface. Instead of doing direct DOM manipulation to display the errors it "renders" the errors to an array property to enable the data-binding and templating scenarios illustrated above. It also automatically adds itself to the controller using `addRender` when it's "bind" lifecycle event occurs and removes itself from the controller using the `removeRenderer` method when it's "unbind" composition lifecycle event occurs.

## [Custom Renderers](aurelia-doc://section/7/version/1.0.0)

The templating approaches described in the previous section may require more markup than you wish to include in your templates. If you would prefer use direct DOM manipulation to render validation errors you can implement a custom renderer.

Custom renderers implement a one-method interface: `render(instruction: RenderInstruction)`. The `RenderInstruction` is an object with two properties: the errors to render and the errors to unrender. Below is an example implementation for bootstrap forms:

<code-listing heading="bootstrap-form-renderer.ts">
  <source-code lang="TypeScript">
    import {
      ValidationRenderer,
      RenderInstruction,
      ValidationError
    } from 'aurelia-validation';

    export class BootstrapFormRenderer {
      render(instruction: RenderInstruction) {
        for (let { error, elements } of instruction.unrender) {
          for (let element of elements) {
            this.remove(element, error);
          }
        }

        for (let { error, elements } of instruction.render) {
          for (let element of elements) {
            this.add(element, error);
          }
        }
      }

      private add(element: Element, error: ValidationError) {
        const formGroup = element.closest('.form-group');
        if (!formGroup) {
          return;
        }
        
        // add the has-error class to the enclosing form-group div
        formGroup.classList.add('has-error');

        // add help-block
        const message = document.createElement('span');
        message.className = 'help-block validation-message';
        message.textContent = error.message;
        message.id = `validation-message-${error.id}`;
        formGroup.appendChild(message);
      }

      private remove(element: Element, error: ValidationError) {
        const formGroup = element.closest('.form-group');
        if (!formGroup) {
          return;
        }

        // remove help-block
        const message = formGroup.querySelector(`#validation-message-${error.id}`);
        if (message) {
          formGroup.removeChild(message);
          
          // remove the has-error class from the enclosing form-group div
          if (formGroup.querySelectorAll('.help-block.validation-message').length === 0) {    
            formGroup.classList.remove('has-error');
          }
        }
      }
    }
  </source-code>
</code-listing>

To use a custom renderer you'll need to instantiate it and pass it to your controller via the `addRenderer` method. Any of the controller's existing errors will be renderered immediately. You can remove a renderer using the `removeRenderer` method. Removing a renderer will unrender any errors that renderer had previously rendered.


> Warning
> The renderer example uses `Element.closest`. You'll need to [polyfill](https://github.com/jonathantneal/closest) this method in Internet Explorer.

## [Entity Validation](aurelia-doc://section/8/version/1.0.0)

The examples so far show the controller validating specific properties used in `& validate` bindings. The controller can validate whole entities even if some of the properties aren't used in data bindings. Opt in to this "entity" style validation using the controller's `addObject(object, rules?)` method. Calling `addObject` will add the specified object to the set of objects the controller should validate when it's `validate` method is called. The `rules` parameter is optional. Use it when the rules for the object haven't been specified using the fluent syntax's `.on` method. You can remove objects from the controller's list of objects to validate using `removeObject(object)`. Calling `removeObject` will unrender any errors associated with the object.

You may have rules that are not associated with a single property. The fluent rule syntax has an `ensureObject()` method you can use to define rules for the whole object.

 <code-listing heading="ensureObject">
  <source-code lang="ES 2015">
    export class Shipment {
      length = 0;
      width = 0;
      height = 0;
    }

    ValidationRules
      .ensureObject()
        .satisfies(obj => obj.length * obj.width * obj.height <= 50)
          .withMessage('Volume cannot be greater than 50 cubic centemeters.')
      .on(Shipment);
  </source-code>
</code-listing>

## [Custom Rules](aurelia-doc://section/9/version/1.0.0)

The fluent API's `satisfies` method enables quick custom rules. If you have a custom rule that you need to use multiple times you can define it using the `customRule` method. Once defined, you can apply the rule using `satisfiesRule`.  Here's how you could define and use a simple date validation rule:

<code-listing heading="addRule">
  <source-code lang="ES 2015">
    ValidationRules.customRule(
      'date',
      (value, obj) => value === null || value === undefined || value instanceof Date,
      `\${$displayName} must be a Date.` 
    );

    ValidationRules
      .ensure('startDate')
        .required()
        .satisfiesRule('date');
  </source-code>
</code-listing>

You will often need to pass arguments to your custom rule. Below is an example of an "integer range" rule that accepts "min" and "max" arguments. Notice the last parameter to the `customRule` method packages up the expected parameters into a "config" object. The config object is used when computing the validation message when an error occurs, enabling the message expression to access the rule's configuration.

<code-listing heading="addRule">
  <source-code lang="ES 2015">
    ValidationRules.customRule(
      'integerRange',
      (value, obj, min, max) => value === null || value === undefined 
        || Number.isInteger(value) && value >= config.min && value <= config.max,
      `\${$displayName} must be an integer between \${$config.min} and \${config.max}.`,
      (min, max) => ({ min, max }) 
    );

    ValidationRules
      .ensure('volume')
        .required()
        .satisfiesRule('integerRange', 1, 5000);
  </source-code>
</code-listing>

You may have noticed the custom rule examples above consider `null` and `undefined` to be valid. This is intentional- typically you should not mix "required" checks into your custom rule's logic. Doing so would prevent using your custom rule with non-required fields.

## [Integration With Other Libraries](aurelia-doc://section/10/version/1.0.0)

In `aurelia-validation` the object and property validation work is handled by the `StandardValidator` class which is an implementation of the `Validator` interface. The `StandardValidator` is responsible for applying the rules created with aurelia-validation's fluent syntax. You may not need any of this machinery if you have your own custom validation engine or if you're using a client-side data management library like [Breeze](http://www.getbreezenow.com/breezejs) which has it's own validation logic. You can replace the `StandardValidator` with your own implementation when the plugin is installed. Here's an example using breeze:

 <code-listing heading="breeze-validator">
  <source-code lang="ES 2015">
    import {ValidationError} from 'aurelia-validation';

    export class BreezeValidator {
      validateObject(object) {
        if (object.entityAspect.validateEntity()) {
          return [];
        }
        return object.entityAspect
          .getValidationErrors()
          .map(({ errorMessage, propertyName, key }) => new ValidationError(key, errorMessage, object, propertyName));
      }

      validateProperty(object, propertyName) {
        if (object.entityAspect.validateProperty(propertyName)) {
          return [];
        }
        return object.entityAspect
          .getValidationErrors(propertyName)
          .map(({ errorMessage, propertyName, key }) => new ValidationError(key, errorMessage, object, propertyName));
      }
    }
  </source-code>
</code-listing>
<code-listing heading="main">
  <source-code lang="ES 2015">
    import {BreezeValidator} from './breeze-validator';

    export function configure(aurelia) {
      aurelia.use
        .standardConfiguration()
        .plugin('aurelia-validation', config => config.customValidator(BreezeValidator))
        ...

      ...
    }
  </source-code>
</code-listing>

## [Integrating with Aurelia-I18N](aurelia-doc://section/11/version/1.0.0)

In order to translate your error messages you can use the official [Aurelia-I18N plugin](https://github.com/aurelia/i18n). Please visit the [repos ReadMe](https://github.com/aurelia/i18n/blob/master/README.md) to get up to date how to setup the plugin properly with your app.

### Setting up the View

Below you can find an example of a simple translated app, accepting a last- and first name and validating those when clicking the submit button. Besides that throughout all places where normal strings would be placed, we use the [TBinding](https://github.com/aurelia/i18n#translating-with-the-tbindingbehavior) to be able to show static texts in the proper language as well. One additional feature to note is the top-most button which switches the current language. 

<code-listing heading="View with I18N Support">
  <source-code lang="HTML">
    <template>
	  <button click.trigger="switchLanguage()">${'switchLanguage' & t}</button>
	  <br /><br />
	  <form>
	    <label>${'firstname' & t}: <br /> 
	      <input type="text" value.bind="firstName & validate" />
	    </label><br />
	    <label>${'lastname' & t}: <br />
	      <input type="text" value.bind="lastName & validate" />
	    </label> <br /><br />
	    <button click.delegate="submit()">${'submit' & t}</button>
	  </form>
	
	  <div>
	    <h3>${'errorMessages.latestValidationResult' & t}: ${message}</h3>
	    <ul if.bind="ctrl.errors">
	      <li repeat.for="error of ctrl.errors">
	        ${error.message}
	      </li>
	    </ul>
	  </div>
	<template>   
  </source-code>
</code-listing>

### Sample Translations

Speaking of languages, you can find the translation files for German and English, used for this example below. As you see the top level contains the captions of buttons and the validated fields, whereas the `errorMessages` property defines all the used messages displayed. 

<code-listing heading="Translation files">
  <source-code lang="JSON">
	// file: locales/de/translation.json    
	{
	  "firstname": "Vorname",
	  "lastname": "Nachname",
	  "submit": "Abschicken",
	  "switchLanguage": "Sprache wechseln", 
	  "errorMessages": {
	    "youHaveErrors": "Es gibt Fehler!",
	    "allGood": "Alles in Ordnung!",
	    "latestValidationResult": "Aktuelles Validierungsergebnis",
	    "required": "${$displayName} fehlt!",
	    "invalid": "${$displayName} ist ungültig!"
	  }
	}

	// file: locales/en/translation.json
	{
	  "firstname": "First name",
	  "lastname": "Last name",
	  "submit": "Submit",
	  "switchLanguage": "Switch language",
	  "errorMessages": {
	    "youHaveErrors": "You have errors!",
	    "allGood": "All is good!",
	    "latestValidationResult": "Latest validation result",
	    "required": "${$displayName} is missing!",
	    "invalid": "${$displayName} is invalid!"
	  }
	}
  </source-code>
</code-listing>

### Using I18N with Validation in Code
 
Last but not least lets take a look at the ViewModel. We won't focus on the validation specific code like setting up the rules, but on I18N specific changes.
First of all we import `I18N` from the `aurelia-i18n` module. Next, along with the new instance of the `ValidationController`, we additionally inject the `I18N Service`. As usual this will be injected in the constructor and can be assigned to a class property. Next we setup two simple required validation rules.
Now in order to translate the resulting error messages, generated by aurelia-validation, we can override the `getMessage` method. Before doing so, we will save the original instance in a method `standardGetMessage`. The overridden `getMessage` first creates a translation where the `key` in this case is required due to our `ValidationRules`. We do so by using i18n's method [tr](https://github.com/aurelia/i18n#translating-via-code). With that done we need to forward the translated message to the parser's `parseMessage` method.

If you look up at the translation files, you will see that `errorMessages.required` is using a ES6-style interpolation including `$displayName` as provided variable. This now represents the actual field that was checked for with the required condition, `firstname` or `lastname`. So in order to get the fieldname translated as well we can override the `computeDisplayName` method and simply use the `propertyName` argument in our translation. Remember that you can manipulate the attribute as needed, in our case we lower case it so it matches the keys from our translation files.

The function `submit` is used by the submit button to kick of the validation inside `executeValidation`. As you can see we create a custom summary error state message, again using i18n's `tr` method, and assign the result to the class property message.     

Last but not least `switchLanguage` is called when we toggle the language. We first get the active locale and then just toggle to the alternate locale using the function [setLocale](https://github.com/aurelia/i18n#setting-the-active-locale). The method returns a promise when the new locale is active and this is the moment where we can decide what happens with our already shown translations. Either hide them, or as depicted in this example simply re-validate. This really depends on your use case.

<code-listing heading="ViewModel for the I18N Example">
  <source-code lang="ES 2015">
    import {inject, NewInstance} from 'aurelia-framework';
	import {I18N} from 'aurelia-i18n';
	import {
	  ValidationRules,
	  ValidationController,
	  ValidationMessageProvider
	} from 'aurelia-validation';
	
	@inject(NewInstance.of(ValidationController), I18N)
	export class App {
	  firstName;
	  lastName;
	
	  ctrl;
	  i18n;
	  message = '';
	
	  constructor(ctrl, i18n) {
	    this.ctrl = ctrl;
	    this.i18n = i18n;
	
		ValidationRules
	      .ensure((m: App) => m.firstName).required()
	      .ensure((m: App) => m.lastName).required()
	      .on(this);

	    ValidationMessageProvider.prototype.standardGetMessage = ValidationMessageProvider.prototype.getMessage;
	    ValidationMessageProvider.prototype.getMessage = function(key) {
	      const translation = i18n.tr(`errorMessages.${key}`);
	      return this.parser.parseMessage(translation);
	    };
	
	    ValidationMessageProvider.prototype.computeDisplayName = function(propertyName) {
	      const displayName = i18n.tr(propertyName.toLowerCase());
	      return displayName;
	    };
	  }
	
	  submit() {
	    this.executeValidation();
	  }
	
	  switchLanguage() {
	    const currentLocale = this.i18n.getLocale();
	    this.i18n.setLocale(currentLocale === 'en' ? 'de' : 'en')
	      .then( () => this.executeValidation());
	  }
	
	  executeValidation() {
	    this.ctrl.validate()
	      .then( (v) => {
	        if (v.length === 0) {
	          this.message = this.i18n.tr('errorMessages.allGood');
	        } else {
	          this.message = this.i18n.tr('errorMessages.youHaveErrors');
	        }
	      });
	  }
	}
  </source-code>
</code-listing>

 

## [Server-Side Validation](aurelia-doc://section/12/version/1.0.0)

The fluent rule API and Validator API can be used server-side in a NodeJS application.

*todo: example*
