// src/pages/Register.tsx
import React, { useState, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register: React.FC = () => {
  const navigate = useNavigate();

  // Estados
  const [step, setStep] = useState<1 | 2>(1);
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [nombre, setNombre] = useState("");
  const [nombreReal, setNombreReal] = useState(""); // <-- Nuevo campo opcional
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [introduccion, setIntroduccion] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [showOpcionales, setShowOpcionales] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [showResend, setShowResend] = useState(false);

  const calcularEdad = (fecha: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const handleCheckAge = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const edad = calcularEdad(fechaNacimiento);
    if (edad < 18) {
      setError("Debes ser mayor de 18 años para registrarte.");
      return;
    }
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setShowResend(false);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nombre_usuario", nombre);
      formData.append("correo", email);
      formData.append("password", password);

      // Campos opcionales
      if (nombreReal) formData.append("nombre", nombreReal); 
      if (apellidos) formData.append("apellidos", apellidos);
      if (ubicacion) formData.append("ubicacion", ubicacion);
      if (introduccion) formData.append("texto_introduccion", introduccion);
      if (foto) formData.append("foto", foto);

      const response = await axios.post(
        "http://localhost:4000/api/usuarios",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setInfo(
        "Registro exitoso. Te hemos enviado un correo de verificación. Revisa tu bandeja de entrada."
      );
      setShowResend(true);

      // Limpiar formulario
      setNombre("");
      setNombreReal("");
      setApellidos("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUbicacion("");
      setIntroduccion("");
      setFoto(null);

    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.response?.data?.message || "Error al registrar usuario");

      if (
        err.response?.data?.message?.toLowerCase().includes("verificar") ||
        err.response?.data?.message?.toLowerCase().includes("no verificada")
      ) {
        setShowResend(true);
      }
    }
  };

  const handleResendVerification = async () => {
    setError("");
    setInfo("");

    if (!email) {
      setError("Introduce un correo para reenviar el mensaje.");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/usuarios/verify/resend", { correo: email });
      setInfo("Correo de verificación reenviado. Revisa tu bandeja.");
    } catch (err: any) {
      console.error("❌ Error al reenviar:", err);
      setError(err.response?.data?.message || "No se pudo reenviar el correo.");
    }
  };

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFoto(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>
      {error && <p className="text-red-500">{error}</p>}
      {info && <p className="text-green-500">{info}</p>}

      {step === 1 && (
        <form onSubmit={handleCheckAge} className="flex flex-col gap-4">
          <input
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500"
          >
            Comprobar edad
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <button
            type="button"
            onClick={() => setShowOpcionales(!showOpcionales)}
            className="text-sm text-blue-600 underline mb-2"
          >
            {showOpcionales ? "Ocultar campos opcionales" : "Mostrar campos opcionales"}
          </button>

          {showOpcionales && (
            <>
              <input
                type="text"
                placeholder="Nombre real (opcional)"
                value={nombreReal}
                onChange={(e) => setNombreReal(e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Apellidos (opcional)"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Ubicación (opcional)"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                className="border p-2 rounded"
              />
              <textarea
                placeholder="Texto de introducción (opcional)"
                value={introduccion}
                onChange={(e) => setIntroduccion(e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="border p-2 rounded"
              />
            </>
          )}

          <button
            type="submit"
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500"
          >
            Registrarse
          </button>
        </form>
      )}

      {showResend && (
        <button
          onClick={handleResendVerification}
          className="mt-3 text-sm text-blue-600 underline"
        >
          Reenviar correo de verificación
        </button>
      )}

      <p className="mt-4">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-yellow-600">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
};

export default Register;
