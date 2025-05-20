import express from 'express';
import upload from '../lib/multerConfig.js';
import { ajouterPost, deletePost, getAllPosts, modifierPost } from '../controllers/post.controller.js';


const route = express.Router()

route.post('/ajouter', upload.single('image'), ajouterPost);
route.put('/modifier/:postId', upload.single('image'), modifierPost);
route.delete('/supprimer/:postId', deletePost);
route.get('/', getAllPosts);

export default route