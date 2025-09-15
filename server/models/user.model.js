// Fichier model/user.model.js

const pool = require('../db/db')

module.exports = {
    findByEmail: async (emailUtilsateur) => {
        const result = await pool.query('SELECT * FROM utilisateur WHERE emailutilisateur = $1', [emailUtilsateur])
        return result.rows[0]
    },

    createUser : async (nomUtilisateur, emailUtilsateur, motDePasseUtilisateur, roleUtilisateur) => {
        const result = await pool.query(
            'INSERT INTO utilisateur (nomUtilisateur, emailutilisateur, motDePasseUtilisateur, roleUtilisateur) VALUES ($1, $2, $3, $4) RETURNING *', [nomUtilisateur, emailUtilsateur, motDePasseUtilisateur, roleUtilisateur]
        );
        
        return result.rows[0]
    }
}