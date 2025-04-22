import Post from "../models/posts.model.js";

export const ajouterPost = async (req, res) => {
    try {
        const { titre, description, contenu, type, image, dateDebut, dateFin } = req.body;
        if (!titre || !description || !contenu || !type || !image || !dateDebut || !dateFin) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        const newPost = new Post({
            titre,
            description,
            contenu,
            type,
            image,
            dateDebut,
            dateFin
        })

        await newPost.save()
        res.status(201).json({
            message: "Post créé avec succès",
            post: newPost
        })
    } catch (error) {
        console.error('Erreur lors de la création du post :', error);
        res.status(500).json({
            message: "Erreur lors de la création du post",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}


export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate('produits', 'nom image prix');
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