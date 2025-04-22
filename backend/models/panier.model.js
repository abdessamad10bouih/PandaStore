import mongoose from 'mongoose';


const PanierSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produit'
    }
});

const Panier = mongoose.model('Panier', PanierSchema);

export default Panier