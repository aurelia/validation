Covered:
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

Not Covered:
* Deep object graph validation (vs simple property validation)

Open Questions:
* Promise rejection during validation currently will break everything.
  Need to catch and surface the rejection somewhere else while keeping the overall state
  consistent.
