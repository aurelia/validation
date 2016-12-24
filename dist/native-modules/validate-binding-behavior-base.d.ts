import { TaskQueue } from 'aurelia-task-queue';
import { ValidationController } from './validation-controller';
/**
 * Binding behavior. Indicates the bound property should be validated.
 */
export declare abstract class ValidateBindingBehaviorBase {
    private taskQueue;
    constructor(taskQueue: TaskQueue);
    protected abstract getValidateTrigger(controller: ValidationController): number;
    /**
     * Gets the DOM element associated with the data-binding. Most of the time it's
     * the binding.target but sometimes binding.target is an aurelia custom element,
     * or custom attribute which is a javascript "class" instance, so we need to use
     * the controller's container to retrieve the actual DOM element.
     */
    getTarget(binding: any, view: any): any;
    bind(binding: any, source: any, rulesOrController?: ValidationController | any, rules?: any): void;
    unbind(binding: any): void;
}
