import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom'
import App from './App';
import { Event, Admin, Login } from './Views';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import configureStore from './configureStore'
const store = configureStore();
require('flexboxgrid/css/flexboxgrid.min.css');
injectTapEventPlugin();

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <BrowserRouter>
        <div>
          <Route path='/' component={App}/>
          <Route path='/login' component={Login}/>
          <Route path='/event/:event/admin' component={Admin} />
          <Route path='/event/:event' component={Event} />
        </div>
      </BrowserRouter>
    </MuiThemeProvider>
  </Provider>
  , document.getElementById('root'));
registerServiceWorker();
