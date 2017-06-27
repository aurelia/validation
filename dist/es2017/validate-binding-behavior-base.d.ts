import { TaskQueue } from 'aurelia-task-queue';
import { ValidationController } from './validation-controller';
import { validateTrigger } from './validate-trigger';
/**
 * Binding behavior. Indicates the bound property should be validated.
 */
export declare abstract class ValidateBindingBehaviorBase {
    private taskQueue;
    constructor(taskQueue: TaskQueue);
    protected abstract getValidateTrigger(controller: ValidationController): validateTrigger;
    bind(binding: any, source: any, rulesOrController?: ValidationController | any, rules?: any): void;
    unbind(binding: any): void;
}
