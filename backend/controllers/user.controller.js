import { Resend } from "resend";
import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import dotenv from "dotenv";
import { generateOTP } from "../scripts/onetimepasswordGenerator.js";

dotenv.config();


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


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp.toString();
    user.otpExpires = otpExpiresAt;

    await user.save();
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Reset Your Password',
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your PandaStore Verification Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td style="padding: 20px 0; text-align: center; background-color: #ffffff;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: auto; border: 1px solid #dddddd; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px 30px 20px; background-color: #000000; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">
                <span style="color: #ffffff;">🐼</span> PandaStore
              </h1>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 30px; background-color: #ffffff;">
              <h2 style="margin-top: 0; color: #333333; font-size: 20px;">Verify Your Account</h2>
              <p style="margin: 0 0 20px; color: #555555; line-height: 1.5;">
                Thank you for shopping with PandaStore! To complete your action, please use the verification code below:
              </p>
              
              <!-- OTP Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
                <tr>
                  <td align="center">
                    <div style="background-color: #f8f8f8; border: 2px dashed #cccccc; border-radius: 6px; padding: 20px; display: inline-block; min-width: 200px;">
                      <p style="margin: 0 0 10px; color: #777777; font-size: 14px;">Your verification code is:</p>
                      <p style="margin: 0; color: #000000; font-size: 32px; font-weight: bold; letter-spacing: 5px;">${otp}</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; color: #555555; line-height: 1.5;">
                This code will expire in 10 minutes. If you didn't request this code, please ignore this email or contact our support team.
              </p>
              
              <p style="margin: 0; color: #555555; line-height: 1.5;">
                Happy shopping!<br>
                The PandaStore Team
              </p>
            </td>
          </tr>
          
          <!-- CTA Section -->
          <tr>
            <td style="padding: 20px 30px; background-color: #f0f0f0; text-align: center;">
              <p style="margin: 0 0 15px; color: #555555;">
                Need help with your order?
              </p>
              <a href="https://pandastore.example.com/support" style="background-color: #000000; color: #ffffff; text-decoration: none; padding: 10px 25px; border-radius: 4px; display: inline-block; font-weight: bold;">Contact Support</a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #333333; color: #ffffff; text-align: center; font-size: 12px;">
              <p style="margin: 0 0 10px;">
                &copy; 2025 PandaStore. All rights reserved.
              </p>
              <p style="margin: 0 0 10px;">
                123 Bamboo Lane, Forest City, FC 12345
              </p>
              <p style="margin: 0;">
                <a href="https://pandastore.example.com/preferences" style="color: #ffffff; text-decoration: underline;">Email Preferences</a> | 
                <a href="https://pandastore.example.com/unsubscribe" style="color: #ffffff; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
                    </html>`
    });

    res.status(200).json({
      message: "OTP sent to your email",
      otp: otp
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong while sending the email.' });
  }
}

export const verifierOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!otp) {
      return res.status(400).json({ message: "Le code OTP est requis" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Code OTP invalide" });
    }

    const currentTime = new Date();
    if (currentTime > user.otpExpires) {
      return res.status(400).json({ message: "Le code OTP a expiré" });
    }

    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();
    res.status(200).json({
      message: "Code OTP vérifié avec succès",
      redirect: "/reset-password"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite lors de la vérification du code OTP." });
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email et mot de passe sont requis" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Mot de passe réinitialisé avec succès",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite lors de la réinitialisation du mot de passe." });
  }
}