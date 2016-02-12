import 'reflect-metadata';
import * as ConnectorClass from '../components/connector';
import {Inject} from 'angular2/core';

const isFn = (f) => typeof f === 'function';

export interface ConnectorParams {
  mapState?: Function;
  mapDispatch?: Function;
}

export const Connector = (params:ConnectorParams) => {
  params.mapState = isFn(params.mapState) ? params.mapState : (s) => s;
  params.mapDispatch = isFn(params.mapDispatch) ? params.mapDispatch: (d) => d;
  return (target: Function) => {
    // save a reference to the original constructor
    const original = target;

    // a utility function to generate instances of a class
    function construct(constructor, args) {
      var c : any = () => constructor.apply(this, args);

      c.prototype = constructor.prototype;
      return new c();
    }

    // the new constructor behaviour
    var f : any = (...args) => {
      const i = construct(original, args);
      const oldDestroy = i.ngOnDestroy;
      //const ngRedux = Inject('ngRedux');

      //let destroy = ngRedux.connect(params.mapState, params.mapDispatch)(i);

      let destroy = () => console.log('d');

      // wrap ngOnDestroy to clean up
      i.ngOnDestroy = (...args: any[]) => {
        if (isFn(destroy)) {
          destroy();
        }
        if (isFn(oldDestroy)) {
          oldDestroy.apply(i, args);
        }
      };

      return i;
    };

    // copy prototype so intanceof operator still works
    f.prototype = original.prototype;

    // return new constructor (will override original)
    return f;
  };
};