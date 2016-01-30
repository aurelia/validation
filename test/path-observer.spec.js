import {ObserverLocator} from 'aurelia-binding';
import {PathObserver} from '../src/path-observer';
import {Container} from 'aurelia-dependency-injection';

describe('PathObserver tests', () => {
  let container;
  let observerLocator;

  beforeEach(() => {
    container = new Container();
    observerLocator = container.get(ObserverLocator);
  });

  it('should be able to track a path (2 parts)', (done) => {
    var subject = {
      company: {
        responsible: {
          email: 'bob@thebuilder.com'
        }
      }
    };
    var pathObserver = new PathObserver(observerLocator, subject, 'company.responsible.email');
    expect(pathObserver.getValue()).toBe('bob@thebuilder.com');

    subject.company.responsible.email = 'bob2';
    setTimeout(() => {
      expect(pathObserver.getValue()).toBe('bob2');

      subject.company.responsible = null;
      setTimeout(() => {
        expect(pathObserver.getValue()).toBe(undefined);

        subject.company = {
          responsible: {
            email: 'bob3'
          }
        };
        setTimeout(() => {
          expect(pathObserver.getValue()).toBe('bob3');
          done();
        });
      });

    });

  });


  it('should be able to track a path (3 parts)', (done) => {
    var subject = {
      company: {
        responsible: {
          email: 'bob@thebuilder.com'
        }
      }
    };
    var pathObserver = new PathObserver(observerLocator, subject, 'company.responsible.email');
    expect(pathObserver.getValue()).toBe('bob@thebuilder.com');

    subject.company.responsible.email = 'bob2';
    setTimeout(() => {
      expect(pathObserver.getValue()).toBe('bob2');

      subject.company = null;
      setTimeout(() => {
        expect(pathObserver.getValue()).toBe(undefined);

        subject.company = {
          responsible: {
            email: 'bob3'
          }
        };
        setTimeout(() => {
          expect(pathObserver.getValue()).toBe('bob3');
          done();
        });
      });

    });

  });

});
