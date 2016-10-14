import { Binding, Expression } from 'aurelia-binding';
import { Validator } from './validator';
import { validateTrigger } from './validate-trigger';
import { getPropertyInfo } from './property-info';
import { ValidationRenderer, RenderInstruction } from './validation-renderer';
import { ValidationError } from './validation-error';

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

  /**
   * The object and property associated with the binding.
   */
  propertyInfo: { object: any; propertyName: string; } | null;
}

export interface ValidateInstruction {
  /**
   * The object to validate.
   */
  object: any;

  /**
   * The property to validate. Optional.
   */
  propertyName?: any;

  /**
   * The rules to validate. Optional.
   */
  rules?: any;
}

/**
 * Orchestrates validation.
 * Manages a set of bindings, renderers and objects.
 * Exposes the current list of validation errors for binding purposes.
 */
export class ValidationController {
  public static inject = [Validator];

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

  /**
   * The trigger that will invoke automatic validation of a property used in a binding.
   */
  public validateTrigger = validateTrigger.blur;

  // Promise that resolves when validation has completed.
  private finishValidating = Promise.resolve();

  constructor(private validator: Validator) { }

  /**
   * Adds an object to the set of objects that should be validated when validate is called.
   * @param object The object.
   * @param rules Optional. The rules. If rules aren't supplied the Validator implementation will lookup the rules.
   */
  public addObject(object: any, rules?: any): void {
    this.objects.set(object, rules);
  }

  /**
   * Removes an object from the set of objects that should be validated when validate is called.
   * @param object The object.
   */
  public removeObject(object: any): void {
    this.objects.delete(object);
    this.processErrorDelta(
      'reset',
      this.errors.filter(error => error.object === object),
      []);
  }

  /**
   * Adds and renders a ValidationError.
   */
  public addError(message: string, object: any, propertyName?: string): ValidationError {
    const error = new ValidationError({}, message, object, propertyName);
    this.processErrorDelta('validate', [], [error]);
    return error;
  }

  /**
   * Removes and unrenders a ValidationError.
   */
  public removeError(error: ValidationError) {
    if (this.errors.indexOf(error) !== -1) {
      this.processErrorDelta('reset', [error], []);
    }
  }

  /**
   * Adds a renderer.
   * @param renderer The renderer.
   */
  public addRenderer(renderer: ValidationRenderer) {
    this.renderers.push(renderer);
    renderer.render({
      kind: 'validate',
      render: this.errors.map(error => ({ error, elements: <Element[]>this.elements.get(error) })),
      unrender: []
    });
  }

  /**
   * Removes a renderer.
   * @param renderer The renderer.
   */
  public removeRenderer(renderer: ValidationRenderer) {
    this.renderers.splice(this.renderers.indexOf(renderer), 1);
    renderer.render({
      kind: 'reset',
      render: [],
      unrender: this.errors.map(error => ({ error, elements: <Element[]>this.elements.get(error) }))
    });
  }

  /**
   * Registers a binding with the controller.
   * @param binding The binding instance.
   * @param target The DOM element.
   * @param rules (optional) rules associated with the binding. Validator implementation specific.
   */
  public registerBinding(binding: Binding, target: Element, rules?: any) {
    this.bindings.set(binding, { target, rules, propertyInfo: null });
  }

  /**
   * Unregisters a binding with the controller.
   * @param binding The binding instance.
   */
  public unregisterBinding(binding: Binding) {
    this.resetBinding(binding);
    this.bindings.delete(binding);
  }

  /**
   * Interprets the instruction and returns a predicate that will identify
   * relevant errors in the list of rendered errors.
   */
  private getInstructionPredicate(instruction?: ValidateInstruction): (error: ValidationError) => boolean {
    if (instruction) {
      const { object, propertyName, rules } = instruction;
      let predicate: (error: ValidationError) => boolean;
      if (instruction.propertyName) {
        predicate = x => x.object === object && x.propertyName === propertyName;
      } else {
        predicate = x => x.object === object;
      }
      if (rules) {
        return x => predicate(x) && this.validator.ruleExists(rules, x.rule);
      }
      return predicate;
    } else {
      return () => true;
    }
  }

