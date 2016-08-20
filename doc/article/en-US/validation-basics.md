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

This article covers the basics of validation with Aurelia's validation plugin. You'll learn how to effortlessly add validation to your applications with minimal framework intrusion.

todo: lead off with basic example.


* Definining rules
  * Fluent syntax  
  * target a property use `ensure`
    * string property name
    * lambda property name
    * optionally set the property's display name using `displayName`. If you don't explicitly set the display name aurelia-validation will attempt to guess the name...
  * add rules
    * required
    * matches
    * email
    * minLength / maxLength
    * minItems / maxItems
    * satisfies
      * boolean or Promise<boolean>
  * Customize a specific rule's message using `withMessage` `withMessageKey`.
  * Conditionally validate a rule using `when`
  * apply rules using `.on()`
  * return rules using `.rules`

* Customizing messages
  * Overriding default messages
  * Adding custom message keys
  * ValidationMessageProvider 
    * `getMessage`
    * `computeDisplayName`

* validation controller
  * creating using NewInstance.of / ValidationControllerFactory
  * validation trigger
    * blur (default)
    * change
    * manual
  * validate
  * reset
  * addError / removeError
  * errors
  * validating

* validate binding behavior
  * basic
  * explicit rules
  * explicit rules and controller

* validation-errors custom attribute

* validation-renderer custom attribute

* writing a custom renderer
  bootstrap
  * why? performance, simpler markup, reuse

* "entity" validation
  * enables `ensureObject`

* Integration with other libraries
  * breeze

* Server-Side Validation / Validation with UI
  * Validator class - validateObject,validateProperty


--------


## [HTML and SVG Attributes](aurelia-doc://section/2/version/1.0.0)


<code-listing heading="HTML Attribute Binding Examples">
  <source-code lang="HTML">
    <input type="text" value.bind="firstName">
    <input type="text" value.two-way="lastName">

    <a class="external-link" href.bind="profile.blogUrl">Blog</a>
    <a class="external-link" href.one-way="profile.twitterUrl">Twitter</a>
    <a class="external-link" href.one-time="profile.linkedInUrl">LinkedIn</a>
  </source-code>
</code-listing>





------------------------------

<code-listing heading="app${context.language.fileExtension}">
  <source-code lang="ES 2015">
    export class App {
      constructor() {
        this.motherboard = false;
        this.cpu = false;
        this.memory = false;
      }
    }
  </source-code>
  <source-code lang="ES 2016">
    export class App {
      motherboard = false;
      cpu = false;
      memory = false;
    }
  </source-code>
  <source-code lang="TypeScript">
    export class App {
      motherboard = false;
      cpu = false;
      memory = false;
    }
  </source-code>
</code-listing>

<code-listing heading="app.html">
  <source-code lang="HTML">
    <template>
      <form>
        <h4>Products</h4>
        <label><input type="checkbox" checked.bind="motherboard">  Motherboard</label>
        <label><input type="checkbox" checked.bind="cpu"> CPU</label>
        <label><input type="checkbox" checked.bind="memory"> Memory</label>

        motherboard = ${motherboard}<br/>
        cpu = ${cpu}<br/>
        memory = ${memory}<br/>
      </form>
    </template>
  </source-code>
</code-listing>

<au-demo heading="Boolean checkboxes demo">
  <source-code src="example/binding-checkboxes/booleans/app.js"></source-code>
</au-demo>
