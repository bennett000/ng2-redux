import {Component, Inject, OnDestroy} from 'angular2/core';
import * as Redux from 'redux';
const {bindActionCreators} = Redux;
import {Counter} from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import {RootState} from '../store/configureStore';
import {Connector} from 'ng2-redux';

@Component({
  selector: 'root',
  directives: [Counter],
  template: `
  <counter [counter]="counter"
    [increment]="increment"
    [decrement]="decrement"
    [incrementIfOdd]="incrementIfOdd"
    [incrementAsync]="incrementAsync">
  </counter>
  `
})
//@Connector({
//  mapState: (state) => {
//    return {
//      counter: state.counter
//    };
//  },
//  mapDispatch: (dispatch) => {
//    return bindActionCreators<any,
//      CounterActions.ICounterDispatch>(CounterActions, dispatch);
//  }
//})
export default class App implements OnDestroy {

  protected unsubscribe: Function;

  constructor () {
  //constructor( @Inject('ngRedux') ngRedux, @Inject('devTools') devTools) {
    //devTools.start(ngRedux);
  }
  ngOnDestroy() {
    console.log('App: on destroy');
  }
}
