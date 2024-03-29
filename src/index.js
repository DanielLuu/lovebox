import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import App from './App'
import { Event, Admin, Login, Create, Profile } from './Views'
import Home from './Views/Home'

import registerServiceWorker from './registerServiceWorker'
import './index.css'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'

import configureStore from './configureStore'
const store = configureStore()
require('flexboxgrid/css/flexboxgrid.min.css')
injectTapEventPlugin()

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <BrowserRouter>
        <div>
          <App />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/create' component={Create} />
            <Route path='/login' component={Login} />
            <Route path='/profile' component={Profile} />
            <Route path='/event/:event/admin' component={Admin} />
            <Route path='/event/:event' component={Event} />
          </Switch>
        </div>
      </BrowserRouter>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
