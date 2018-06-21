"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isString(value) {
    return Object.prototype.toString.call(value) === '[object String]';
}
exports.isString = isString;
function isNumber(value) {
    return Object.prototype.toString.call(value) === '[object Number]';
}
exports.isNumber = isNumber;
