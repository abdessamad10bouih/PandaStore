import Post from "../models/posts.model.js";
import { uploadImageToCloudinary } from "../lib/cloudinary.js";

export const ajouterPost = async (req, res) => {
    try {
        const { titre, contenu, type, dateDebut, dateFin, produits, description, status } = req.body;

        if (!titre || !contenu || !type || !dateDebut) {
            return res.status(400).json({ message: "Tous les champs requis (sauf image)" });
        }

        let imageUrl = null;

        if (req.file) {
            const result = await uploadImageToCloudinary(req.file);
            imageUrl = result.secure_url;
        }

        if (dateFin && new Date(dateFin) < new Date(dateDebut)) {
            return res.status(400).json({ message: "La date de fin ne peut pas être antérieure à la date de début" });
        }

        let produitIds = [];

        try {
            const parsedProduits = JSON.parse(produits);
            produitIds = Array.isArray(parsedProduits)
                ? parsedProduits.map((p) => (typeof p === 'string' ? p : p._id))
                : [];
        } catch (err) {
            console.error("Failed to parse produits:", err);
        }

        const newPost = new Post({
            titre,
            contenu,
            type,
            description,
            status,
            dateDebut,
            dateFin: null,
            produits: produitIds || [],
            image: imageUrl,
        });

        await newPost.save();

        if (dateFin) {
            newPost.dateFin = dateFin;
        }
        res.status(201).json({
            message: "Post créé avec succès",
            post: newPost,
        });
    } catch (error) {
        console.error("Erreur lors de la création du post :", error);
        res.status(500).json({
            message: "Erreur lors de la création du post",
            error: error.message,
        });
    }
};


export const modifierPost = async (req, res) => {
    try {
        const { postId } = req.params
        const { titre, contenu, type, dateDebut, dateFin, produits, description, status } = req.body;
        // console.log("Body", req.body, "file", req.file);
        if (!postId) {
            return res.status(400).json({ message: "L'ID du post est requis" });
        }

        if (!titre || !contenu || !type || !dateDebut || !dateFin) {
            return res.status(400).json({ message: "Tous les champs requis (sauf image)" });
        }

        let imageUrl = null;
        let produitIds = [];

        try {
            const parsedProduits = JSON.parse(produits);
            produitIds = Array.isArray(parsedProduits)
                ? parsedProduits.map((p) => (typeof p === 'string' ? p : p._id))
                : [];
        } catch (err) {
            console.error("Failed to parse produits:", err);
        }

        let finalDate = new Date();


        if (req.file) {
            const result = await uploadImageToCloudinary(req.file);
            imageUrl = result.secure_url;
        }

        const updatedFields = {
            titre,
            contenu,
            type,
            description,
            status,
            dateDebut,
            dateFin,
            produits: produitIds || [],
        };

        if (imageUrl) {
            updatedFields.image = imageUrl;
        }

        if (dateFin === finalDate) {
            updatedFields.status = "inactif";
        }
        const updatedPost = await Post.findByIdAndUpdate(postId, updatedFields, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: "Post non trouvé" });
        }

        res.status(201).json({
            message: "Post été modifier avec succès",
            post: updatedPost,
        });
    } catch (error) {
        console.error("Erreur lors de la modification du post :", error);
        res.status(500).json({
            message: "Erreur lors de la création du post",
            error: error.message,
        });
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({
                path: 'produits',
                populate: {
                    path: 'categories',
                    model: 'Categorie'
                }
            });
        res.status(200).json({
            message: "Liste des posts récupérée avec succès",
            posts
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des posts:", error);
        res.status(500).json({
            message: "Une erreur s'est produite lors de la récupération des posts",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}


export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        if (!postId) {
            return res.status(400).json({ message: "L'ID du post est requis" });
        }


        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ message: "Post non trouvé" });
        }
        res.status(200).json({
            message: "Post supprimé avec succès",
            post: deletedPost,
        });
    } catch (error) {
        console.error("Erreur lors de la suppression du post:", error);
        res.status(500).json({
            message: "Une erreur s'est produite lors de la suppression du post",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}