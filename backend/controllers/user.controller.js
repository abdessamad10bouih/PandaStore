import User from "../models/user.model.js";
import bcrypt from "bcrypt"
export const Profile = (req, res) => {
    try {

    } catch (error) {

    }
}


export const ChangePassword = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword, confirmedPassword } = req.body;

        if (!userId || !currentPassword || !newPassword || !confirmedPassword) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        const user = await User.findById(userId).select('+password');
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères" });
        }

        if (newPassword !== confirmedPassword) {
            return res.status(400).json({ message: "Les nouveaux mots de passe ne correspondent pas" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Le mot de passe actuel est incorrect"
            });
        }

        if (await bcrypt.compare(newPassword, user.password)) {
            return res.status(400).json({ message: "Le nouveau mot de passe doit être différent de l'ancien" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.clearCookie("store", {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: '',
            path: '/'
        });

        return res.status(200).json({
            message: "Mot de passe changé avec succès. Veuillez vous reconnecter.",
            redirect: "/login"
        });

    } catch (error) {
        console.error("Erreur lors du changement de mot de passe:", error);
        return res.status(500).json({
            message: "Une erreur s'est produite lors du changement de mot de passe",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}


export const ModifierInformations = async (req, res) => {
    try {
        const { userId, username, email, phone, avatar, addresses } = req.body;

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        if (username) {
            const usernameExists = await User.findOne({ username });
            if (usernameExists && usernameExists._id.toString() !== userId) {
                return res.status(400).json({ message: "Le nom d'utilisateur existe déjà, veuillez en choisir un autre" });
            }
        }

        if (email) {
            const emailExists = await User.findOne({ email });
            if (emailExists && emailExists._id.toString() !== userId) {
                return res.status(400).json({ message: "L'email existe déjà, veuillez en choisir un autre" });
            }
        }

        const updatedFields = {};
        const fieldsToUpdate = { username, email, phone, avatar };

        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            if (value !== undefined && value !== null && value !== '') {
                updatedFields[key] = value;
            }
        }

        // Process addresses if provided
        if (addresses && Array.isArray(addresses)) {
            updatedFields.addresses = addresses.map(address => ({
                street: address.street || "",
                city: address.city || "",
                state: address.state || "",
                country: address.country || "Maroc",
                postalCode: address.postalCode || "",
                isDefault: address.isDefault || false
            }));
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updatedFields,
            { new: true, runValidators: true } // Added runValidators
        );

        if (!updatedUser) {
            return res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour des informations" });
        }

        res.status(200).json({
            message: "Toutes les informations ont été mises à jour avec succès",
            user: updatedUser
        });

    } catch (error) {
        console.error("Erreur lors de la mise à jour des informations:", error);

        // Handle validation errors specifically
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Erreur de validation",
                errors: process.env.NODE_ENV === 'development' ? error.errors : undefined
            });
        }

        return res.status(500).json({
            message: "Une erreur s'est produite lors de la mise à jour des informations",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password -__v').sort({ createdAt: -1 });

        res.status(200).json({
            message: "Liste des utilisateurs récupérée avec succès",
            users
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        res.status(500).json({
            message: "Une erreur s'est produite lors de la récupération des utilisateurs",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}