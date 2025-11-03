// Formation model
const pool = require('../db/db');

module.exports = {
    getAll: async () => {
        const result = await pool.query(`
            SELECT f.* , u.nomutilisateur AS nomManager
            FROM formation f
            JOIN utilisateur u ON u.idUtilisateur = f.idUtilisateurManager
            ORDER BY f.dateFormation DESC`);
        return result.rows;
    },

    findById: async(id)=>{
        const result = await pool.query('SELECT * FROM formation WHERE idutilisateurmanager=$1', [id]);
        return result.rows;
    },

    createFormation: async(nomFormation, descriptionFormation, idUtilisateurManager)=>{
        const result = await pool.query(
            'INSERT INTO formation (nomformation, descriptionformation, idutilisateurmanager) VALUES ($1, $2, $3) RETURNING *', 
            [nomFormation, descriptionFormation, idUtilisateurManager]
        );
        return result.rows[0];
    }, 

    updateFormation: async (idFormation, nomFormation, descriptionFormation, idUtilisateurManager)=>{
        const result = await pool.query(
            'UPDATE formation SET nomformation=$1, descriptionformation=$2, idutilisateurmanager=$3 WHERE idformation=$4 RETURNING *',
            [nomFormation, descriptionFormation, idUtilisateurManager, idFormation]
        );
        return result.rows[0];
    },

    deleteFormation : async(idFormation)=>{
        const result = await pool.query(
            'DELETE FROM formation WHERE idformation=$1',
            [idFormation]
        );
        return result.rowCount > 0;
    }
}