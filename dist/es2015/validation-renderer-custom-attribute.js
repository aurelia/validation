import { ValidationController } from './validation-controller';
export class ValidationRendererCustomAttribute {
    created(view) {
        this.container = view.container;
    }
    bind() {
        this.controller = this.container.get(ValidationController);
        this.renderer = this.container.get(this.value);
        this.controller.addRenderer(this.renderer);
    }
    unbind() {
        this.controller.removeRenderer(this.renderer);
        this.controller = null;
        this.renderer = null;
    }
}
