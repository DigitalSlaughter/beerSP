import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-yellow-600 text-white p-4 flex justify-between">
      <Link to="/home" className="font-bold text-xl">BeerSp</Link>
      <div className="space-x-4">
        <Link to="/degustaciones">Degustaciones</Link>
        <Link to="/galardones">Galardones</Link>
        <Link to="/profile">Perfil</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
