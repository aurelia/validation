import {Validation} from '../validation/validation';

export class Debouncer{
  constructor(debounceTimeout){
    this.currentFunction = null;
    this.debounceTimeout = debounceTimeout;
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
    }, this.debounceTimeout);
  }
}
