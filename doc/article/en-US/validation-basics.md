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

Aurelia Validation's standard rule engine uses a fluent syntax to define a set of rules. There are five parts to the syntax:
1. Selecting a property using `.ensure`
2. Associating rules with the property using `.required`, `.matches`, etc
3. Customizing property rules using `.withMessage`, `.when`, etc
4. Sequencing rules using `.then`
5. Applying the ruleset to a class or instance using `.on`

### ensure

To begin defining a ruleset, use the `ValidationRules` class. Start by targeting a property using `ValidationRules.ensure(...)`. The `ensure` method accepts one argument representing the property name. The argument can be a string or a simple property access expression. If you're using TypeScript you'll probably want to use a property access expression because you'll get the benefit of intellisense, refactoring and avoid using "magic strings" that can be a maintenance issue.

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

Once you've targetted a property using `ensure` you can define the property's display name using `.displayName(name: string|ValidationDisplayNameCallback)`. Display names are used in validation messages. Specifying a display name is optional. If you do not explicitly set the display name the validation engine will attempt to compute the display name for you by splitting the property name on upper-case letters. A `firstName` property's display name would be `First Name`.

<code-listing heading="displayName">
  <source-code lang="ES 2015">
    ValidationRules      
      .ensure('ssn').displayName('SSN')...
  </source-code>
</code-listing>

### Applying Rules

After targeting a property with `ensure` and optionally setting its display name you can begin associating rules with the property using the built-in rule methods:

* `required()` validates the property is not null, undefined or whitespace.
* `matches(regex)` validates the property matches the specified regular expression.
* `email()` validates an email address.
* `minLength(length)` and `maxLength(length)` validate the length of string properties.
* `minItems(count)` and `maxItems(count)` validate the number of items in an array.
* `equals(expectedValue)` validates the property equals the expected value.
* `satisfies((value: any, object?: any) => boolean|Promise<boolean>)` validates the supplied function returns `true` or a `Promise` that resolves to `true`. The function will be invoked with two arguments:
  * the property's current value.
  * the object the property belongs to.

### withMessage

All rules have a standard message that can be overriden on a case-by-case basis using `.withMessage(message)`. The `message` argument is a string that will be interpreted as an interpolation binding expression and evaluated against the validated object when a validation error occurs. The interpolation binding expression can access any of the object's properties as well as the contextual properties listed below:

