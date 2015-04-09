import {Validation} from '../validation/validation';

export class Debouncer{
  constructor(){
    this.currentFunction = null;
  }

  debounce(func)
  {
    this.currentFunction = func;
    setTimeout(() => {
        if(func !== null && func !== undefined)
        {
          if(func === this.currentFunction) {
            this.currentFunction = null;
            func();
          }
        }
    }, Validation.debounceTime);
  }
}
