import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Link, Switch, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import PasswordReset from './components/PasswordReset';
import Home from './components/Home';
import PrivateRoute from './PrivateRoute';
import { useContext, useState } from 'react';
import { AuthContext } from './provider/AuthProvider';
import { auth } from './firebase';
import AuthRoute from './AuthRoute';
import Listas from './components/Listas';

function App() {
  const {currentUser} = useContext(AuthContext);
  const [menu, setMenu] = useState(false);

  const toggleMenu = () =>{
    setMenu(!menu);
  }

  const show = menu ? "show" : "" ;

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark navbar-static-top">
        <div className="container">
          <Link className="navbar-brand" to={currentUser ? "/home" : "/login"}>Poke Store</Link>
          <button className="navbar-toggler" type="button" onClick={toggleMenu}>
        <span className="navbar-toggler-icon"></span>
        </button>
          <div className={"collapse navbar-collapse " + show } id="navbarTogglerDemo02">
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
                  <Link className="nav-link" to={"/listas"}>Minhas Listas</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/"} onClick={() => auth.signOut()} >Sair</Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      <div className="auth-wrapper">
        <div className="auth-inner" style={{width: currentUser ? '1000px' : ''}}>
        <Switch>
          <AuthRoute exact path='/' component={Login} />
          <AuthRoute path="/login" component={Login} />
          <AuthRoute path="/sign-up" component={SignUp} />
          <AuthRoute path="/forget-password" component={PasswordReset} />
          <PrivateRoute exact path="/home" component={Home} />
          <PrivateRoute exact path="/listas" component={Listas} />
        </Switch>
        </div>
      </div>
    </div>  
  );
}

export default App;
