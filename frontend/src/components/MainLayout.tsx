import React from "react";
import Sidebar from "../components/SideBar";
import Footer from "../components/Footer";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (<div className="flex min-h-screen"> <Sidebar />
        <main className="flex-1 ml-72 flex flex-col min-h-screen bg-gray-100">
            {/* Contenido crece para empujar el footer abajo */}
            <div className="flex-1 p-6">{children}</div>
            <Footer />
        </main>
    </div>
    );
};

export default MainLayout;
