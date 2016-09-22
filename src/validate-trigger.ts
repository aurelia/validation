/**
* Validation triggers.
*/
export const validateTrigger = {
  /**
  * Validate the binding when the binding's target element fires a DOM "blur" event.
  */
  blur: 'blur',

  /**
  * Validate the binding when it updates the model due to a change in the view.
  */
  change: 'change',

  /**
   * Validate the binding when the binding's target element fires a DOM "blur" event and
   * when it updates the model due to a change in the view.
   */
  changeOrBlur: 'changeOrBlur',

  /**
  * Manual validation.  Use the controller's `validate()` and  `reset()` methods
  * to validate all bindings.
  */
  manual: 'manual'
};
