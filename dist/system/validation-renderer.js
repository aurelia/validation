'use strict';

System.register(['aurelia-metadata'], function (_export, _context) {
  "use strict";

  var protocol, validationRenderer;
  return {
    setters: [function (_aureliaMetadata) {
      protocol = _aureliaMetadata.protocol;
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