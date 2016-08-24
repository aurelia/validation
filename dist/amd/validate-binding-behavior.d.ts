import { TaskQueue } from 'aurelia-task-queue';
import { ValidationController } from './validation-controller';
/**
 * Binding behavior. Indicates the bound property should be validated.
 */
export declare class ValidateBindingBehavior {
    private taskQueue;
    static inject: typeof TaskQueue[];
    constructor(taskQueue: TaskQueue);
    /**
    * Gets the DOM element associated with the data-binding. Most of the time it's
    * the binding.target but sometimes binding.target is an aurelia custom element,
    * which is a javascript "class" instance, so we need to use the controller to
    * locate the actual DOM element.
    */
    getTarget(binding: any, view: any): any;
    bind(binding: any, source: any, rulesOrController?: ValidationController | any, rules?: any): void;
    unbind(binding: any): void;
}
