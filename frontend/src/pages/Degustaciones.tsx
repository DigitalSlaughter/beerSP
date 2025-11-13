import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Degustaciones = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Degustaciones</h1>
        <p>Listado de degustaciones, filtrado por estilos y país.</p>
      </main>
      <Footer />
    </div>
  );
};

export default Degustaciones;
