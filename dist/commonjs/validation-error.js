'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValidationError = exports.ValidationError = function ValidationError() {
  _classCallCheck(this, ValidationError);

  this.message = '';
  this.propertyName = '';
};