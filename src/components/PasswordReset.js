import React, { useState } from "react";

const PasswordReset = () => {
    const [email, setEmail] = useState("");
    const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
    const [error, setError] = useState(null);
    const onChangeHandler = event => {
      const { name, value } = event.currentTarget;
      if (name === "userEmail") {
        setEmail(value);
      }
    };
    const sendResetEmail = event => {
      event.preventDefault();
    };
    return (
      <div>
      {emailHasBeenSent && (
              <div className="py-3 bg-green-400 w-full text-white text-center mb-3">
                O email foi enviado com sucesso!
              </div>
            )}
            {error !== null && (
              <div className="py-3 bg-red-600 w-full text-white text-center mb-3">
                {error}
              </div>
            )}
      <form>
          <h3>Redefinir Senha</h3>
  
          <div className="form-group">
              <label>Email</label>
              <input
              type="email"
              name="userEmail"
              id="userEmail"
              value={email}
              onChange={onChangeHandler}
              className="form-control"
            />
          </div>
  
  
          <button 
              type="submit" 
              className="btn btn-dark btn-block"             
              onClick={event => { sendResetEmail(event, email);}}
          >
              Enviar um link de redefinição de senha
          </button>
  
      </form>
    </div>
    );
};

export default PasswordReset;