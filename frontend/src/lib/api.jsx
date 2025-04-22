import { useProducts } from '../context/ProductContext';
import axios from 'axios';

const apiInstance = axios.create({
    baseURL: 'http://localhost:1000/',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});


// 🔹 Auth APIs
export const login = async (data) => {
    const response = await apiInstance.post('/auth/login', data);
    return response.data;
};
export const register = async (data) => {
    const response = await apiInstance.post('/auth/signup', data);
    return response.data;
};
export const logout = async () => {
    const response = await apiInstance.post('/auth/logout');
    return response.data;
};
export const Me = async () => {
    const response = await apiInstance.get('/auth/me');
    return response.data;
};

// 🔹 Produit APIs
export const getProduits = async () => { return await apiInstance.get('/produits'); };
export const getProduit = async (id) => { return await apiInstance.get(`/produits/${id}`); };
export const addProduit = async (data) => {
    return await apiInstance.post('/produits/ajouter', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
export const modifierProduit = async (productId, data) => {
    try {
        const response = await apiInstance.put(`/produits/modifier/${productId}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log("response from api : ", response.data);
        return response.data;
    } catch (error) {
        console.error('Error modifying product:', error.response ? error.response.data : error);
        throw error;
    }
};
export const supprimerProduit = async (productId) => { return await apiInstance.delete(`/produits/supprimer`, { data: { productId } }); };


// 🔹 Categories Api
export const getCategories = async () => { return await apiInstance.get('/categories/all'); }
export const ajouterCategorie = async (data) => { return await apiInstance.post('/categories/ajouter', data) }



// 🔹 Fournisseurs Api
export const getFournisseurs = async () => { return await apiInstance.get('/fournisseurs') }
export const rechercherFournisseurs = async (query) => { return await apiInstance.get(`/fournisseurs/rechercher?searchTerm=${query}`); }
export const ajouterFournisseur = async (data) => { return await apiInstance.post('/fournisseurs/ajouter', data) }
export const modifierFournisseur = async (data) => { return await apiInstance.put('/fournisseurs/modifier', data) }
export const supprimerFournisseur = async (fournisseurId) => { return await apiInstance.delete('/fournisseurs/supprimer', { data: { fournisseurId } }) }


// 🔹 User Api
export const changePassword = async (data) => { return await apiInstance.put('/user/changePassword', data) }
export const modifierUser = async (data) => { return await apiInstance.put('/user/modifier', data) }
export const getAllUsers = async () => { return apiInstance.get('/user/users') }




// 🔹 Posts Api
export const getPosts = async () => { return await apiInstance.get('/posts') }
export const ajouterPost = async (data) => {
    return await apiInstance.post('/posts/ajouter', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}