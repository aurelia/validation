define(['exports', 'aurelia-metadata', './validation-error'], function (exports, _aureliaMetadata, _validationError) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.validationRenderer = undefined;
  var validationRenderer = exports.validationRenderer = _aureliaMetadata.protocol.create('aurelia:validation-renderer', function (target) {
    if (!(typeof target.render === 'function')) {
      return 'Validation renderers must implement: render(error: ValidationError, target: Element): void';
    }

    if (!(typeof target.unrender === 'function')) {
      return 'Validation renderers must implement: unrender(error: ValidationError, target: Element): void';
    }

    return true;
  });
});