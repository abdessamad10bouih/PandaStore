import express from 'express';
import { AjouterCategorie, getCategories, getOneCategorie, modifierCategorie, RechercherCategorie } from '../controllers/categorie.controller.js';
import upload from '../lib/multerConfig.js';


const route = express.Router()


route.post('/ajouter', upload.single('image'), AjouterCategorie)
route.post('/modifier/:categorieId', upload.single('image'), modifierCategorie)
route.post('/rechercher/:categorieId', RechercherCategorie)
route.get('/all', getCategories)
route.get('/categorie/:categorieId', getOneCategorie)

export default route