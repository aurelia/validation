System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var validateTrigger;
    return {
        setters:[],
        execute: function() {
            /**
            * Validation triggers.
            */
            exports_1("validateTrigger", validateTrigger = {
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
            });
        }
    }
});
