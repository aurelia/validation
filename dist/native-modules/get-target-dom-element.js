import { DOM } from 'aurelia-pal';
/**
 * Gets the DOM element associated with the data-binding. Most of the time it's
 * the binding.target but sometimes binding.target is an aurelia custom element,
 * or custom attribute which is a javascript "class" instance, so we need to use
 * the controller's container to retrieve the actual DOM element.
 */
export function getTargetDOMElement(binding, view) {
    var target = binding.target;
    // DOM element
    if (target instanceof Element) {
        return target;
    }
    // custom element or custom attribute
    // tslint:disable-next-line:prefer-const
    for (var i = 0, ii = view.controllers.length; i < ii; i++) {
        var controller = view.controllers[i];
        if (controller.viewModel === target) {
            var element = controller.container.get(DOM.Element);
            if (element) {
                return element;
            }
            throw new Error("Unable to locate target element for \"" + binding.sourceExpression + "\".");
        }
    }
    throw new Error("Unable to locate target element for \"" + binding.sourceExpression + "\".");
}
