
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './components/home';
import Login from './components/login';
import Test from './components/test';
import CarUpload from './components/carUpload';
import AppHome from './components/AppHome';
import './App.css';

function App() {
  return (
    <Router>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/">
            <AppHome />
          </Route>
          <Route basename="/login" path="/login">
            <Login />
          </Route>
          <Route basename="/home" path="/home">
            <Home />
          </Route>
          <Route basename="/test" path="/test">
            <Test />
          </Route>
          <Route basename="/car" path="/car">
            <CarUpload />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
