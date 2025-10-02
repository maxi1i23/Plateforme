const User = require('../models/user.model');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).send("Erreur serveur");
    }
}
exports.updateUser = async (req, res) => {
    const id = req.params.id;
    const { nomUtilisateur, emailUtilisateur, motDePasseUtilisateur, roleUtilisateur } = req.body;

    try {
        let hashedPassword;

        if (motDePasseUtilisateur && motDePasseUtilisateur.trim() !== "") {
            // Si l'utilisateur veut changer son mot de passe
            hashedPassword = await bcrypt.hash(motDePasseUtilisateur, 10);
        } else {
            // Sinon, on récupère l'ancien mot de passe dans la BD
            const existingUser = await User.findById(id);
            if (!existingUser) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }
            hashedPassword = existingUser.motdepasseutilisateur;
        }

        const result = await User.updateUser(
            id,
            nomUtilisateur,
            emailUtilisateur,
            hashedPassword,
            roleUtilisateur
        );

        if (result) {
            return res.status(200).json({ message: "Utilisateur modifié avec succès" });
        } else {
            return res.status(400).json({ message: "Erreur lors de la modification" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur lors de la modification" });
    }
};

exports.deleteUser = async(req, res) => {
    const id = req.params.id;
    try {
        const result = await User.deleteUser(id);
        if(result){
            return res.status(201).json({message: "utilisateur supprimé"});
        }else{
            return res.status(409).json({message: "erreur lors de la suppression"});
        }
    }catch(error){
        return res.status(500).json({message: "erreur lors de la suppression"});
    }
}