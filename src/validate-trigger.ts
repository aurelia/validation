/**
 * Validation triggers.
 */
export enum validateTrigger {
  /**
   * Manual validation.  Use the controller's `validate()` and  `reset()` methods
   * to validate all bindings.
   */
  manual = 0,           // 0x000

  /**
   * Validate the binding when the binding's target element fires a DOM "blur" event.
   */
  blur = 1,             // 0x001

  /**
   * Validate the binding when it updates the model due to a change in the view.
   */
  change = 2,           // 0x010

  /**
   * Validate the binding when the binding's target element fires a DOM "blur" event and
   * when it updates the model due to a change in the view.
   */
  changeOrBlur = 3,     // 0x011

  /**
   * Validate the binding when the binding's target element fires a DOM "focusout" event.
   * Unlike "blur", this event bubbles.
   */
  focusout = 4,         // 0x100

  /**
   * Validate the binding when the binding's target element fires a DOM "focusout" event or
   * when it updates the model due to a change in the view.
   */
  changeOrFocusout = 6, // 0x110
}
