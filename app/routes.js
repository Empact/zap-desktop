/* eslint flowtype-errors/show-errors: 0 */
import React from 'react'
import { Switch, Route } from 'react-router'
import App from './routes/app'
import Activity from './routes/activity'
import Wallet from './routes/wallet'
import Network from './routes/network'

export default () => (
  <App>
    <Switch>
      <Route path='/network' component={Network} />
      <Route path='/wallet' component={Wallet} />
      <Route path='/' component={Activity} />
    </Switch>
  </App>
);
