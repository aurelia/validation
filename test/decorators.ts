import {StageComponent, ComponentTester} from 'aurelia-testing';
import {Aurelia} from 'aurelia-framework';
import {bootstrap} from 'aurelia-bootstrapper';
import {Rules, email, minLength, equals, satisfies} from '../src/aurelia-validation';

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
        @satisfies((o:TestClass)=>o.property4=="_value_")
        class TestClass
        {
            @email(c=>c.withMessageKey('_email'))
            property1: string;
            @minLength(6, c=>c.withMessage("Must be min 6 symbols"))
            property2: string;
            @equals('password', c=>c.when((o:TestClass)=>o.property1 == "pro@kr.nt"))
            @satisfies(()=>true)
            property3: boolean;

            @equals("_value_")
            get property4()
            {
              return "_value_";
            }
        }

        var obj = new TestClass();
        var rules = Rules.get(obj);
        
        expect(rules.length).toEqual(6);
        expect(rules[0].property.name).toEqual('property1');
        expect(rules[0].messageKey).toEqual('_email');
        expect(rules[1].message.value).toEqual("Must be min 6 symbols");
        expect(rules[3].when).not.toBeNull();
        expect(rules[3].messageKey).toEqual("equals");
        expect(rules[4].messageKey).toEqual("equals");
        
        rules.forEach((element, index) => {
          console.log(index);
          console.log(JSON.stringify(element));
        });

      })
      .then(() => component.dispose())
      .then(done);
  });
});
