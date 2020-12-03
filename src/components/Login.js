import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../firebase";

const Login = () => {
    const location = useLocation();
    const [message, setMessage] = useState('');
    useEffect(() => {  
        if (typeof(location.state) !== 'undefined') {
            setMessage(location.state.message);
            location.state = undefined;
        }
    });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const signInWithEmailAndPasswordHandler = (email, password) => {
        auth.signInWithEmailAndPassword(email, password).catch(error => {
            setError("Erro ao entrar com email e senha!");
            console.error("Error signing in with password and email", error);
            });
    };

    const onChangeHandler = (event) => {
        const {name, value} = event.currentTarget;

        if(name === 'userEmail') {
            setEmail(value);
        }
        else if(name === 'userPassword'){
            setPassword(value);
        }
    };

    const onSubmitHandler = (event) => {
        setMessage('');
        setError(null);
        event.preventDefault();
        signInWithEmailAndPasswordHandler(email, password)
    }

    return (
        <div>
            {message !== '' && (
                <div className="alert alert-success text-center">
                  {message}
                </div>
            )}
            {error !== null && (
                <div className="alert alert-danger text-center">
                  {error}
                </div>
            )}
            <form onSubmit={event => onSubmitHandler(event)}>
                <h3>Entrar</h3>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={email} name="userEmail" id="userEmail" className="form-control" onChange={event => onChangeHandler(event)} required />
                </div>

                <div className="form-group">
                    <label>Senha</label>
                    <input type="password" value={password} name="userPassword" id="userPassword" className="form-control" onChange={event => onChangeHandler(event)} required />
                </div>

                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Manter conectado </label>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="btn btn-dark btn-block" 
                >
                    Entrar
                </button>

                <p className="forgot-password text-right">
                    <br></br>
                    <Link to="/forget-password">Esqueceu a senha?</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;