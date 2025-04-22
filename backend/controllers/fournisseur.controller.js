import Fournisseur from "../models/fournisseur.model.js";
import mongoose from "mongoose";



export const ajouterFournisseur = async (req, res) => {
    try {

        const { nom, status, description, notes } = req.body;

        const tel = req.body.contact?.tel || req.body.tel;
        const email = req.body.contact?.email || req.body.email;
        const respo = req.body.contact?.respo || req.body.respo;
        const adresse = req.body.contact?.adresse || req.body.adresse;
        const siteweb = req.body.siteweb || "";

        if (!nom || !tel || !email) {
            console.log("Missing required fields");
            return res.status(400).json({ error: "Les champs nom, tel, email sont obligatoires" });
        }

        const existedTelephone = await Fournisseur.findOne({ "contact.tel": tel });
        if (existedTelephone) {
            return res.status(401).json({ error: "Un fournisseur avec ce numéro de téléphone existe déjà" });
        }

        const newFournisseur = new Fournisseur({
            nom,
            contact: {
                tel,
                email,
                respo,
                adresse,
            },
            logo: req.body.logo || '',
            status,
            description,
            notes,
            siteweb
        });


        await newFournisseur.save();
        res.status(201).json(newFournisseur);
    } catch (error) {
        console.error("Detailed error:", error);
        if (error.code === 11000) {
            return res.status(409).json({ message: "Un fournisseur avec ce nom existe déjà" });
        }

        res.status(500).json({ message: "Erreur serveur lors de l'ajout du fournisseur", error: error.message });
    }
};

export const getFournisseurs = async (req, res) => {
    try {
        const allFournisseurs = await Fournisseur.find();
        res.status(200).json({ allFournisseurs });
    } catch (error) {
        console.log("Error in getFournisseurs", error);
    }
}


export const ModifierFournisseur = async (req, res) => {
    try {
        const { fournisseurId, nom, status, description, notes, siteweb = "" } = req.body;

        const tel = req.body.contact?.tel || req.body.tel;
        const email = req.body.contact?.email || req.body.email;
        const respo = req.body.contact?.respo || req.body.respo;
        const adresse = req.body.contact?.adresse || req.body.adresse;

        if (!nom || !tel || !email) {
            return res.status(400).json({ message: "Champs requis manquants" });
        }
        const updatedData = {
            nom,
            contact: { tel, email, respo, adresse },
            logo: req.body.logo || '',
            status,
            description,
            notes,
            siteweb
        };

        const modifiedFournisseur = await Fournisseur.findByIdAndUpdate(
            fournisseurId,
            updatedData,
            { new: true }
        );

        if (!modifiedFournisseur) {
            return res.status(404).json({ message: "Fournisseur introuvable" });
        }

        res.status(200).json(modifiedFournisseur);

    } catch (error) {
        console.error("Error in modifier fournisseur:", error);
        res.status(500).json({ message: "Erreur lors de la modification du fournisseur", error: error.message });
    }
};


export const supprimerFournisseur = async (req, res) => {
    try {
        const { fournisseurId } = req.body;
        const deletedFournisseur = await Fournisseur.findByIdAndDelete(
            fournisseurId,
            { new: true }
        );
        if (!deletedFournisseur) {
            return res.status(404).json({ message: "Fournisseur introuvable" });
        }
        res.status(201).json({ message: "Fournisseur été supprimé avec success" });
    } catch (error) {
        console.log("error supprimer fournisseur", error);
    }
}


export const RechercherFournisseur = async (req, res) => {
    try {
        const { searchTerm } = req.query;
        const regex = new RegExp(searchTerm, "i"); 

        const result = await Fournisseur.find({
            $or: [
                { nom: regex },
                { "contact.tel": regex },
                { "contact.email": regex },
                { "contact.respo": regex },
                { "contact.adresse": regex },
            ],
        });

        res.status(200).json(result);
    } catch (error) {
        console.error("Error in RechercherFournisseur:", error);
        res.status(500).json({ message: "Erreur lors de la recherche du fournisseur", error: error.message });
    }
}