import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AppSideBar from "../components/AppSideBar";
import { Me } from "../lib/api";
import { useAuth } from "../context/useAuth";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const location = useLocation();

    const { user, setUser } = useAuth();

    const handleSidebarChange = (expanded) => {
        setSidebarExpanded(expanded);
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await Me();
                if (userData) {
                    setUser(userData);
                }
            } catch (error) {
                console.error("Error while fetching user data: ", error);
            }
        };

        fetchUser();
    }, []);

    const currentPath = location.pathname.split("/")[1] || "dashboard";
    const activeItem = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);

    return (
        <div className="flex bg-muted overflow-hidden w-full p-2 shadow-md min-h-screen">
            <AppSideBar Active={activeItem} onExpandChange={handleSidebarChange} />
            <main
                className={`flex-1 flex flex-col bg-white transition-all border rounded-md duration-300 ease-in-out ${sidebarExpanded ? "ml-70" : "ml-[107px]"}`}
            >
                <Navbar user={user} />
                <div className="p-4 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;