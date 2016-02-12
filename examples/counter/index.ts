import 'reflect-metadata';
import {bootstrap} from 'angular2/platform/browser';
import App from './containers/App';
import {create, RootState} from './store/configureStore';
import {provider} from 'ng2-redux';
const devTools = require('./devTools');
const store = create();


bootstrap(
  App,
  [
    //provider<RootState>(store),
    //devTools
  ]
);
