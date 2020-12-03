import pokeball from './pokeball.png';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Link, Switch, Route } from 'react-router-dom';
import Application from './components/Application';
import Login from './components/Login';
import SignUp from './components/SignUp';
import PasswordReset from './components/PasswordReset';
import Home from './components/Home';
import PrivateRoute from './PrivateRoute';
import { useContext } from 'react';
import { AuthContext } from './provider/AuthProvider';
import { auth } from './firebase';
import AuthRoute from './AuthRoute';

function App() {
  const {currentUser} = useContext(AuthContext);

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/login"}>Poke Store</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            {!currentUser ? (<ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/login"}>Entrar</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/sign-up"}>Registrar</Link>
              </li>
            </ul>) : (
              <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/"} onClick={() => auth.signOut()} >Sair</Link>
              </li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      <div className="auth-wrapper">
        <div className="auth-inner">
        <img src={pokeball} className="App-logo" alt="logo" />
        <Switch>
          <AuthRoute exact path='/' component={Login} />
          <AuthRoute path="/login" component={Login} />
          <AuthRoute path="/sign-up" component={SignUp} />
          <AuthRoute path="/forget-password" component={PasswordReset} />
          <PrivateRoute exact path="/home" component={Home} />
        </Switch>
        </div>
      </div>
    </div>  
  );
}

export default App;
