# Enhancements

* First class TypeScript support
* Asynchronous validation
* Entity validation
* Multiple controllers per view.
* Drop validate.js
* Errors that aren't specific to a particular property/element
* Conditional validation
* Make it easier to define custom rules
* Make it easier to customize error messages / I18N
* Keyed message resources
* Use binding engine to render message templates
* Improve renderer API to make animation scenarios and "success" scenarios possible

# Under Consideration

* Enable specifying rules for nested properties: `ValidationRules.ensure('foo.bar.baz').required();`
* Validation sequencing: add an option or change the standard behavior such that rules specific to a particular property are validated sequentially. The first validation error cancels the remaining validation work for the property. Side-effect: properties would never have more than one error. Benefit: expensive rules could be validated only when everything else is valid.

# Known Issues

* `& validate` does not work with two-way custom attributes because it's unable to locate the associated DOM element.
* Rule property decorators missing. `@required`, etc

# Demos

* Fluent API:
  ensure, displayName
  Rules: required, satisfies, min/max-length/items, email, matches 
  Message customization: withMessage, withMessageKey
  when,
* Replacing default messages
* 

