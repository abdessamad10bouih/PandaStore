import express from 'express';
import { ChangePassword, getAllUsers, ModifierInformations } from '../controllers/user.controller.js';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt'

const route = express.Router()

route.put('/changePassword', ChangePassword)
route.put('/modifier', ModifierInformations)
route.get('/users', getAllUsers)

export default route