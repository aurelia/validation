import {Expression} from 'aurelia-binding';
import {ValidationParser} from './validation-parser';

export interface ValidationMessages {
  [key: string]: string;
}

export const validationMessages: ValidationMessages = {
  default: `\${$displayName} is invalid.`,
  required: `\${$displayName} is required.`,
  matches: `\${$displayName} is not correctly formatted.`,
  email: `\${$displayName} is not a valid email.`,
  minLength: `\${$displayName} must be at least \${$config.length} character\${$config.length === 1 ? '' : 's'}.`,
  maxLength: `\${$displayName} cannot be longer than \${$config.length} character\${$config.length === 1 ? '' : 's'}.`,
  minItems: `\${$displayName} must contain at least \${$config.count} item\${$config.count === 1 ? '' : 's'}.`,
  maxItems: `\${$displayName} cannot contain more than \${$config.count} item\${$config.count === 1 ? '' : 's'}.`,
}

export class ValidationMessageProvider {
  static inject = [ValidationParser];

  constructor(private parser: ValidationParser) {}

  /**
   * Returns a message binding expression that corresponds to the key.
   * @param key The message key.
   */
  getMessage(key: string): Expression {
    let message: string;
    if (key in validationMessages) {
      message = validationMessages[key];
    } else {
      message = validationMessages['default'];
    }
    return this.parser.parseMessage(message);
  }

  /**
   * When a display name is not provided, this method is used to formulate
   * a display name using the property name.
   * Override this with your own custom logic.
   * @param propertyName The property name.
   */
  computeDisplayName(propertyName: string): string {
    // split on upper-case letters.
    const words = propertyName.split(/(?=[A-Z])/).join(' ');
    // capitalize first letter.
    return words.charAt(0).toUpperCase() + words.slice(1);
  }
}
