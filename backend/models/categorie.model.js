import mongoose from 'mongoose'


const categorieSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    description: { type: String, required: true },
    produits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Produit' }],
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorie',
        default: null,
    },
    subcategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorie',
    }],
}, { timestamps: true });



const Categorie = mongoose.model('Categorie', categorieSchema);

export default Categorie; 