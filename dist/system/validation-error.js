"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var ValidationError;

  

  return {
    setters: [],
    execute: function () {
      _export("ValidationError", ValidationError = function ValidationError(rule, message, object) {
        var propertyName = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

        

        this.rule = rule;
        this.message = message;
        this.object = object;
        this.propertyName = propertyName || null;
      });

      _export("ValidationError", ValidationError);
    }
  };
});