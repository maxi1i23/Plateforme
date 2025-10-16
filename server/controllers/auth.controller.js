// Fichier controller/auth.controller.js

const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
   try {
      const { nomUtilisateur, emailUtilisateur, motDePasseUtilisateur, roleUtilisateur } = req.body

      // Vérifie si l'utilisateur existe déjà
      const existingUser = await User.findByEmail(emailUtilisateur)
      if(existingUser){
         return res.status(400).json({error : 'Email déjà utilisée'})
      }

      // Crypter le mot de passe de l'utilisateur
      const hashPassword = await bcrypt.hash(motDePasseUtilisateur, 10)

      // Faire l'inscription de l'utilisateur
      const user = await User.createUser(nomUtilisateur, emailUtilisateur,hashPassword,roleUtilisateur)
      return res.status(201).json({message : 'Utilisateur crée avec succés'})
      
   } catch (error) {
      return res.status(500).json({error : 'Erreur du serveur'})
   }
}

exports.login = async (req, res) => {
   try {
     const { emailUtilisateur, motDePasseUtilisateur } = req.body;
 
     // Vérification si l'utilisateur existe
     const existingUser = await User.findByEmail(emailUtilisateur);
 
     if (!existingUser) {
       return res.status(400).json({ error: "Utilisateur non trouvé" });
     }
 
     // Comparaison du mot de passe
     const isMatch = await bcrypt.compare(
       motDePasseUtilisateur,
       existingUser.motdepasseutilisateur
     );
     if (!isMatch) {
       return res.status(400).json({ error: "Mot de passe incorrect" });
     }
 
     // Générer le token
     const token = jwt.sign(
       {
         id: existingUser.idutilisateur,
         nomUtilisateur: existingUser.nomutilisateur,
         email: existingUser.emailutilisateur,
         role: existingUser.roleutilisateur,
       },
       process.env.JWT_SECRET,
       { expiresIn: "24h" }
     );
 
     // Supprimer le mot de passe de la réponse
     const { motdepasseutilisateur, ...safeUser } = existingUser;
 
     // Enregistrer le token dans les cookies
     res.cookie("jwtToken", token, { 
      httpOnly: true,
      sameSite: "lax", // Changé de "strict" à "lax" pour permettre navigation entre onglets
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24h en millisecondes
    });
 
     console.log("Connexion réussie");
     res.status(200).json({
       message: "Connexion réussie",
       token,
       user: safeUser, //  on renvoie l'utilisateur
     });
   } catch (error) {
     return res.status(500).json({ message: error.message });
   }
 };
 
exports.logout = (req,res) => {
   res.clearCookie('jwtToken');
   res.status(200).json({ message: 'Déconnecté avec succès' });
}

// Pour renvoyer si le token existe ou pas et qui est l'utilisateur connecté
exports.me = (req, res) => {
  try {
    const token = req.cookies.jwtToken;
    if (!token) return res.status(401).json({ error: 'Non connecté' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ user: decoded });
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
  }
};