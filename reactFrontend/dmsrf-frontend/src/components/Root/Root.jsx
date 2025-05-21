import { Outlet } from "react-router";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const Root = () => {
    return (
        <div className="min-h-screen bg-stone-300 ">
            <Navbar />
        <div style={{ marginLeft: "100px" }}>
        <Outlet />
        </div>
            
            <Footer />
        </div>
    );
};

export default Root;