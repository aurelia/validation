import {Behavior} from 'aurelia-templating';
import {ObserverLocator} from 'aurelia-binding'

export class ValidateAttachedBehavior {
    static metadata() {
        return Behavior
            .attachedBehavior('validate');
    }

    static inject() {
        return [Element, ObserverLocator];
    }

    constructor(element, observerLocator) {
        this.element = element;
        this.observerLocator = observerLocator;
        this.changedObservers = [];
    }

    valueChanged(newValue) {
        //This empty method must be here, aurelia will not set this.value if it's not :-O
    }
    attached() {
        this.subscribeChangedHandlers(this.element);
    }

    searchFormGroup(currentElement, currentDepth) {
        if (currentDepth === 5) {
            return null;
        }
        if (currentElement.classList.contains('form-group')) {
            return currentElement;
        }
        return this.searchFormGroup(currentElement.parentNode, 1 + currentDepth);
    }


    findLabels(formGroup, inputId)
    {
        var labels = [];
        this.findLabelsRecursively(formGroup, inputId, labels, 0);
        return labels;
    }

    findLabelsRecursively(currentElement, inputId, currentLabels, currentDepth)
    {
        if (currentDepth === 5) {
            return;
        }
        if(currentElement.nodeName === "LABEL" &&
                currentElement.attributes['for'] &&
                currentElement.attributes['for'].value === inputId)
        {
            currentLabels.push(currentElement);
        }


        for(let i = 0; i < currentElement.children.length; i++)
            this.findLabelsRecursively(currentElement.children[i], inputId, currentLabels, 1 + currentDepth);
    }

    subscribeChangedHandlers(currentElement) {
        var atts = currentElement.attributes;
        if (atts['value.bind']) {
            var bindingValue = atts['value.bind'].value;
            var validationProperty = this.value.result.properties[bindingValue];
            if(validationProperty !== undefined) {
                validationProperty.onValidate(
                    (validationProperty) => {

                        var formGroup = this.searchFormGroup(currentElement, 0);
                        if (formGroup) {
                            if (validationProperty.isValid) {
                                formGroup.classList.remove('has-warning');
                                formGroup.classList.add('has-success');

                            }
                            else {
                                formGroup.classList.remove('has-success');
                                formGroup.classList.add('has-warning');
                            }
                            var labels = this.findLabels(formGroup, currentElement.id);
                            for (var ii = 0; ii < labels.length; ii++) {
                                var label = labels[i];
                                var helpBlock = label.nextSibling;
                                if (helpBlock) {
                                    if (!helpBlock.classList) {
                                        helpBlock = null;
                                    }
                                    else if (!helpBlock.classList.contains('aurelia-validation-message')) {
                                        helpBlock = null;
                                    }
                                }

                                if (!helpBlock) {
                                    helpBlock = document.createElement("p");
                                    helpBlock.classList.add('help-block');
                                    helpBlock.classList.add('aurelia-validation-message');

                                    if (label.nextSibling) {
                                        label.parentNode.insertBefore(helpBlock, label.nextSibling);
                                    }
                                    else {
                                        label.parentNode.appendChild(helpBlock);
                                    }
                                }

                                helpBlock.textContent = validationProperty.message;
                            }

                        }
                    }
                );
            }
        }
        var children = currentElement.children;
        for (var i = 0; i < children.length; i++) {
            this.subscribeChangedHandlers(children[i]);
        }
    }

    detached() {
    }
}