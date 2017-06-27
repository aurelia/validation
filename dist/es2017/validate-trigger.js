/**
 * Validation triggers.
 */
export var validateTrigger;
(function (validateTrigger) {
    /**
     * Manual validation.  Use the controller's `validate()` and  `reset()` methods
     * to validate all bindings.
     */
    validateTrigger[validateTrigger["manual"] = 0] = "manual";
    /**
     * Validate the binding when the binding's target element fires a DOM "blur" event.
     */
    validateTrigger[validateTrigger["blur"] = 1] = "blur";
    /**
     * Validate the binding when it updates the model due to a change in the view.
     */
    validateTrigger[validateTrigger["change"] = 2] = "change";
    /**
     * Validate the binding when the binding's target element fires a DOM "blur" event and
     * when it updates the model due to a change in the view.
     */
    validateTrigger[validateTrigger["changeOrBlur"] = 3] = "changeOrBlur";
})(validateTrigger || (validateTrigger = {}));
