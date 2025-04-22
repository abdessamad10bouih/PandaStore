import express from 'express';
import { AjouterProduit, getAllProduits, getProduit, ModifierProduit, RechercherProduit, SupprimerProduit } from '../controllers/produits.controller.js';
import upload from '../lib/multerConfig.js';


const route = express.Router()

route.post('/ajouter', upload.fields([{ name: "images", maxCount: 4 }]), AjouterProduit)
route.put('/modifier/:productId', upload.array('images'), ModifierProduit)
route.delete('/supprimer', SupprimerProduit)
route.get('/', getAllProduits)
route.get('/:productId', getProduit)
route.get('/rechercherProduit', RechercherProduit) 

export default route