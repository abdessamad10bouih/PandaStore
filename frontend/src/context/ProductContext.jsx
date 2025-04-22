import { createContext, useContext, useState, useEffect } from "react";
import { getAllUsers, getCategories, getFournisseurs, getProduits } from "../lib/api";
import LoadingScreen from "../components/LoadingScreen";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [fournisseurs, setFournisseurs] = useState([])
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoader(true);
            try {
                setIsLoading(true);
                const res = await getProduits();
                setProducts(res.data);
                setLoader(false);
            } catch (error) {
                console.error("Error while fetching products: ", error);
                setError("Failed to fetch products. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        setLoader(true);
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const res = await getCategories();
                setCategories(res.data);
                setLoader(false);
            } catch (error) {
                console.error("Error while fetching products: ", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        setLoader(true);
        const fetchFournisseurs = async () => {
            try {
                setIsLoading(true);
                const res = await getFournisseurs();
                setFournisseurs(res.data.allFournisseurs);
                setLoader(false);
            } catch (error) {
                console.error("Error while fetching fournisseurs: ", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFournisseurs();
    }, []);

    useEffect(() => {
        setLoader(true);
        const fetchFournisseurs = async () => {
            try {
                setIsLoading(true);
                const res = await getAllUsers();
                setUsers(res.data.users);
                setLoader(false);
            } catch (error) {
                console.error("Error while fetching fournisseurs: ", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFournisseurs();
    }, []);



    if (loader) {
        return (<LoadingScreen />);
    }

    return (
        <ProductContext.Provider value={{ products, setProducts, isLoading, error, categories, setCategories, fournisseurs, setFournisseurs, users, setUsers }}>
            {children}
        </ProductContext.Provider>
    );
};


export const useProducts = () => useContext(ProductContext);
