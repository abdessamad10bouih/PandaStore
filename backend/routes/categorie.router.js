import express from 'express';
import { AjouterCategorie, getCategories, getOneCategorie, RechercherCategorie } from '../controllers/categorie.controller.js';


const route = express.Router()


route.post('/ajouter', AjouterCategorie)
route.post('/rechercher/:categorieId', RechercherCategorie)
route.get('/all', getCategories)
route.get('/categorie/:categorieId', getOneCategorie)

export default route