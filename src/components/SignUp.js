import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { auth, generateUserDocument } from "../firebase";
import pokeball from '../pokeball.png';

const SignUp = () => {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [error, setError] = useState(null);
    const createUserWithEmailAndPasswordHandler = async (event, email, password) => {
        try{
          const {user} = await auth.createUserWithEmailAndPassword(email, password);
          generateUserDocument(user, {displayName});
          history.push("/login", { messageType: 'success', message: 'Cadastrado com sucesso!',  });
        }
        catch(error){
          setError('Erro ao cadastrar email e senha');
        }
    };

    const onChangeHandler = event => {
        const { name, value } = event.currentTarget;
        if (name === "userEmail") {
        setEmail(value);
        } else if (name === "userPassword") {
        setPassword(value);
        } else if (name === "displayName") {
        setDisplayName(value);
        }
    };

    const onSubmitHandler = (event) => {
        setError(null);
        event.preventDefault();
        createUserWithEmailAndPasswordHandler(event, email, password)
    }

    return (
        <div>
            <img src={pokeball} className="App-logo" alt="logo" />

            {error !== null && (
                <div className="alert alert-danger text-center">
                {error}
                </div>
            )}
            <form onSubmit={event => onSubmitHandler(event)}>
                <h3>Registrar</h3>
                <div className="form-group">
                    <label>Nome</label>
                    <input type="text" value={displayName} name="displayName" id="displayName" className="form-control" onChange={event => onChangeHandler(event)} required/>
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={email} name="userEmail" id="userEmail" className="form-control" onChange={event => onChangeHandler(event)} required />
                </div>

                <div className="form-group">
                    <label>Senha</label>
                    <input minLength="6" type="password" value={password} name="userPassword" id="userPassword" className="form-control" onChange={event => onChangeHandler(event)} required />
                </div>

                <button 
                    type="submit" 
                    className="btn btn-dark btn-block"             
                >
                    Enviar
                </button>

                <p className="forgot-password text-right">
                    <br></br>
                    Já é registrado? <a href="/sign-in">Entrar</a>
                </p>
            </form>
        </div>
    );
}

export default SignUp;