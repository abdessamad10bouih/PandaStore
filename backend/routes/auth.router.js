import express from 'express';
import { login, logout, Me, register } from '../controllers/auth.controller.js';


const route = express.Router()


route.post('/signup', register)
route.post('/login', login);
route.post('/logout', logout);
route.get('/me', Me);

export default route