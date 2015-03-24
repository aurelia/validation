System.register(["aurelia-templating", "aurelia-binding"], function (_export) {
    var Behavior, ObserverLocator, _createClass, _classCallCheck, ValidateAttachedBehavior;

    return {
        setters: [function (_aureliaTemplating) {
            Behavior = _aureliaTemplating.Behavior;
        }, function (_aureliaBinding) {
            ObserverLocator = _aureliaBinding.ObserverLocator;
        }],
        execute: function () {
            "use strict";

            _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

            _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

            ValidateAttachedBehavior = _export("ValidateAttachedBehavior", (function () {
                function ValidateAttachedBehavior(element, observerLocator) {
                    _classCallCheck(this, ValidateAttachedBehavior);

                    this.element = element;
                    this.observerLocator = observerLocator;
                    this.changedObservers = [];
                }

                _createClass(ValidateAttachedBehavior, {
                    valueChanged: {
                        value: function valueChanged(newValue) {}
                    },
                    attached: {
                        value: function attached() {
                            this.subscribeChangedHandlers(this.element);
                        }
                    },
                    searchFormGroup: {
                        value: function searchFormGroup(currentElement, currentDepth) {
                            if (currentDepth === 5) {
                                return null;
                            }
                            if (currentElement.classList.contains("form-group")) {
                                return currentElement;
                            }
                            return this.searchFormGroup(currentElement.parentNode, 1 + currentDepth);
                        }
                    },
                    findLabels: {
                        value: function findLabels(formGroup, inputId) {
                            var labels = [];
                            this.findLabelsRecursively(formGroup, inputId, labels, 0);
                            return labels;
                        }
                    },
                    findLabelsRecursively: {
                        value: function findLabelsRecursively(currentElement, inputId, currentLabels, currentDepth) {
                            if (currentDepth === 5) {
                                return;
                            }
                            if (currentElement.nodeName === "LABEL" && currentElement.attributes["for"] && currentElement.attributes["for"].value === inputId) {
                                currentLabels.push(currentElement);
                            }

                            for (var i = 0; i < currentElement.children.length; i++) {
                                this.findLabelsRecursively(currentElement.children[i], inputId, currentLabels, 1 + currentDepth);
                            }
                        }
                    },
                    subscribeChangedHandlers: {
                        value: function subscribeChangedHandlers(currentElement) {
                            var _this = this;

                            var atts = currentElement.attributes;
                            if (atts["value.bind"]) {
                                var bindingValue = atts["value.bind"].value;
                                var validationProperty = this.value.result.properties[bindingValue];
                                if (validationProperty !== undefined) {
                                    validationProperty.onValidate(function (validationProperty) {

                                        var formGroup = _this.searchFormGroup(currentElement, 0);
                                        if (formGroup) {
                                            if (validationProperty.isValid) {
                                                formGroup.classList.remove("has-warning");
                                                formGroup.classList.add("has-success");
                                            } else {
                                                formGroup.classList.remove("has-success");
                                                formGroup.classList.add("has-warning");
                                            }
                                            var labels = _this.findLabels(formGroup, currentElement.id);
                                            for (var ii = 0; ii < labels.length; ii++) {
                                                var label = labels[i];
                                                var helpBlock = label.nextSibling;
                                                if (helpBlock) {
                                                    if (!helpBlock.classList) {
                                                        helpBlock = null;
                                                    } else if (!helpBlock.classList.contains("aurelia-validation-message")) {
                                                        helpBlock = null;
                                                    }
                                                }

                                                if (!helpBlock) {
                                                    helpBlock = document.createElement("p");
                                                    helpBlock.classList.add("help-block");
                                                    helpBlock.classList.add("aurelia-validation-message");

                                                    if (label.nextSibling) {
                                                        label.parentNode.insertBefore(helpBlock, label.nextSibling);
                                                    } else {
                                                        label.parentNode.appendChild(helpBlock);
                                                    }
                                                }

                                                helpBlock.textContent = validationProperty.message;
                                            }
                                        }
                                    });
                                }
                            }
                            var children = currentElement.children;
                            for (var i = 0; i < children.length; i++) {
                                this.subscribeChangedHandlers(children[i]);
                            }
                        }
                    },
                    detached: {
                        value: function detached() {}
                    }
                }, {
                    metadata: {
                        value: function metadata() {
                            return Behavior.attachedBehavior("validate");
                        }
                    },
                    inject: {
                        value: function inject() {
                            return [Element, ObserverLocator];
                        }
                    }
                });

                return ValidateAttachedBehavior;
            })());
        }
    };
});

//This empty method must be here, aurelia will not set this.value if it's not :-O