  /**
   * Validates and renders errors.
   * @param instruction Optional. Instructions on what to validate. If undefined, all 
   * objects and bindings will be validated.
   */
  public validate(instruction?: ValidateInstruction): Promise<ValidationError[]> {
    // Get a function that will process the validation instruction.
    let execute: () => Promise<ValidationError[]>;
    if (instruction) {
      let { object, propertyName, rules } = instruction;
      // if rules were not specified, check the object map.
      rules = rules || this.objects.get(object);
      // property specified?
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
          const propertyInfo = getPropertyInfo(<Expression>binding.sourceExpression, (<any>binding).source);
          if (!propertyInfo || this.objects.has(propertyInfo.object)) {
            continue;
          }
          promises.push(this.validator.validateProperty(propertyInfo.object, propertyInfo.propertyName, rules));
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
        this.processErrorDelta('validate', oldErrors, newErrors);
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
  public reset(instruction?: ValidateInstruction) {
    const predicate = this.getInstructionPredicate(instruction);
    const oldErrors = this.errors.filter(predicate);
    this.processErrorDelta('reset', oldErrors, []);
  }

  /**
   * Gets the elements associated with an object and propertyName (if any).
   */
  private getAssociatedElements({ object, propertyName }: ValidationError): Element[] {
    const elements: Element[] = [];
    for (let [binding, { target }] of Array.from(this.bindings)) {
      const propertyInfo = getPropertyInfo(<Expression>binding.sourceExpression, (<any>binding).source);
      if (propertyInfo && propertyInfo.object === object && propertyInfo.propertyName === propertyName) {
        elements.push(target);
      }
    }
    return elements;
  }

  private processErrorDelta(kind: 'validate' | 'reset', oldErrors: ValidationError[], newErrors: ValidationError[]) {
    // prepare the instruction.
    const instruction: RenderInstruction = {
      kind,
      render: [],
      unrender: []
    };

    // create a shallow copy of newErrors so we can mutate it without causing side-effects.
    newErrors = newErrors.slice(0);

    // create unrender instructions from the old errors.
    for (let oldError of oldErrors) {
      // get the elements associated with the old error.
      const elements = <Element[]>this.elements.get(oldError);

      // remove the old error from the element map.
      this.elements.delete(oldError);

      // create the unrender instruction.
      instruction.unrender.push({ error: oldError, elements });

      // determine if there's a corresponding new error for the old error we are unrendering.
      const newErrorIndex = newErrors.findIndex(
        x => x.rule === oldError.rule && x.object === oldError.object && x.propertyName === oldError.propertyName);
      if (newErrorIndex === -1) {
        // no corresponding new error... simple remove.
        this.errors.splice(this.errors.indexOf(oldError), 1);
      } else {
        // there is a corresponding new error...        
        const newError = newErrors.splice(newErrorIndex, 1)[0];

        // get the elements that are associated with the new error.
        const elements = this.getAssociatedElements(newError);
        this.elements.set(newError, elements);

        // create a render instruction for the new error.
        instruction.render.push({ error: newError, elements });

        // do an in-place replacement of the old error with the new error.
        // this ensures any repeats bound to this.errors will not thrash.
        this.errors.splice(this.errors.indexOf(oldError), 1, newError);
      }
    }

    // create render instructions from the remaining new errors.
    for (let error of newErrors) {
      const elements = this.getAssociatedElements(error);
      instruction.render.push({ error, elements });
      this.elements.set(error, elements);
      this.errors.push(error);
    }

    // render.
    for (let renderer of this.renderers) {
      renderer.render(instruction);
    }
  }

  /**
   * Validates the property associated with a binding.
   */
  public validateBinding(binding: Binding) {
    if (!binding.isBound) {
      return;
    }
    let propertyInfo = getPropertyInfo(<Expression>binding.sourceExpression, (<any>binding).source);
    let rules = undefined;
    const registeredBinding = this.bindings.get(binding);
    if (registeredBinding) {
      rules = registeredBinding.rules;
      registeredBinding.propertyInfo = propertyInfo;
    }
    if (!propertyInfo) {
      return;
    }
    const { object, propertyName } = propertyInfo;
    this.validate({ object, propertyName, rules });
  }

  /**
   * Resets the errors for a property associated with a binding.
   */
  public resetBinding(binding: Binding) {
    const registeredBinding = this.bindings.get(binding);
    let propertyInfo = getPropertyInfo(<Expression>binding.sourceExpression, (<any>binding).source);
    if (!propertyInfo && registeredBinding) {
      propertyInfo = registeredBinding.propertyInfo;
    }
    if (registeredBinding) {
      registeredBinding.propertyInfo = null;
    }
    if (!propertyInfo) {
      return;
    }
    const { object, propertyName } = propertyInfo;
    this.reset({ object, propertyName });
  }
}
