System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isString(value) {
        return Object.prototype.toString.call(value) === '[object String]';
    }
    exports_1("isString", isString);
    function isNumber(value) {
        return Object.prototype.toString.call(value) === '[object Number]';
    }
    exports_1("isNumber", isNumber);
    return {
        setters: [],
        execute: function () {
        }
    };
});
