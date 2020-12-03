import pokeball from './pokeball.png';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Link, Switch, Route } from 'react-router-dom';
import Application from './components/Application';
import Login from './components/Login';
import SignUp from './components/SignUp';
import PasswordReset from './components/PasswordReset';
import Home from './components/Home';

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/login"}>Poke Store</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/login"}>Entrar</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/sign-up"}>Registrar</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="auth-wrapper">
        <div className="auth-inner">
        <img src={pokeball} className="App-logo" alt="logo" />
        <Switch>
          <Route exact path='/' component={Application} />
          <Route path="/login" component={Login} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/forget-password" component={PasswordReset} />
          <Route path="/home" component={Home} />
        </Switch>
        </div>
      </div>
    </div>  
  );
}

export default App;
