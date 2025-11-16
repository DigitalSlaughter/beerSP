import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Galardones = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Galardones</h1>
        <p>Listado de galardones obtenidos por el usuario y sus niveles.</p>
      </main>
      <Footer />
    </div>
  );
};

export default Galardones;
