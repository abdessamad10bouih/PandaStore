import { uploadImageToCloudinary } from "../lib/cloudinary.js";
import Categorie from "../models/categorie.model.js";


export const AjouterCategorie = async (req, res) => {
    try {
        const { nom, description, parentId, image } = req.body;
        console.log("body : ", req.body, "file : ", req.file);
        const existedCat = await Categorie.findOne({ nom });
        if (existedCat) {
            return res.status(400).json({ message: "Catégorie existe déjà" });
        }
        let imgUrl = null;
        let existingImage = null;

        if (req.file) {
            const result = await uploadImageToCloudinary(req.file);
            imgUrl = result.secure_url;
        } else if (existingImage) {
            imgUrl = existingImage;
        }
        const newCategorie = new Categorie({
            nom,
            description,
            parentId: parentId || null,
            image: imgUrl || null
        });
        const cat = await newCategorie.save();
        if (parentId) {
            const parentCategory = await Categorie.findById(parentId);
            if (parentCategory) {
                parentCategory.subcategories.push(cat._id);
                await parentCategory.save();
            }
        }
        res.status(201).json({ message: "Catégorie ajoutée avec succès", categorie: cat });
    } catch (error) {
        console.error("Error Ajouter Categorie :", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categorie = await Categorie.find({ parentId: null })
            .populate({
                path: "subcategories",
                populate: {
                    path: "subcategories",
                },
            })
            .populate("produits");


        res.status(200).json(categorie);
    } catch (error) {
        console.error("Erruer lors de la récupération des catégories :", error);
        res.status(500).json({ message: `Erreur serveur ${error}` });
    }
}

export const getOneCategorie = async (req, res) => {
    try {
        const { categorieId } = req.params;
        const categorie = await Categorie.findById(categorieId).populate("produits parentId");

        if (!categorie) {
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }

        res.status(201).json({ categorie: categorie });
    } catch (error) {
        console.error("Erruer lors de la récupération des catégories :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}

export const RechercherCategorie = async (req, res) => {
    try {
        const { categorieId } = req.params;
        const categorie = await Categorie.findById(categorieId).populate("produits parentId").select("-categorie");

        if (!categorie) {
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }

        res.status(200).json(categorie);
    } catch (error) {
        console.error("Erreur lors de la récupération de la catégorie :", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};


export const modifierCategorie = async (req, res) => {
    try {
        const { categorieId } = req.params;
        const { nom, description, parentId } = req.body;

        if (!nom || !description) {
            return res.status(400).json({ message: "Nom et description sont requis" });
        }
        let imgUrl = null
        const updatedFields = {
            nom,
            description,
            parentId: parentId || null,
        }


        if (req.file) {
            const result = await uploadImageToCloudinary(req.file);
            imgUrl = result.secure_url;
        }

        const updatedCategorie = await Categorie.findByIdAndUpdate(
            categorieId,
            updatedFields,
            { new: true }
        );

        if (imgUrl) {
            updatedCategorie.image = imgUrl;
        }
        if (parentId) {
            const parentCategory = await Categorie.findById(parentId);
            if (parentCategory) {
                parentCategory.subcategories.push(updatedCategorie._id);
                await parentCategory.save();
            }
        }

        if (!updatedCategorie) {
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }

        res.status(200).json({ message: "Catégorie modifiée avec succès", categorie: updatedCategorie });
    } catch (error) {
        console.error("Erreur lors de la modification de la catégorie :", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
}