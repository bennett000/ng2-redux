import shallowEqual from '../utils/shallowEqual';
import wrapActionCreators from '../utils/wrapActionCreators';
import * as Redux from 'redux';
import * as invariant from 'invariant';
import * as _ from 'lodash';

export default class Connector<RootState> {
  private _store: Redux.Store<RootState>;
  private _defaultMapStateToTarget: Function;
  private _defaultMapDispatchToTarget: Function;

  constructor(store: Redux.Store<RootState>) {
    this._store = store;
    this._defaultMapStateToTarget = () => ({});
    this._defaultMapDispatchToTarget = dispatch => ({ dispatch });
  }

  connect = (mapStateToTarget, mapDispatchToTarget) => {

    const finalMapStateToTarget =
      mapStateToTarget || this._defaultMapStateToTarget;

    const finalMapDispatchToTarget = _.isPlainObject(mapDispatchToTarget) ?
      wrapActionCreators(mapDispatchToTarget) :
      mapDispatchToTarget || this._defaultMapDispatchToTarget;

    invariant(
      _.isFunction(finalMapStateToTarget),
      ERROR_MUST_BE_FUNCTION,
      finalMapStateToTarget
    );

    invariant(
      _.isPlainObject(finalMapDispatchToTarget) || 
        _.isFunction(finalMapDispatchToTarget),
      ERROR_MUST_BE_PLAIN_OBJECT, finalMapDispatchToTarget
      );

    let slice =
      this.getStateSlice(this._store.getState(), finalMapStateToTarget);

    const boundActionCreators = finalMapDispatchToTarget(this._store.dispatch);

    return (target) => {

      invariant(
        _.isFunction(target) || _.isObject(target), 
        ERROR_FUNCTION_OR_OBJECT
      );

      // Initial update
      this.updateTarget(target, slice, boundActionCreators);

      const unsubscribe = this._store.subscribe(() => {
        const nextSlice =
          this.getStateSlice(this._store.getState(), finalMapStateToTarget);
        if (!shallowEqual(slice, nextSlice)) {
          slice = nextSlice;
          this.updateTarget(target, slice, boundActionCreators);
        }
      });
      return unsubscribe;
    };

  };


  updateTarget(target, StateSlice, dispatch) {
    if (_.isFunction(target)) {
      target(StateSlice, dispatch);
    } else {
      _.assign(target, StateSlice, dispatch);
    }
  }

  getStateSlice(state, mapStateToScope) {
    const slice = mapStateToScope(state);

    invariant(
      _.isPlainObject(slice),
      ERROR_MUST_RETURN_OBJECT,
      slice
      );

    return slice;
  }

}

const ERROR_MUST_BE_FUNCTION = 
  'mapStateToTarget must be a Function. Instead received $s.';

const ERROR_MUST_BE_PLAIN_OBJECT =
  'mapDispatchToTarget must be a plain Object or a Function.' +
  'Instead received $s.';

const ERROR_FUNCTION_OR_OBJECT =
  'The target parameter passed to connect must be a Function ' + 
  'or a plain object.';

const ERROR_MUST_RETURN_OBJECT = 
  '`mapStateToScope` must return an object. Instead received %s.';
