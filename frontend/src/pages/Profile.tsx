import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Profile = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>
        <p>Aquí se mostrará la información de usuario y estadísticas.</p>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
