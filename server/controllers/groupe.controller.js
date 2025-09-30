const pool = require("../db/db"); // ton instance PostgreSQL (pg)
const Groupe = require('../models/groupe.model')
const GroupeMembre = require('../models/groupeMembre.model')

exports.creerGroupe = async (req, res) => {
    try {
        const { nomGroupe, membres } = req.body; 
        // membres = [1,2,3] par exemple

        const groupe = await Groupe.createGroupe(nomGroupe)

        const idGroupe = groupe.rows[0].idgroupe;

        // Ajouter les membres
        if (membres && membres.length > 0) {
            for (let idUtilisateur of membres) {
                await GroupeMembre.addGroupeMembre(idGroupe, idUtilisateur)
            }
        }

        return res.status(201).json(groupe);
    } catch (error) {
        console.error("Erreur création groupe:", error);
        return res.status(500).json({ error: "Erreur interne serveur" });
    }
};

exports.getGroupeList = async (req, res) => {
    try {
        const groupe = await Groupe.getGroupe();
        console.log(groupe.rows);
        return res.status(200).json(groupe.rows);
    }catch(error){
        console.log('erreur', error)
    }
 }

exports.ajouterMembre = async (req, res) => {
    try {
        const { idGroupe } = req.params;
        const { idUtilisateur } = req.body;

        await GroupeMembre.addGroupeMembre(idGroupe, idUtilisateur);

        return res.json({ message: "Membre ajouté avec succès" });
    } catch (error) {
        console.error("Erreur ajout membre:", error);
        return res.status(500).json({ error: "Erreur interne serveur" });
    }
};

exports.listerMembres = async (req, res) => {
    try {
        const { idGroupe } = req.params;

        const membres = await GroupeMembre.getGroupeMembres(idGroupe);

        return res.json(membres);
    } catch (error) {
        console.error("Erreur liste membres:", error);
        return res.status(500).json({ error: "Erreur interne serveur" });
    }
};

exports.listerGroupesUtilisateur = async (req, res) => {
    try {
        const { idUtilisateur } = req.params;

        const groupes = await pool.query(
            `SELECT g.idGroupe, g.nomGroupe, g.dateCreation
             FROM groupe g
             JOIN groupeMembre gm ON g.idGroupe = gm.idGroupe
             WHERE gm.idUtilisateur = $1`,
            [idUtilisateur]
        );

        return res.json(groupes.rows);
    } catch (error) {
        console.error("Erreur liste groupes utilisateur:", error);
        return res.status(500).json({ error: "Erreur interne serveur" });
    }
};


exports.quitterGroupe = async (req, res)=>{
    try {
        const idUtilisateur = req.user.id
        const idGroupe = req.params.idGroupe
        await GroupeMembre.deleteGroupeMembre(idGroupe, idUtilisateur)
        return res.status(200).json({message : "L'utilisateur a été supprimer du groupe"})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json(error)
    }
}