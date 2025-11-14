// src/pages/Register.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register: React.FC = () => {
  const navigate = useNavigate();

  // Estados
  const [step, setStep] = useState<1 | 2>(1); // 1=edad, 2=registro
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState(""); // Para mensajes informativos

  // Función para calcular edad
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

  // Paso 1: comprobación de edad
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

  // Paso 2: registro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/api/usuarios", {
        nombre_usuario: nombre,
        correo: email,
        fecha_nacimiento: fechaNacimiento,
        contraseña: password
      });

      console.log("Respuesta de la API:", response.data);
      setInfo(
        "Registro exitoso. Por favor revisa tu correo para verificar tu cuenta antes de iniciar sesión."
      );

      // Limpiar campos opcionalmente
      setNombre("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setStep(1); // Volver a paso inicial si quieres

    } catch (err: any) {
      console.error("❌ Error completo:", err);
      console.error("❌ Respuesta del servidor:", err.response);
      setError(err.response?.data?.message || "Error al registrar usuario");
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
            onChange={e => setFechaNacimiento(e.target.value)}
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
            onChange={e => setNombre(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500"
          >
            Registrarse
          </button>
        </form>
      )}

      <p className="mt-4">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-yellow-600">Inicia sesión</Link>
      </p>
    </div>
  );
};

export default Register;
