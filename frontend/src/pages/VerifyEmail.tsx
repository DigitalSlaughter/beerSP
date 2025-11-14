// src/pages/VerifyEmail.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const VerifyEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/usuarios/verify/${token}`);
        setStatus("success");
        setMessage(res.data.message || "Cuenta verificada correctamente. Ya puedes iniciar sesión.");
      } catch (err: any) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Error al verificar la cuenta.");
      }
    };

    if (token) {
      verifyAccount();
    } else {
      setStatus("error");
      setMessage("Token de verificación no proporcionado.");
    }
  }, [token]);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow text-center">
      {status === "loading" && <p>Verificando tu cuenta...</p>}
      {status === "success" && (
        <>
          <p className="text-green-600 mb-4">{message}</p>
          <Link to="/login" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500">
            Ir a Login
          </Link>
        </>
      )}
      {status === "error" && (
        <>
          <p className="text-red-600 mb-4">{message}</p>
          <Link to="/register" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500">
            Volver a Registrarse
          </Link>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
