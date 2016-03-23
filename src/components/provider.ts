import Connector from './connector';
import {provide, Injector, Provider} from 'angular2/core';
import ObservableStore from './observable-store';
import * as Redux from 'redux';

interface IConnect {
  (mapStateToTarget: Function, mapDispatchToTarget: Function);
}

interface INgRedux<T> extends Redux.Store<T> {
  connect: IConnect;
}

export function provider<T>(store: Redux.Store<T>) {
  const _connector = new Connector(store);
  const _observableStore = new ObservableStore(store);
  const factory = (): INgRedux<T> => {
    return <INgRedux<T>>{
      connect: _connector.connect,
      dispatch: _observableStore.dispatch,
      select: _observableStore.select,
      subscribe: store.subscribe,
      getState: store.getState,
      replaceReducer: store.replaceReducer
    };
  };

  return provide('ngRedux', { useFactory: factory });
}


/*
 const createStoreWithMiddleware 
  = applyInjectableMiddleware(thunk, 'promise')(createStore);
*/
/*
export function applyInjectableMiddleware(middlewares) {
    const injector = new Injector();
    let resolvedMiddlewares = [];
    _.forEach(middlewares, middleware => {
        _.isString(middleware)
            ? resolvedMiddlewares.push(Injector.resolve(middleware))
            : resolvedMiddlewares.push(middleware)
    });

    return redux.applyMiddleware(...resolvedMiddlewares);
}
*/
