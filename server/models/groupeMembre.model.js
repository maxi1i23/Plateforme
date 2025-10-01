const pool = require('../db/db');

module.exports = {
    getGroupeMembres: async (idGroupe) => {
        const result = await pool.query(`
            SELECT u.nomUtilisateur, u.roleUtilisateur, u.idUtilisateur, g.idMembre
            FROM groupeMembre g
            JOIN utilisateur u ON u.idUtilisateur = g.idUtilisateur
            WHERE g.idGroupe = $1
            `, [idGroupe]);
        return result.rows;
    },

    addGroupeMembre: async (idGroupe, idUtilisateur) => {
        await pool.query('INSERT INTO groupeMembre (idGroupe, idUtilisateur) VALUES($1,$2) ON CONFLICT DO NOTHING', 
            [idGroupe,idUtilisateur]);
    },

    deleteGroupeMembre: async (idGroupe, idMembre) => {
        const result =await pool.query('DELETE FROM groupeMembre WHERE idGroupe=$1 AND idMembre=$2',
            [idGroupe,idMembre]);
        return result.rowCount > 0;
    }
}