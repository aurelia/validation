System.register(["aurelia-binding", "./util"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function getAccessorExpression(fn) {
        /* tslint:disable:max-line-length */
        var classic = /^function\s*\([$_\w\d]+\)\s*\{(?:\s*"use strict";)?\s*(?:[$_\w\d.['"\]+;]+)?\s*return\s+[$_\w\d]+\.([$_\w\d]+)\s*;?\s*\}$/;
        /* tslint:enable:max-line-length */
        var arrow = /^\(?[$_\w\d]+\)?\s*=>\s*[$_\w\d]+\.([$_\w\d]+)$/;
        var match = classic.exec(fn) || arrow.exec(fn);
        if (match === null) {
            throw new Error("Unable to parse accessor function:\n" + fn);
        }
        return match[1];
    }
    exports_1("getAccessorExpression", getAccessorExpression);
    var aurelia_binding_1, util_1, PropertyAccessorParser;
    return {
        setters: [
            function (aurelia_binding_1_1) {
                aurelia_binding_1 = aurelia_binding_1_1;
            },
            function (util_1_1) {
                util_1 = util_1_1;
            }
        ],
        execute: function () {
            PropertyAccessorParser = /** @class */ (function () {
                function PropertyAccessorParser(parser) {
                    this.parser = parser;
                }
                PropertyAccessorParser.prototype.parse = function (property) {
                    if (util_1.isString(property)) {
                        return property;
                    }
                    var accessorText = getAccessorExpression(property.toString());
                    var accessor = this.parser.parse(accessorText);
                    if (accessor instanceof aurelia_binding_1.AccessScope
                        || accessor instanceof aurelia_binding_1.AccessMember && accessor.object instanceof aurelia_binding_1.AccessScope) {
                        return accessor.name;
                    }
                    throw new Error("Invalid property expression: \"" + accessor + "\"");
                };
                PropertyAccessorParser.inject = [aurelia_binding_1.Parser];
                return PropertyAccessorParser;
            }());
            exports_1("PropertyAccessorParser", PropertyAccessorParser);
        }
    };
});
