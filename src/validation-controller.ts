import {Binding, Expression} from 'aurelia-binding';
import {Validator} from './validator';
import {validateTrigger} from './validate-trigger';
import {getPropertyInfo} from './property-info';
import {ValidationRenderer, RenderInstruction} from './validation-renderer';
import {ValidationError} from './validation-error';

/**
 * Information related to an "& validate" decorated binding.
 */
interface BindingInfo {
  /**
   * The DOM element associated with the binding.
   */
  target: Element;

  /**
   * The rules associated with the binding via the validate binding behavior's rules parameter.
   */
  rules?: any;
}

export interface ValidateInstructionBase {
  /**
   * The object to validate.
   */
  object: any;

  /**
   * The property to validate. Optional.
   */
  propertyName?: any;
}

/**
 * Validate instructions (what to validate).
 */
export interface ValidateInstruction extends ValidateInstructionBase {
  /**
   * The rules to validate. Optional.
   */
  rules?: any;
}

/**
 * Reset instructions (what to reset).
 */
export interface ResetInstruction extends ValidateInstructionBase {
}

export class ValidationController {
  static inject = [Validator];

  // Registered bindings (via the validate binding behavior)
  private bindings = new Map<Binding, BindingInfo>();

  // Renderers that have been added to the controller instance.
  private renderers: ValidationRenderer[] = [];

  /**
   * Errors that have been rendered by the controller.
   */
  public errors: ValidationError[] = [];

  /**
   *  Whether the controller is currently validating.
   */
  public validating: boolean = false;

  // Elements related to errors that have been rendered.
  private elements = new Map<ValidationError, Element[]>();

  // Objects that have been added to the controller instance (entity-style validation).
  private objects = new Map<any, any>();

  // The trigger that will invoke automatic validation of a property used in a binding.
  public validateTrigger = validateTrigger.change;

  // Promise that resolves when validation has completed.
  private finishValidating = Promise.resolve();

  constructor(private validator: Validator) {}

  /**
   * Adds an object to the set of objects that should be validated when validate is called.
   * @param object The object.
   * @param rules Optional. The rules. If rules aren't supplied the Validator implementation will lookup the rules.
   */
  addObject(object: any, rules?: any): void {
    this.objects.set(object, rules);
  }

  /**
   * Removes an object from the set of objects that should be validated when validate is called.
   * @param object The object.
   */
  removeObject(object: any): void {
    this.objects.delete(object);
    this.processErrorDelta(
      this.errors.filter(error => error.object === object),
      []);
  }

  /**
   * Adds and renders a ValidationError.
   */
  addError(message: string, object: any, propertyName?: string): ValidationError {
    const error = new ValidationError({}, message, object, propertyName);
    this.processErrorDelta([], [error]);
    return error;
  }

  /**
   * Removes and unrenders a ValidationError.
   */
  removeError(error: ValidationError) { 
    if (this.errors.indexOf(error) !== -1) {
      this.processErrorDelta([error], []);
    }
  }

  /**
   * Adds a renderer.
   * @param renderer The renderer.
   */
  addRenderer(renderer: ValidationRenderer) {
    this.renderers.push(renderer);
    renderer.render(this.errors.map(error => (<RenderInstruction>{
      type: 'add',
      newError: error,
      newElements: <Element[]>this.elements.get(error)
    })));
  }

  /**
   * Removes a renderer.
   * @param renderer The renderer.
   */
  removeRenderer(renderer: ValidationRenderer) {
    this.renderers.splice(this.renderers.indexOf(renderer), 1);
    renderer.render(this.errors.map(error => (<RenderInstruction>{
      type: 'remove',
      oldError: error,
      oldElements: <Element[]>this.elements.get(error)
    })));
  }

  /**
   * Registers a binding with the controller.
   * @param binding The binding instance.
   * @param target The DOM element.
   * @param rules (optional) rules associated with the binding. Validator implementation specific.
   */
  registerBinding(binding: Binding, target: Element, rules?: any) {
    this.bindings.set(binding, { target, rules });
  }

  /**
   * Unregisters a binding with the controller.
   * @param binding The binding instance.
   */
  unregisterBinding(binding: Binding) {
    this.resetBinding(binding);
    this.bindings.delete(binding);
  }

  /**
   * Interprets the instruction and returns a predicate that will identify
   * relevant errors in the list of rendered errors.
   */
  private getInstructionPredicate(instruction?: ValidateInstructionBase): (error: ValidationError) => boolean {
    if (instruction) {
      const { object, propertyName } = instruction;
      if (instruction.propertyName) {
        return x => x.object === object && x.propertyName === propertyName;
      } else {
        return x => x.object === object;
      }
    } else {
      return () => true;
    }
  }

