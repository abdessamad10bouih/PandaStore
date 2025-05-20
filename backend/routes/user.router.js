import express from 'express';
import { ChangePassword, forgotPassword, getAllUsers, ModifierInformations, resetPassword, verifierOTP } from '../controllers/user.controller.js';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt'

const route = express.Router()

route.put('/changePassword', ChangePassword)
route.put('/modifier', ModifierInformations)
route.get('/users', getAllUsers)
route.post('/forgotPassword', forgotPassword)
route.post('/verifierOTP', verifierOTP)
route.post('/reset-password', resetPassword)

export default route