export * from './controller-validate-result';
export * from './get-target-dom-element';
export * from './property-info';
export * from './property-accessor-parser';
export * from './validate-binding-behavior';
export * from './validate-event';
export * from './validate-instruction';
export * from './validate-result';
export * from './validate-trigger';
export * from './validation-controller';
export * from './validation-controller-factory';
export * from './validation-errors-custom-attribute';
export * from './validation-renderer-custom-attribute';
export * from './validation-renderer';
export * from './validator';
export * from './implementation/rule';
export * from './implementation/rules';
export * from './implementation/standard-validator';
export * from './implementation/validation-messages';
export * from './implementation/validation-message-parser';
export * from './implementation/validation-rules';
import { Container } from 'aurelia-dependency-injection';
import { Validator } from './validator';
/**
 * Aurelia Validation Configuration API
 */
export declare class AureliaValidationConfiguration {
    private validatorType;
    /**
     * Use a custom Validator implementation.
     */
    customValidator(type: {
        new (...args: any[]): Validator;
    }): void;
    /**
     * Applies the configuration.
     */
    apply(container: Container): void;
}
/**
 * Configures the plugin.
 */
export declare function configure(frameworkConfig: {
    container: Container;
    globalResources?: (...resources: string[]) => any;
}, callback?: (config: AureliaValidationConfiguration) => void): void;
