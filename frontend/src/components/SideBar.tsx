import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Beer, Award, User, LogOut, Search, Users } from "lucide-react";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [query, setQuery] = useState("");

  const linkClasses = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      location.pathname === path
        ? "bg-yellow-600 text-white shadow"
        : "text-gray-700 hover:bg-yellow-100"
    }`;

  const handleSearch = () => {
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <aside className="w-72 h-screen bg-white border-r shadow-lg fixed left-0 top-0 flex flex-col p-4 gap-6">

      {/* LOGO */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          🍺
        </div>
        <div>
          <h1 className="text-xl font-bold text-yellow-700">BeerSp</h1>
          <p className="text-xs text-gray-500">Red social cervecera</p>
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="px-2">
        <label className="text-xs text-gray-500">Buscar</label>
        <div className="mt-1 flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar cervezas, locales..."
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <button
            onClick={handleSearch}
            className="p-2 bg-yellow-600 text-white rounded hover:bg-yellow-500"
            title="Buscar"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* MENÚ */}
      <nav className="flex flex-col gap-2">
        <Link to="/home" className={linkClasses("/home")}>
          <Beer size={20} />
          Inicio
        </Link>

        <Link to="/degustaciones" className={linkClasses("/degustaciones")}>
          ⭐ Degustaciones más valoradas
        </Link>

        <Link to="/profile" className={linkClasses("/profile")}>
          <User size={20} />
          Mi perfil
        </Link>

        <Link to="/galardones" className={linkClasses("/galardones")}>
          <Award size={20} />
          Galardones
        </Link>

        {/* NUEVO ENLACE AMIGOS */}
        <Link to="/amigos" className={linkClasses("/amigos")}>
          <Users size={20} />
          Amigos
        </Link>
      </nav>

      {/* BOTÓN CERRAR SESIÓN */}
      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-100 transition font-medium text-left"
      >
        <LogOut size={20} />
        Cerrar sesión
      </button>

    </aside>
  );
};

export default Sidebar;
