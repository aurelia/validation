import {StageComponent, ComponentTester} from 'aurelia-testing';
import {Aurelia} from 'aurelia-framework';
import {bootstrap} from 'aurelia-bootstrapper';
import {Rules, ValidationRules} from '../src/aurelia-validation';

function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin('dist/test/src/aurelia-validation')
    .feature('./dist/test/test/resources');
}

describe('end to end', () => {
  it('decorators', (done: () => void) => {
    const component: ComponentTester = StageComponent
      .withResources()
      .boundTo({});
    component.bootstrap(configure);
    
    (<Promise<any>>component.create(<any>bootstrap))
      .then(() => {
        @ValidationRules.ensureObject().satisfies(()=>true).withMessage('123').decorate()
        class TestClass
        {
            @ValidationRules.ensureProperty().displayName('prop345').email().decorate()
            property1: string;
            property2: string;
            
            property3: boolean;

            
            get property4()
            {
              return "_value_";
            }
        }

        var obj = new TestClass();
        var rules = Rules.get(obj);
        
        rules.forEach((element, index) => {
          console.log(index);
          console.log(JSON.stringify(element));
        });

      })
      .then(() => component.dispose())
      .then(done);
  });
});
