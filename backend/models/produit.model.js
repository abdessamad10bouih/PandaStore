import mongoose from 'mongoose'


const reviewsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ratings: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
}, { timestamps: true })


const produitSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    description: { type: String, required: true },
    prix: { type: Number },
    reviews: [reviewsSchema],
    images: [{ type: String }],
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorie'
    }],
    subCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorie'
    }],
    stock: { type: Number, default: 0 },
    vente: [{ quanitity: { type: Number }, date: { type: Date } }],
    specifications: [{
        nom: { type: String },
        valeur: { type: String }
    }],
    status: { type: String, default: 'active' },
    sku: { type: String },
    cost: { type: Number },
    profit: { type: Number },
    discount: { type: Number },
    fournisseur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fournisseur'
    },
}, { timestamps: true })


const Produit = mongoose.model('Produit', produitSchema);

export default Produit; 