* `$displayName`: the display name of the property.
* `$propertyName`: the name of the property.
* `$value`: the property value (at the moment the validation rule was executed).
* `$object`: the object that owns the property.
* `$config`: an object containing the rule's configuration. For example, the config for a `minLength` rule will have a `length` property.
* `$getDisplayName`:  returns a displayable name of a property given the property name (irrespective of the property's displayName), split on capital letters, first letter ensured to be capitalized.

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
      .ensure('airportCode')
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

### Sequencing Rule Evaluation

Rules are evaluated in parallel. Use the `.then()` method to postpone evaluation of a rule until after the preceding rules in the `ensure` have been evaluated.

<code-listing heading="Conditional Validation">
  <source-code lang="ES 2015">
    ValidationRules
      .ensure('email')
        .email()
        .required()
        .then()
        .satisfiesRule('emailNotAlreadyRegistered')
      .ensure('username')
        .required()
        .minLength(3)
        .maxLength(50)
        .then()
        .satisfiesRule('usernameNotInUse');
  </source-code>
</code-listing>

In the example above, the `emailNotAlreadyRegistered` custom rule will only be evaluated when the `email` property passes the `required()` and `email()` validations. Likewise, `usernameNotInUse` will be evaluated only when the `required()`, `minLength(3)` and `maxLength(50)` checks pass validation.

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

You can also override the `ValidationMessageProvider`'s `getDisplayName(propertyName: string, displayName: string): string` method:

<code-listing heading="Overriding getDisplayName">
  <source-code lang="ES 2015">
    import {ValidationMessageProvider} from 'aurelia-validation';

    ValidationMessageProvider.prototype.getDisplayName = function(propertyName, displayName) {
      if (displayName !== null && displayName !== undefined) {
        return displayName;
      }
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

    @inject(ValidationControllerFactory)
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

Once you've created a controller you can set its `validationTrigger` to either `blur`, `change`, `changeOrBlur` or `manual`. The default is `blur` which means the validation controller will validate the property accessed in a binding when the binding's associated element "blurs" (loses focus). 

When the trigger is `change`, each change the binding makes to the model property will trigger validation of the property. Use the `throttle`, `debounce` and `updateTrigger` binding behaviors in conjunction with the `change` validate trigger to customize the behavior. 

Use the `manual` trigger to indicate the controller should not automatically validate properties used in bindings. Errors will only be displayed when you invoke the controller's `validate` method and will be cleared when you invoke the controller's `reset` method.

<code-listing heading="Setting the validate trigger">
  <source-code lang="ES 2015">
    import {ValidationControllerFactory, validateTrigger} from 'aurelia-validation';

    @inject(ValidationControllerFactory)
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

You can force the validation controller to run validation by invoking the `validate()` method. Validate will run the validation, render the results and return a `Promise` that resolves with a `ControllerValidateResult` instance. *The promise will only reject when there is an unexpected application error. Be sure to catch these rejections like you would any other unexpected application error.*

Invoking the validate method with no arguments will validate all bindings and objects registered with the controller. You can supply a validate instruction to limit the validation to a specific object, property and ruleset:

<code-listing heading="validate">
  <source-code lang="ES 2015">
    controller.validate();
    controller.validate({ object: person });
    controller.validate({ object: person, rules: myRules });
    controller.validate({ object: person, propertyName: 'firstName' });    
    controller.validate({ object: person, propertyName: 'firstName', rules: myRules });

    controller.validate()
      .then(result => {
        if (result.valid) {
          // validation succeeded
        } else {
          // validation failed
        }
      });
  </source-code>
</code-listing>

Most of the time you will use the `ControllerValidateResult` instance's `valid` property to determine whether validation passed or failed. Use the `results` property to access the `ValidateResult` for every rule that was evaluated by the `controller.validate(...)` call. Each `ValidateResult` has it's own `rule` and `valid` properties that will tell you whether a particular rule passed or failed, along with `message`, `object` and `propertyName` properties. 

The opposite of the `validate` method is `reset`. Calling reset with no arguments will unrender any previously rendered validation results. You can supply a reset instruction to limit the reset to a specific object or property:

<code-listing heading="reset">
  <source-code lang="ES 2015">
    controller.reset();
    controller.reset({ object: person });
    controller.reset({ object: person, propertyName: 'firstName' });
  </source-code>
</code-listing>

### addError & removeError

You may need to surface validation errors from other sources. Perhaps while attempting to save a change the server returned a business rule error. You can display the server error using the controller's `addError(message: string, object: any, propertyName?: string): ValidateResult` method. The method returns a `ValidateResult` instance which can be used to unrender the error using `removeError(result: ValidateResult)`.

### addRenderer & removeRenderer

The validation controller renders errors by sending them to implementations of the `ValidationRenderer` interface. The library ships with a built-in renderer that "renders" the errors to an array property for data-binding/templating purposes. This is covered in the [displaying errors](aurelia-doc://section/11/version/1.0.0) section below. You can create your own [custom renderer](aurelia-doc://section/12/version/1.0.0) and add it to the controller's set of renderers using the `addRenderer(renderer)` method.

## [Validator](aurelia-doc://section/5/version/1.0.0)

`Validator` is an interface used by the `ValidationController` to do the behind-the-scenes work of validating objects and properties. The `aurelia-validation` plugin ships with an implementation of this interface called the `StandardValidator`, which knows how to evaluate rules created by `aurelia-validation`'s fluent API. When you use a `Validator` directly to validate a particular object or property, there are no UI side-effects- the validation results are not sent to the the validation renderers.

### Creating a Validator

Validators can be injected:

<code-listing heading="Creating a Validator">
  <source-code lang="ES 2015">
    import {inject} from 'aurelia-dependency-injection';
    import {Validator} from 'aurelia-validation';

    @inject(Validator)
    export class RegistrationForm {
      validator = null;

      constructor(validator) {
        this.validator = validator;
      }
    }
  </source-code>
</code-listing>

Use the Validator instance's `validateObject` and `validateProperty` methods to run validation without any render side-effects. These methods return a `Promise` that resolves with an array of `ValidateResults`.

## [Validate Binding Behavior](aurelia-doc://section/6/version/1.0.0)

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

The `validate` binding behavior obeys the associated controller's `validateTrigger` (`blur`, `change`, `changeOrBlur`, `manual`). If you'd like to use a different `validateTrigger` in a particular binding use one of the following binding behaviors in place of `& validate`:

* `& validateOnBlur`: the DOM blur event triggers validation.
* `& validateOnChange`: data entry that changes the model triggers validation.
* `& validateOnChangeOrBlur`: DOM blur or data entry triggers validation.
* `& validateManually`: the binding is not validated automatically when the associated element is blurred or changed by the user.

## [Displaying Errors](aurelia-doc://section/7/version/1.0.0)

The controller exposes properties that are useful for creating error UIs using standard Aurelia templating techniques:

* `results`: An array of the current `ValidateResult` instances. These are the results of validating individual rules.
* `errors`: An array of the current `ValidateResult` instances whose `valid` property is false.
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

To build more sophisticated error UIs you might need a list of errors specific to a particular binding or set of bindings. The `validation-errors` custom attribute creates an array containing all validation errors relevant to the element the `validation-errors` attribute appears on and its descendent elements. Here's an example using bootstrap style form markup:

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

The `validation-errors` custom attribute implements the `ValidationRenderer` interface. Instead of doing direct DOM manipulation to display the errors it "renders" the errors to an array property to enable the data-binding and templating scenarios illustrated above. It also automatically adds itself to the controller using `addRenderer` when its "bind" lifecycle event occurs and removes itself from the controller using the `removeRenderer` method when its "unbind" composition lifecycle event occurs.

## [Custom Renderers](aurelia-doc://section/8/version/1.0.0)

The templating approaches described in the previous section may require more markup than you wish to include in your templates. If you would prefer use direct DOM manipulation to render validation errors you can implement a custom renderer.

Custom renderers implement a one-method interface: `render(instruction: RenderInstruction)`. The `RenderInstruction` is an object with two properties: the results to render and the results to unrender. Below is an example implementation for bootstrap forms:

<code-listing heading="bootstrap-form-renderer.ts">
  <source-code lang="TypeScript">
    import {
      ValidationRenderer,
      RenderInstruction,
      ValidateResult
    } from 'aurelia-validation';

    export class BootstrapFormRenderer {
      render(instruction: RenderInstruction) {
        for (let { result, elements } of instruction.unrender) {
          for (let element of elements) {
            this.remove(element, result);
          }
        }

        for (let { result, elements } of instruction.render) {
          for (let element of elements) {
            this.add(element, result);
          }
        }
      }

      add(element: Element, result: ValidateResult) {
        if (result.valid) {
          return;
        }

        const formGroup = element.closest('.form-group');
        if (!formGroup) {
          return;
        }

        // add the has-error class to the enclosing form-group div
        formGroup.classList.add('has-error');

        // add help-block
        const message = document.createElement('span');
        message.className = 'help-block validation-message';
        message.textContent = result.message;
        message.id = `validation-message-${result.id}`;
        formGroup.appendChild(message);
      }

      remove(element: Element, result: ValidateResult) {
        if (result.valid) {
          return;
        }

        const formGroup = element.closest('.form-group');
        if (!formGroup) {
          return;
        }

        // remove help-block
        const message = formGroup.querySelector(`#validation-message-${result.id}`);
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

To use a custom renderer you'll need to instantiate it and pass it to your controller via the `addRenderer` method. Any of the controller's existing errors will be renderered immediately. You can remove a renderer using the `removeRenderer` method. Removing a renderer will unrender any errors that renderer had previously rendered. If you choose to call `addRenderer` in your view-model's `activate` or `bind` methods, make sure to call `removeRenderer` in the corresponding `deactivate` or `unbind` methods.


> Warning
> The renderer example uses `Element.closest`. You'll need to [polyfill](https://github.com/jonathantneal/closest) this method in Internet Explorer.

Here's another renderer for bootstrap forms that demonstrates "success styling". When a property transitions from indeterminate validity to valid or from invalid to valid, the form control will highlight in green. When a property transitions from indeterminate validity to invalid or from valid to invalid, the form control will highlight in red, just like in the previous bootstrap form renderer example.

<code-listing heading="bootstrap-form-renderer.ts">
  <source-code lang="TypeScript">
    export class BootstrapFormRenderer {
      render(instruction: RenderInstruction) {
        for (let { result, elements } of instruction.unrender) {
          for (let element of elements) {
            this.remove(element, result);
          }
        }

        for (let { result, elements } of instruction.render) {
          for (let element of elements) {
            this.add(element, result);
          }
        }
      }

      add(element: Element, result: ValidateResult) {
        const formGroup = element.closest('.form-group');
        if (!formGroup) {
          return;
        }

        if (result.valid) {
          if (!formGroup.classList.contains('has-error')) {
            formGroup.classList.add('has-success');
          }
        } else {
          // add the has-error class to the enclosing form-group div
          formGroup.classList.remove('has-success');
          formGroup.classList.add('has-error');

          // add help-block
          const message = document.createElement('span');
          message.className = 'help-block validation-message';
          message.textContent = result.message;
          message.id = `validation-message-${result.id}`;
          formGroup.appendChild(message);
        }
      }

      remove(element: Element, result: ValidateResult) {
        const formGroup = element.closest('.form-group');
        if (!formGroup) {
          return;
        }

        if (result.valid) {
          if (formGroup.classList.contains('has-success')) {
            formGroup.classList.remove('has-success');
          }
        } else {
          // remove help-block
          const message = formGroup.querySelector(`#validation-message-${result.id}`);
          if (message) {
            formGroup.removeChild(message);

            // remove the has-error class from the enclosing form-group div
            if (formGroup.querySelectorAll('.help-block.validation-message').length === 0) {
              formGroup.classList.remove('has-error');
            }
          }
        }
      }
    }
  </source-code>
</code-listing>

## [Entity Validation](aurelia-doc://section/9/version/1.0.0)

The examples so far show the controller validating specific properties used in `& validate` bindings. The controller can validate whole entities even if some of the properties aren't used in data bindings. Opt in to this "entity" style validation using the controller's `addObject(object, rules?)` method. Calling `addObject` will add the specified object to the set of objects the controller should validate when its `validate` method is called. The `rules` parameter is optional. Use it when the rules for the object haven't been specified using the fluent syntax's `.on` method. You can remove objects from the controller's list of objects to validate using `removeObject(object)`. Calling `removeObject` will unrender any errors associated with the object.

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

## [Custom Rules](aurelia-doc://section/10/version/1.0.0)

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
        || Number.isInteger(value) && value >= min && value <= max,
      `\${$displayName} must be an integer between \${$config.min} and \${$config.max}.`,
      (min, max) => ({ min, max }) 
    );

    ValidationRules
      .ensure('volume')
        .required()
        .satisfiesRule('integerRange', 1, 5000);
  </source-code>
</code-listing>

You may have noticed the custom rule examples above consider `null` and `undefined` to be valid. This is intentional- **a rule should follow the single responsibility principle** and validate only one constraint. It's the `.required()` rule's job to validate whether the data is filled in, you shouldn't add required checking logic to your custom rule for two reasons:

1. Rule reuse- if our "integerRange" rule also does "required" checks, we can't use it on optional fields.
2. Messages Relevance- if our "integerRange" rule also does "required" checks the user will get "range" error messages when we they should have gotten "required" error messages.

When you write a custom rule, the function should return `true` when the rule is "satisfied" / "valid" and `false` when the rule is "broken" / "invalid". Optionally you can return a `Promise` that resolves to `true` or `false`. The promise should not reject unless there's an unexpected exception. Promise rejection is not used for control flow or to represent "invalid" status.

## [Integration With Other Libraries](aurelia-doc://section/11/version/1.0.0)

In `aurelia-validation` the object and property validation work is handled by the `StandardValidator` class which is an implementation of the `Validator` interface. The `StandardValidator` is responsible for applying the rules created with aurelia-validation's fluent syntax. You may not need any of this machinery if you have your own custom validation engine or if you're using a client-side data management library like [Breeze](http://www.getbreezenow.com/breezejs) which has its own validation logic. You can replace the `StandardValidator` with your own implementation when the plugin is installed. Here's an example using breeze:

 <code-listing heading="breeze-validator">
  <source-code lang="ES 2015">
    import {ValidateResult} from 'aurelia-validation';

    export class BreezeValidator {
      validateObject(object) {
        if (object.entityAspect.validateEntity()) {
          return [];
        }
        return object.entityAspect
          .getValidationErrors()
          .map(({ errorMessage, propertyName, key }) => new ValidateResult(key, object, propertyName, false, errorMessage));
      }

      validateProperty(object, propertyName) {
        if (object.entityAspect.validateProperty(propertyName)) {
          return [];
        }
        return object.entityAspect
          .getValidationErrors(propertyName)
          .map(({ errorMessage, propertyName, key }) => new ValidateResult(key, object, propertyName, false, errorMessage));
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

## [Integrating with Aurelia-I18N](aurelia-doc://section/12/version/1.0.0)

`aurelia-i18n` is Aurelia's official I18N plugin. Check out the project's [readme](https://github.com/aurelia/i18n/blob/master/README.md) for information on how to use `aurelia-i18n` in your application.

Integrating `aurelia-i18n` with `aurelia-validation` is easy. All standard validation messages are supplied by the `ValidationMessageProvider` class. To translate the messages, override the `getMessage(key)` and `getDisplayName(propertyName, displayName)` methods with implementations that use `aurelia-i18n` to fetch translated versions of the messages/property-names.

Here's how to override the methods, in your main.js, during application startup:

<code-listing heading="main.js">
  <source-code lang="ES 2015">
    import {I18N} from 'aurelia-i18n';
    import {ValidationMessageProvider} from 'aurelia-validation';

    export function configure(aurelia) {
      ...
      ...

      const i18n = aurelia.container.get(i18n);
      ValidationMessageProvider.prototype.getMessage = function(key) {
        const translation = i18n.tr(`errorMessages.${key}`);
        return this.parser.parseMessage(translation);
      };

      ValidationMessageProvider.prototype.getDisplayName = function(propertyName, displayName) {
        if (displayName !== null && displayName !== undefined) {
          return displayName;
        }
        return i18n.tr(propertyName);
      };

      ...      
      ...
    }
  </source-code>
</code-listing>

### Creating the view and view-model

Once you've overriden the necessary methods in `ValidationMessageProvider` you're ready to create a view and view-model. Here's a view for a simple multi-language form with first and last name fields. All static text is translated using the [T binding behavior](https://github.com/aurelia/i18n#translating-with-the-tbindingbehavior). Validation occurs on form submission and a switch language button demonstrates the i18n capabilities.

<code-listing heading="I18N View">
  <source-code lang="HTML">
    <template>
      <form>
        <label>${'firstName' & t}: <br /> 
          <input type="text" value.bind="firstName & validate" />
        </label>
        <label>${'lastName' & t}: <br />
          <input type="text" value.bind="lastName & validate" />
        </label>
        <button click.delegate="submit()">${'submit' & t}</button>
      </form>
	
      <div>
        <h3>${'latestValidationResult' & t}: ${message}</h3>
        <ul if.bind="controller.errors.length">
          <li repeat.for="error of controller.errors">
            ${error.message}
          </li>
        </ul>
      </div>

	    <button click.trigger="switchLanguage()">${'switchLanguage' & t}</button>
    <template>   
  </source-code>
</code-listing>

Here's the view model:

<code-listing heading="I18N ViewModel">
  <source-code lang="ES 2015">
    import {inject, NewInstance} from 'aurelia-framework';
    import {I18N} from 'aurelia-i18n';
    import {ValidationRules, ValidationController} from 'aurelia-validation';

    @inject(NewInstance.of(ValidationController), I18N)
    export class App {
      firstName;
      lastName;
    
      controller;
      i18n;
      message = '';
    
      constructor(controller, i18n) {
        this.controller = controller;
        this.i18n = i18n;
    
        ValidationRules
          .ensure((m: App) => m.firstName).required()
          .ensure((m: App) => m.lastName).required()
          .on(this);
      }
    
      submit() {
        this.executeValidation();
      }
    
      switchLanguage() {
        const currentLocale = this.i18n.getLocale();
        this.i18n.setLocale(currentLocale === 'en' ? 'de' : 'en')
          .then(() => this.executeValidation());
      }
    
      executeValidation() {
        this.controller.validate()
          .then(errors => {
            if (errors.length === 0) {
              this.message = this.i18n.tr('allGood');
            } else {
              this.message = this.i18n.tr('youHaveErrors');
            }
          });
      }
    }
  </source-code>
</code-listing>

### Translation Files

Last but not least, create translation files that include translations for each propertyName and each validation message key. Below are the German and English files for the example above. Notice the `errorMessages` section has the translation for the `required` rule. In practice, you would need translations for each rule that you use. Take a look at the [`validationMessages` export](https://github.com/aurelia/validation/blob/master/src/implementation/validation-messages.ts) for the full list.

<code-listing heading="Translation files">
  <source-code lang="JSON">
	// file: locales/de/translation.json    
	{
	  "firstName": "Vorname",
	  "lastName": "Nachname",
	  "submit": "Abschicken",
	  "switchLanguage": "Sprache wechseln", 
	  "youHaveErrors": "Es gibt Fehler!",
	  "allGood": "Alles in Ordnung!",
	  "latestValidationResult": "Aktuelles Validierungsergebnis",
	  "errorMessages": {
	    "required": "${$displayName} fehlt!"
	  }
	}

	// file: locales/en/translation.json
	{
	  "firstName": "First name",
	  "lastName": "Last name",
	  "submit": "Submit",
	  "switchLanguage": "Switch language",
	  "youHaveErrors": "You have errors!",
	  "allGood": "All is good!",
	  "latestValidationResult": "Latest validation result",
	  "errorMessages": {
	    "required": "${$displayName} is missing!"
	  }
	}
  </source-code>
</code-listing>

## [Server-Side Validation](aurelia-doc://section/13/version/1.0.0)

The fluent rule API and Validator API can be used server-side in a NodeJS application.

*todo: example*
