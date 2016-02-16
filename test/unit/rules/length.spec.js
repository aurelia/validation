// import {length} from 'src/rules/length';

// describe('length rule', () => {
//   let subject;

//   beforeEach(() => {
//     class TestModel {
//       @length({ maximum: 6 }) name = 'Sunny';
//       setName(value) {
//         this.name = value;
//       }
//     }
//     subject = new TestModel();
//   });

//   describe('.initializeValidation', () => {
//     it('should add empty validationMessages array', done => {
//       let badString = 'Moony';
//       subject.name = badString;
//       expect(subject.name).toEqual(badString);
//       done();
//     });
//   });
// });
