define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
    * Validation triggers.
    */
    exports.validateTrigger = {
        /**
        * Validate the binding when the binding's target element fires a DOM "blur" event.
        */
        blur: 'blur',
        /**
        * Validate the binding when it updates the model due to a change in the view.
        * Not specific to DOM "change" events.
        */
        change: 'change',
        /**
        * Manual validation.  Use the controller's `validate()` and  `reset()` methods
        * to validate all bindings.
        */
        manual: 'manual'
    };
});
