import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
export const AuthContext = React.createContext();
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
      setPending(false)
    });
  }, []);
  if(pending){
    return (
    <div className="App">
        <div className="spinner-border text-danger" role="status">
            <span className="sr-only">Aguarde...</span>
        </div>
    </div>
  )
  }
  return (
    <AuthContext.Provider
      value={{
        currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
