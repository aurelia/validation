// tslint:disable:no-bitwise
import { Optional } from 'aurelia-dependency-injection';
import { TaskQueue } from 'aurelia-task-queue';
import { ValidationController } from './validation-controller';
import { validateTrigger } from './validate-trigger';
import { getTargetDOMElement } from './get-target-dom-element';
import { getPropertyInfo } from './property-info';
import { Expression } from 'aurelia-binding';

/**
 * Binding behavior. Indicates the bound property should be validated.
 */
export abstract class ValidateBindingBehaviorBase {
  constructor(private taskQueue: TaskQueue) { }

  protected abstract getValidateTrigger(controller: ValidationController): validateTrigger;

  public bind(binding: any, source: any, rulesOrController?: ValidationController | any, rules?: any) {
    // identify the target element.
    const target = getTargetDOMElement(binding, source);

    // locate the controller.
    let controller: ValidationController;
    if (rulesOrController instanceof ValidationController) {
      controller = rulesOrController;
    } else {
      controller = source.container.get(Optional.of(ValidationController));
      rules = rulesOrController;
    }
    if (controller === null) {
      throw new Error(`A ValidationController has not been registered.`);
    }

    controller.registerBinding(binding, target, rules);
    binding.validationController = controller;
    const trigger = this.getValidateTrigger(controller);
    const event =
      (trigger & validateTrigger.blur) === validateTrigger.blur ? 'blur'
        : (trigger & validateTrigger.focusout) === validateTrigger.focusout ? 'focusout'
          : null;
    const hasChangeTrigger = (trigger & validateTrigger.change) === validateTrigger.change;
    binding.isDirty = !hasChangeTrigger;
    // validatedOnce is used to control whether controller should validate upon user input
    //
    // always true when validation trigger doesn't include "blur" event (blur/focusout)
    // else it will be set to true after (a) the first user input & loss of focus or (b) validation
    binding.validatedOnce = hasChangeTrigger && event === null;
    if (hasChangeTrigger) {
      binding.vbbUpdateSource = binding.updateSource;
      // tslint:disable-next-line:only-arrow-functions
      // tslint:disable-next-line:space-before-function-paren
      binding.updateSource = function (value: any) {
        this.vbbUpdateSource(value);
        this.isDirty = true;
        if (this.validatedOnce) {
          this.validationController.validateBinding(this);
        }
      };
    }

    if (event !== null) {
      binding.focusLossHandler = () => {
        this.taskQueue.queueMicroTask(() => {
          if (binding.isDirty) {
            controller.validateBinding(binding);
            binding.validatedOnce = true;
          }
        });
      };
      binding.validationTriggerEvent = event;
      binding.validateTarget = target;
      target.addEventListener(event, binding.focusLossHandler);
      if (hasChangeTrigger) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { propertyName } = getPropertyInfo(binding.sourceExpression as Expression, binding.source)!;
        binding.validationSubscription = controller.subscribe((event) => {
          if (!binding.validatedOnce && event.type === 'validate') {
            binding.validatedOnce = event.errors.findIndex((e) => e.propertyName === propertyName) > -1;
          }
        });
      }
    }

    if (trigger !== validateTrigger.manual) {
      binding.standardUpdateTarget = binding.updateTarget;
      // tslint:disable-next-line:only-arrow-functions
      // tslint:disable-next-line:space-before-function-paren
      binding.updateTarget = function (value: any) {
        this.standardUpdateTarget(value);
        this.validationController.resetBinding(this);
      };
    }
  }

  public unbind(binding: any) {
    // reset the binding to it's original state.
    if (binding.vbbUpdateSource) {
      binding.updateSource = binding.vbbUpdateSource;
      binding.vbbUpdateSource = null;
    }
    if (binding.standardUpdateTarget) {
      binding.updateTarget = binding.standardUpdateTarget;
      binding.standardUpdateTarget = null;
    }
    if (binding.focusLossHandler) {
      binding.validateTarget.removeEventListener(binding.validationTriggerEvent, binding.focusLossHandler);
      binding.focusLossHandler = null;
      binding.validateTarget = null;
    }
    if (binding.validationSubscription) {
      binding.validationSubscription.dispose();
      binding.validationSubscription = null;
    }
    binding.validationController.unregisterBinding(binding);
    binding.validationController = null;
    binding.isDirty = null;
    binding.validatedOnce = null;
  }
}
