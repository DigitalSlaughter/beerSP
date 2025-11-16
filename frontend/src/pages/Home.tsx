import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">Bienvenido a BeerSp</h1>
        <p>
          Explora cervecerías, comparte degustaciones con tus amigos y consigue galardones.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
