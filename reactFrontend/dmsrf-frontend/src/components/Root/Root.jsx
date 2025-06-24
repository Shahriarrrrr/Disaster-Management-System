import { Outlet } from "react-router";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const Root = () => {
  return (
<div className="layout flex flex-col min-h-screen bg-[#222831]">
      <header className="layout-navbar">
        <Navbar />
      </header>

      <main className="layout-content flex-grow">
        <Outlet />
      </main>

      <footer className="layout-footer ">
        <Footer />
      </footer>
    </div>
  );
};

export default Root;
