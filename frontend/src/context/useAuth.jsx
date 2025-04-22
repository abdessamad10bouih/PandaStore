import { createContext, useContext, useState, useEffect } from "react";
import { Me } from "../lib/api";
import LoadingScreen from "../components/LoadingScreen";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        setLoader(true);
        const fetchUser = async () => {
            try {
                const userData = await Me();
                if (userData) {
                    setUser(userData);
                }
                setLoader(false);
            } catch (error) {
                console.error("Error while fetching user data: ", error);
            }
        };

        fetchUser();
    }, []);

    // console.log("user :", user)
    // console.log("token :", token)
    const logout = async () => {
        setLoader(true);
        try {
            // Perform logout logic here (e.g., API call, clearing tokens, etc.)
            // For example, if you have a logout API endpoint:
            // await logoutAPI();
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error("Error during logout: ", error);
        } finally {
            setLoader(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, loading, token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
