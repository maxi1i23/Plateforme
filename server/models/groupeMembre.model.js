const pool = require('../db/db');

module.exports = {
    getGroupeMembres: async (idGroupe) => {
        const result = await pool.query('SELECT * FROM groupeMembre WHERE idGroupe=$1', [idGroupe]);
        return result.rows;
    },

    addGroupeMembre: async (idGroupe, idUtilisateur) => {
        await pool.query('INSERT INTO groupeMembre (idGroupe, idUtilisateur) VALUES($1,$2) ON CONFLICT DO NOTHING', 
            [idGroupe,idUtilisateur]);
    },

    deleteGroupeMembre: async (idGroupe, idUtilisateur) => {
        const result =await pool.query('DELETE FROM groupeMembre WHERE idGroupe=$1 AND idUtilisateur=$2',
            [idGroupe,idUtilisateur]);
        return result.rowCount > 0;
    }
}