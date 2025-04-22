import express from 'express';
import upload from '../lib/multerConfig.js';
import { ajouterPost, getAllPosts } from '../controllers/post.controller.js';


const route = express.Router()

route.post('/ajouter', upload.single('image'), ajouterPost);
route.get('/', getAllPosts);

export default route