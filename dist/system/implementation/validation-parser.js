System.register(['aurelia-binding', 'aurelia-templating', './util'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var aurelia_binding_1, aurelia_templating_1, util_1;
    var ValidationParser;
    return {
        setters:[
            function (aurelia_binding_1_1) {
                aurelia_binding_1 = aurelia_binding_1_1;
            },
            function (aurelia_templating_1_1) {
                aurelia_templating_1 = aurelia_templating_1_1;
            },
            function (util_1_1) {
                util_1 = util_1_1;
            }],
        execute: function() {
            ValidationParser = (function () {
                function ValidationParser(parser, bindinqLanguage) {
                    this.parser = parser;
                    this.bindinqLanguage = bindinqLanguage;
                    this.emptyStringExpression = new aurelia_binding_1.LiteralString('');
                    this.nullExpression = new aurelia_binding_1.LiteralPrimitive(null);
                    this.undefinedExpression = new aurelia_binding_1.LiteralPrimitive(undefined);
                }
                ValidationParser.prototype.coalesce = function (part) {
                    // part === null || part === undefined ? '' : part
                    return new aurelia_binding_1.Conditional(new aurelia_binding_1.Binary('||', new aurelia_binding_1.Binary('===', part, this.nullExpression), new aurelia_binding_1.Binary('===', part, this.undefinedExpression)), this.emptyStringExpression, new aurelia_binding_1.CallMember(part, 'toString', []));
                };
                ValidationParser.prototype.parseMessage = function (message) {
                    var parts = this.bindinqLanguage.parseInterpolation(null, message);
                    if (parts === null) {
                        return new aurelia_binding_1.LiteralString(message);
                    }
                    var expression = new aurelia_binding_1.LiteralString(parts[0]);
                    for (var i = 1; i < parts.length; i += 2) {
                        expression = new aurelia_binding_1.Binary('+', expression, new aurelia_binding_1.Binary('+', this.coalesce(parts[i]), new aurelia_binding_1.LiteralString(parts[i + 1])));
                    }
                    return expression;
                };
                ValidationParser.prototype.getFunctionBody = function (f) {
                    function removeCommentsFromSource(str) {
                        return str.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, '$1');
                    }
                    var s = removeCommentsFromSource(f.toString());
                    return s.substring(s.indexOf('{') + 1, s.lastIndexOf('}'));
                };
                ValidationParser.prototype.getAccessorExpression = function (f) {
                    var body = this.getFunctionBody(f).trim();
                    body = body.replace(/^['"]use strict['"];/, '').trim();
                    body = body.substr('return'.length).trim();
                    body = body.replace(/;$/, '');
                    return this.parser.parse(body);
                };
                ValidationParser.prototype.parseProperty = function (property) {
                    var accessor;
                    if (util_1.isString(property)) {
                        accessor = this.parser.parse(property);
                    }
                    else {
                        accessor = this.getAccessorExpression(property);
                    }
                    if (accessor instanceof aurelia_binding_1.AccessMember && accessor.object instanceof aurelia_binding_1.AccessScope) {
                        return {
                            name: accessor.name,
                            displayName: null
                        };
                    }
                    throw new Error("Invalid subject: \"" + accessor + "\"");
                };
                ValidationParser.inject = [aurelia_binding_1.Parser, aurelia_templating_1.BindingLanguage];
                return ValidationParser;
            }());
            exports_1("ValidationParser", ValidationParser);
        }
    }
});