  /**
   * Validates and renders errors.
   * @param instruction Optional. Instructions on what to validate. If undefined, all objects and bindings will be validated.
   */
  validate(instruction?: ValidateInstruction): Promise<ValidationError[]> {
    // Get a function that will process the validation instruction.
    let execute: () => Promise<ValidationError[]>;
    if (instruction) {
      const { object, propertyName, rules } = instruction;
      if (instruction.propertyName === undefined) {
        // validate the specified object.
        execute = () => this.validator.validateObject(object, rules);
      } else {
        // validate the specified property.
        execute = () => this.validator.validateProperty(object, propertyName, rules);
      }
    } else {
      // validate all objects and bindings.
      execute = () => {
        const promises: Promise<ValidationError[]>[] = [];
        for (let [object, rules] of Array.from(this.objects)) {
          promises.push(this.validator.validateObject(object, rules));
        }
        for (let [binding, { rules }] of Array.from(this.bindings)) {
          const { object, propertyName } = getPropertyInfo(<Expression>binding.sourceExpression, (<any>binding).source);
          if (this.objects.has(object)) {
            continue;
          }
          promises.push(this.validator.validateProperty(object, propertyName, rules));        
        }
        return Promise.all(promises).then(errorSets => errorSets.reduce((a, b) => a.concat(b), []));
      };
    }

    // Wait for any existing validation to finish, execute the instruction, render the errors.
    this.validating = true;
    let result = this.finishValidating
      .then(execute)
      .then(newErrors => {
        const predicate = this.getInstructionPredicate(instruction);        
        const oldErrors = this.errors.filter(predicate);
        this.processErrorDelta(oldErrors, newErrors);
        if (result === this.finishValidating) {
          this.validating = false;
        }
        return newErrors;   
      })
      .catch(error => {
        // recover, to enable subsequent calls to validate()
        this.validating = false;
        this.finishValidating = Promise.resolve();

        return Promise.reject(error);
      });
    
    this.finishValidating = result;

    return result;
  }

  /**
   * Resets any rendered errors (unrenders).
   * @param instruction Optional. Instructions on what to reset. If unspecified all rendered errors will be unrendered.
   */
  reset(instruction?: ResetInstruction) {    
    const predicate = this.getInstructionPredicate(instruction);        
    const oldErrors = this.errors.filter(predicate);
    this.processErrorDelta(oldErrors, []);    
  }

  /**
   * Gets the elements associated with an object and propertyName (if any).
   */
  private getAssociatedElements({ object, propertyName }: ValidationError): Element[] {
    const elements: Element[] = [];
    for (let [binding, { target }] of Array.from(this.bindings)) {
      const { object: o, propertyName: p } = getPropertyInfo(<Expression>binding.sourceExpression, (<any>binding).source);
      if (o === object && p === propertyName) {
        elements.push(target);
      }
    }
    return elements;
  }

  private processErrorDelta(oldErrors: ValidationError[], newErrors: ValidationError[]) {
    const instructions: RenderInstruction[] = [];

    // create the "add" and "update" instructions.
    for (let newError of newErrors) {
      const newElements = this.getAssociatedElements(newError);

      const oldIndex = oldErrors.findIndex(
        ({ rule, object, propertyName }) => rule === newError.rule
          && object === newError.object
          && propertyName === newError.propertyName);

      const oldError = oldErrors[oldIndex];
      if (oldIndex === -1) {
        instructions.push({ type: 'add', newError, newElements });
        this.errors.push(newError);
        this.elements.set(newError, newElements);
      } else {
        const oldElements = this.elements.get(oldError);
        this.elements.delete(oldError);
        instructions.push(<RenderInstruction>{ type: 'update', newError, newElements, oldError, oldElements }); // casting due to TypeScript bug
        this.errors.splice(this.errors.indexOf(oldError), 1, newError);
        oldErrors.splice(oldIndex, 1);
      }
    }

    // remaining are "delete" instructions.
    for (let oldError of oldErrors) {
      const oldElements = this.elements.get(oldError);
      this.elements.delete(oldError);
      instructions.push(<RenderInstruction>{ type: 'remove', oldError, oldElements }); // casting due to TypeScript bug
      this.errors.splice(this.errors.indexOf(oldError), 1);
    }

    // render the errors.
    for (let renderer of this.renderers) {
      renderer.render(instructions);
    }
  }

  /**
  * Validates the property associated with a binding.
  */
  validateBinding(binding: Binding) {
    const { object, propertyName } = getPropertyInfo(<Expression>binding.sourceExpression, (<any>binding).source);
    const registeredBinding = this.bindings.get(binding);
    const rules = registeredBinding ? registeredBinding.rules : undefined; 
    this.validate({ object, propertyName, rules });
  }

  /**
  * Resets the errors for a property associated with a binding.
  */
  resetBinding(binding: Binding) {
    const { object, propertyName } = getPropertyInfo(<Expression>binding.sourceExpression, (<any>binding).source);
    this.reset({ object, propertyName });
  }
}
