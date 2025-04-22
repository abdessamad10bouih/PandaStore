import User from "../models/user.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    const { nom, email, password, confirmPassword } = req.body;
    try {
        if (!nom || !email || !password || !confirmPassword) {
            return res.status(401).json({ message: 'Tous les champs sont requis' });
        }

        if (password !== confirmPassword) {
            return res.status(401).json({ message: 'Les mots de passe ne correspondent pas' });
        }
        const emailExists = await User.findOne({ email });

        if (emailExists) return res.status(401).json({ message: 'Utilisateur déjà existant' });

        if (password.length < 8) return res.status(401).json({ message: 'Le mot de passe doit contenir plus de 8 caractères' });

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            nom,
            email,
            password: hashedPass
        });

        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        res.cookie("store", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        // Return the token and user info (without password)
        const userWithoutPassword = newUser.toObject();
        delete userWithoutPassword.password;

        res.status(201).json({
            message: "Utilisateur enregistré avec succès",
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
        res.status(500).json({
            message: "Erreur lors de l'enregistrement",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(401).json({ message: 'Tous les champs sont requis' });
        }
        const user = await User.findOne({ email }).select('+password');
        console.log(user);
        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe invalide' });
        }
        if (!user.password) {
            return res.status(401).json({ message: 'Aucun mot de passe défini pour cet utilisateur' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe invalide' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        res.cookie("store", token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: '',
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
        });

        // Return user data without password
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.status(200).json({
            message: "Connexion réussie",
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).json({
            message: "Erreur interne du serveur",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
export const logout = async (req, res) => {
    res.clearCookie("store");
    res.status(200).json({ message: "Déconnexion réussie" })
}


export const Me = async (req, res) => {
    const token = req.cookies.store;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    res.json(user);
}