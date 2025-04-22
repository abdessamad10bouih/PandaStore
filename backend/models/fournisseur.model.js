import mongoose from "mongoose";


const FournisseurSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    contact: {
        tel: { type: String, required: true },
        email: {
            type: String,
            required: true,
            match: [/^\S+@\S+\.\S+$/, "Veuillez fournir une adresse email valide"],
        },
        respo: { type: String, required: true },
        adresse: { type: String },
    },
    status: { type: String, enum: ['actif', 'inactif'], default: 'actif' },
    logo: { type: String },
    produits: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produit'
    }],
    siteweb: { type: String },
    description: { type: String },
    notes: { type: String }
}, { timestamps: true })


const Fournisseur = mongoose.model('Fournisseur', FournisseurSchema);

export default Fournisseur;