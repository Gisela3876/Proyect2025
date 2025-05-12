import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import LoginForm from "../components/LoginForm";
import { appfirebase } from "../assets/database/firebaseconfig.jsx";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../assets/database/authcontext";
import CuadroBusquedas from "../components/Busquedas/CuadroBusquedas";

import "../App.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const auth = getAuth(appfirebase);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuario autenticado:", userCredential.user);
      // Guardar las credenciales en localStorage
      localStorage.setItem("adminEmail", email);
      localStorage.setItem("adminPassword", password);
      // Redirigir después de iniciar sesión
      navigate("/inicio");
    } catch (error) {
      setError("Error de autenticación. Verifica tus credenciales.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Si el usuario ya está autenticado, redirigir automáticamente
  if (user) {
    navigate("/inicio");
  }

  return (
    <Container className="d-flex vh-100 justify-content-center align-items-center flex-column">
      <LoginForm
        email={email}
        password={password}
        error={error}
        setEmail={setEmail}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default Login;