import { Container } from 'aurelia-dependency-injection';
/**
 * Creates ValidationController instances.
 */
export declare class ValidationControllerFactory {
    private container;
    static inject: typeof Container[];
    constructor(container: Container);
    /**
     * Creates a new controller and registers it in the current element's container so that it's
     * available to the validate binding behavior and renderers.
     */
    create(): any;
    /**
     * Creates a new controller and registers it in the current element's container so that it's
     * available to the validate binding behavior and renderers.
     */
    createForCurrentScope(): any;
}
