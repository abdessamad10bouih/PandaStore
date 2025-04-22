import Produit from "../models/produit.model.js";
import Categorie from "../models/categorie.model.js";
import Fournisseur from "../models/fournisseur.model.js";
import mongoose from "mongoose";
import cloudinary, { uploadImageToCloudinary } from "../lib/cloudinary.js";
import upload from "../lib/multerConfig.js";

// Helper function to upload a file to Cloudinary
const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        uploadStream.end(file.buffer);
    });
};

// Helper to normalize category input (string or array)
const processCategories = (input) => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    return [input];
};


export const getAllProduits = async (req, res) => {
    try {
        const produits = await Produit.find().populate("categories").sort({ createdAt: -1 });
        res.status(200).json(produits);
    } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const getProduit = async (req, res) => {
    try {
        const { productId } = req.params;
        const produit = await Produit.findById(productId).populate("categories fournisseur");
        if (!produit) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        res.status(200).json(produit);
    } catch (error) {
        console.error("Erreur lors de la récupération du produit :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Add a new product
export const AjouterProduit = async (req, res) => {
    try {
        const {
            nom,
            description,
            prix,
            stock,
            categories = [],
            specifications = [],
            status,
            sku,
            cost,
            discount,
            fournisseur,
        } = req.body;

        if (!nom || !description || !prix || !stock) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        const parsedPrix = Number(prix);
        if (isNaN(parsedPrix) || parsedPrix <= 0) {
            return res.status(400).json({ message: "Le prix doit être un nombre valide et supérieur à 0" });
        }

        const parsedStock = Number(stock);
        if (isNaN(parsedStock) || parsedStock <= 0) {
            return res.status(400).json({ message: "Le prix doit être un nombre valide et supérieur à 0" });
        }

        const imageUrls = await processProductImages(req, []);
        const specs = processSpecifications(specifications);

        const newProduct = new Produit({
            nom,
            description,
            prix: parsedPrix,
            stock: parsedStock,
            categories: processCategories(categories),
            specifications: specs,
            subcategories: processCategories(req.body.subcategories),
            status: status || "active",
            sku,
            images: imageUrls,
            fournisseur: mongoose.Types.ObjectId.isValid(fournisseur) ? fournisseur : null,
            cost: Number(cost) || 0,
            discount: Number(discount) || 0,
        });

        await newProduct.save();
        await Categorie.updateMany(
            { _id: { $in: newProduct.categories } },
            { $addToSet: { produits: newProduct._id } }
        );


        if (mongoose.Types.ObjectId.isValid(fournisseur)) {
            await Fournisseur.updateMany(
                { _id: fournisseur },
                { $addToSet: { produits: newProduct._id } }
            );
        }

        res.status(201).json({
            message: "Produit ajouté avec succès",
            produit: newProduct,
        });
    } catch (error) {
        console.error("Erreur lors de l'ajout du produit :", error);
        res.status(500).json({
            message: "Erreur serveur",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

export const ModifierProduit = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId) return res.status(400).json({ message: "ID du produit est requis" });

        const {
            nom,
            description,
            prix,
            stock,
            categories = [],
            subcategories = [],
            specifications: specsJson = '[]',
            status = 'active',
            sku,
            cost = 0,
            discount = 0,
            fournisseur,
            existingImages = [],
        } = req.body;

        let parsedSpecs = specifications;
        if (typeof specifications === "string") {
            try {
                parsedSpecs = JSON.parse(specifications);
            } catch (err) {
                return res.status(400).json({ message: "Format des spécifications invalide" });
            }
        }

        // Clean and validate input
        const parsedPrix = Number(prix);
        if (isNaN(parsedPrix) || parsedPrix <= 0)
            return res.status(400).json({ message: "Le prix doit être un nombre valide et supérieur à 0" });

        const parsedStock = Number(stock) || 0;
        const parsedCost = Number(cost) || 0;
        const parsedDiscount = Number(discount) || 0;

        let specifications = [];

        if (Array.isArray(specsJson)) {
            specifications = specsJson.map((spec) =>
                typeof spec === "string" ? JSON.parse(spec) : spec
            );
        } else if (typeof specsJson === "string") {
            try {
                const parsed = JSON.parse(specsJson);
                specifications = Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                specifications = [];
            }
        }



        const existingProduct = await Produit.findById(productId);
        if (!existingProduct)
            return res.status(404).json({ message: "Produit non trouvé" });

        // Process images and specs
        const imageUrls = await processProductImages(req, existingImages);
        const specs = processSpecifications(specifications);

        // Remove fournisseur if it's an empty string
        const updatedFields = {
            nom,
            description,
            prix: parsedPrix,
            images: imageUrls,
            categories,
            subcategories,
            stock: parsedStock,
            specifications: specs,
            status,
            sku,
            cost: parsedCost,
            discount: parsedDiscount,
        };

        if (fournisseur && fournisseur !== "") {
            updatedFields.fournisseur = fournisseur;
        }

        const updatedProduct = await updateProductDocument(productId, updatedFields);

        await updateCategoryReferences(
            productId,
            existingProduct.categories || [],
            existingProduct.subcategories || [],
            categories,
            subcategories
        );

        res.status(200).json({
            message: "Produit mis à jour avec succès",
            produit: updatedProduct,
        });

    } catch (error) {
        console.error("Erreur lors de la modification du produit:", error);
        res.status(500).json({
            message: "Erreur serveur",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};


async function processProductImages(req, existingImages) {
    const imageUrls = [];

    if (Array.isArray(existingImages)) {
        existingImages.forEach(img => {
            if (typeof img === 'string' && img.startsWith('http')) {
                imageUrls.push(img);
            }
        });
    }

    if (req.files?.images) {
        const files = Array.isArray(req.files.images)
            ? req.files.images
            : [req.files.images];

        for (const file of files) {
            const result = await uploadImageToCloudinary(file);
            imageUrls.push(result.secure_url);
        }
    }

    return imageUrls;
}

function processSpecifications(specifications) {
    try {
        return typeof specifications === 'string'
            ? JSON.parse(specifications)
            : (Array.isArray(specifications) ? specifications : []);
    } catch (e) {
        console.error("Erreur de parsing des spécifications:", e);
        return [];
    }
}

// Helper function to update product document
async function updateProductDocument(id, updateData) {
    return await Produit.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
            runValidators: true
        }
    );
}

// Helper function to update category references
async function updateCategoryReferences(productId, oldCategories, oldSubcategories, newCategories, newSubcategories) {
    // Categories to remove
    const categoriesToRemove = oldCategories.filter(
        catId => !newCategories.includes(catId.toString())
    );

    // Subcategories to remove
    const subcategoriesToRemove = oldSubcategories.filter(
        subId => !newSubcategories.includes(subId.toString())
    );

    // Remove from old categories
    if (categoriesToRemove.length > 0) {
        await Categorie.updateMany(
            { _id: { $in: categoriesToRemove } },
            { $pull: { produits: productId } }
        );
    }

    // Remove from old subcategories
    if (subcategoriesToRemove.length > 0) {
        await Categorie.updateMany(
            { _id: { $in: subcategoriesToRemove } },
            { $pull: { produits: productId } }
        );
    }

    // Add to new categories
    if (newCategories.length > 0) {
        await Categorie.updateMany(
            { _id: { $in: newCategories } },
            { $addToSet: { produits: productId } }
        );
    }

    // Add to new subcategories
    if (newSubcategories.length > 0) {
        await Categorie.updateMany(
            { _id: { $in: newSubcategories } },
            { $addToSet: { produits: productId } }
        );
    }
}

export const getProducts = async (req, res) => {
    try {
        const products = await Produit.find()
            .populate('categories', 'nom')
            .populate('subcategories', 'nom')
            .populate('fournisseur', 'nom');

        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des produits" });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Produit.findById(id)
            .populate('categories', 'nom')
            .populate('subcategories', 'nom')
            .populate('fournisseur', 'nom');

        if (!product) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération du produit" });
    }
};


// Helper function to delete images from Cloudinary (optional)
// async function deleteImagesFromCloudinary(imageUrls) {
//     try {
//         const publicIds = imageUrls.map(url => {
//             const parts = url.split('/');
//             return parts[parts.length - 1].split('.')[0];
//         });

//         await cloudinary.api.delete_resources(publicIds);
//     } catch (error) {
//         console.error("Error deleting images from Cloudinary:", error);
//     }
// }

// Helper function to process categories

export const SupprimerProduit = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "ID de produit invalide" });
        }

        const produit = await Produit.findById(productId);
        if (!produit) {
            return res.status(404).json({ message: "Produit n'existe pas" });
        }

        // Start a session for transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Remove product from categories
            if (produit.categories && produit.categories.length > 0) {
                await Categorie.updateMany(
                    { _id: { $in: produit.categories } },
                    { $pull: { produits: productId } },
                    { session }
                );
            }

            // Remove product from supplier
            if (produit.fournisseur) {
                await Fournisseur.findByIdAndUpdate(
                    produit.fournisseur,
                    { $pull: { produits: productId } },
                    { session }
                );
            }
            if (produit.images && produit.images.length > 0) {
                const publicIds = produit.images.map(url => {
                    const parts = url.split('/');
                    return parts[parts.length - 1].split('.')[0];
                });
                await cloudinary.api.delete_resources(publicIds);
            }
            await Produit.findByIdAndDelete(productId, { session });

            await session.commitTransaction();
            res.status(200).json({ message: 'Produit a été supprimé avec succès' });
        } catch (error) {
            await session.abortTransaction();
            console.error("Erreur lors de la suppression du produit :", error);
            res.status(500).json({ message: "Erreur serveur" });
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.error("Erreur lors de la suppression du produit :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const RechercherProduit = async (req, res) => {
    try {
        const { nom } = req.query;
        const filter = nom ? { nom: { $regex: nom, $options: "i" } } : {};
        const produits = await Produit.find(filter);

        if (!produits.length) {
            return res.status(404).json({ message: "Aucun produit trouvé." });
        }

        res.status(200).json(produits);
    } catch (error) {
        console.error("Erreur lors de la recherche du produit :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};