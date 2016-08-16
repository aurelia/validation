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
  maxLength: `\${$displayName} must contain at least \${$config.count} item\${$config.length === 1 ? '' : 's'}.`,
  minItems: `\${$displayName} must contain at least \${$config.count} item\${$config.count === 1 ? '' : 's'}.`,
  maxItems: `\${$displayName} cannot contain more than \${$config.count} item\${$config.count === 1 ? '' : 's'}.`,
}

export class ValidationMessageProvider {
  static inject = [ValidationParser];

  constructor(private parser: ValidationParser) {}

  getMessage(key: string): Expression {
    let message: string;
    if (key in validationMessages) {
      message = validationMessages[key];
    } else {
      message = validationMessages['default'];
    }
    return this.parser.parseMessage(message);
  }
}
