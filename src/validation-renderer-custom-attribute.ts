import {ValidationController} from './validation-controller';
import {ValidationRenderer} from './validation-renderer';

export class ValidationRendererCustomAttribute {
  private container: any;
  private controller: ValidationController;
  private value: string;
  private renderer: ValidationRenderer;

  created(view: any) {
    this.container = view.container;
  }

  bind() {
    this.controller = this.container.get(ValidationController);
    this.renderer = this.container.get(this.value);
    this.controller.addRenderer(this.renderer);
  }

  unbind() {
    this.controller.removeRenderer(this.renderer);
    this.controller = <any>null;
    this.renderer = <any>null;
  }
}
