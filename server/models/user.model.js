// Fichier model/user.model.js

const pool = require('../db/db');

module.exports = {
    findByEmail: async (emailUtilisateur) => {
        const result = await pool.query('SELECT * FROM utilisateur WHERE emailutilisateur = $1', [emailUtilisateur])
        return result.rows[0]
    },
    getAll: async () => {
        const result = await pool.query('SELECT * FROM utilisateur ORDER BY idutilisateur ASC')
        return result.rows
    },

    findById: async (idUtilisateur) => {
        const result = await pool.query(
            'SELECT * FROM utilisateur WHERE idutilisateur = $1',
            [idUtilisateur]
        );
        return result.rows[0];
    },

    createUser : async (nomUtilisateur, emailUtilisateur, motDePasseUtilisateur, roleUtilisateur) => {
        const result = await pool.query(
            'INSERT INTO utilisateur (nomUtilisateur, emailutilisateur, motDePasseUtilisateur, roleUtilisateur) VALUES ($1, $2, $3, $4) RETURNING *', [nomUtilisateur, emailUtilisateur, motDePasseUtilisateur, roleUtilisateur]
        );
        
        return result.rows[0]
    },

    updateUser: async (idUtilisateur, nomUtilisateur, emailUtilisateur, motDePasseUtilisateur, roleUtilisateur) => {
        const result = await pool.query(
            `UPDATE utilisateur SET nomutilisateur=$1,emailutilisateur=$2,motdepasseutilisateur=$3,roleutilisateur=$4 WHERE idutilisateur=$5 RETURNING *`,
            [nomUtilisateur, emailUtilisateur, motDePasseUtilisateur, roleUtilisateur,idUtilisateur]
        )
        return result.rows[0];
    },

    deleteUser: async(idUtilisateur) => {
        const result = await pool.query(`DELETE FROM utilisateur WHERE idutilisateur=$1`, [idUtilisateur]);
        return result.rowCount > 0;
    },
}