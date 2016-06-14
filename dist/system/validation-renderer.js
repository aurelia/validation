'use strict';

System.register(['aurelia-metadata', './validation-error'], function (_export, _context) {
  "use strict";

  var protocol, ValidationError, validationRenderer;
  return {
    setters: [function (_aureliaMetadata) {
      protocol = _aureliaMetadata.protocol;
    }, function (_validationError) {
      ValidationError = _validationError.ValidationError;
    }],
    execute: function () {
      _export('validationRenderer', validationRenderer = protocol.create('aurelia:validation-renderer', function (target) {
        if (!(typeof target.render === 'function')) {
          return 'Validation renderers must implement: render(error: ValidationError, target: Element): void';
        }

        if (!(typeof target.unrender === 'function')) {
          return 'Validation renderers must implement: unrender(error: ValidationError, target: Element): void';
        }

        return true;
      }));

      _export('validationRenderer', validationRenderer);
    }
  };
});