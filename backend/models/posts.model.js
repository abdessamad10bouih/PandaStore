import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true,
    },
    contenu: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['nouveau_produit', 'promotion', 'offre_speciale', 'autre'],
        default: 'autre',
    },
    produits: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Produit', 
        },
    ],
    image: {
        type: String,
    },
    dateDebut: {
        type: Date,
    },
    dateFin: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['actif', 'inactif'],
        default: 'actif',
    },
}, { timestamps: true });

const Post =  mongoose.model('Post', postSchema);

export default Post;
