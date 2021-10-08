import Home from './pages/Home';
import Profile from './pages/Profile';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import React, { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Web from './pages/Web';
import Messenger from './pages/Messenger';

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          {user ? <Home /> : <SignIn />}
        </Route>
        <Route path='/login'>{user ? <Redirect to='/' /> : <SignIn />}</Route>
        <Route path='/signup'>
          <SignUp />
        </Route>
        <Route exact path='/Profile/Web'>
          {user ? <Web /> : <Redirect to='/login' />}
        </Route>
        <Route path='/Profile/:username'>
          {user ? <Profile /> : <Redirect to='/login' />}
        </Route>
        <Route path='/messenger'>
          {user ? <Messenger /> : <Redirect to='/login' />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
