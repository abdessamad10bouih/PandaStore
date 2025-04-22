import express, { Router } from 'express';
import { ajouterFournisseur, getFournisseurs, ModifierFournisseur, RechercherFournisseur, supprimerFournisseur } from '../controllers/fournisseur.controller.js';


const route = express.Router()

route.post('/ajouter', ajouterFournisseur)
route.put('/modifier', ModifierFournisseur)
route.delete('/supprimer', supprimerFournisseur)
route.get('/', getFournisseurs)
route.get('/rechercher', RechercherFournisseur)

export default route