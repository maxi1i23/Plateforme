// Formation model
const pool = require('../db/db');

module.exports = {
    getAll: async () => {
        try {
            const result = await pool.query('SELECT * FROM formation');
            return result.rows;
        } catch (err) {
            console.log('Erreur lors de la récupération des formations : ', err);
            res.status(500).send({ message: "Erreur lors de la récupération des formations" });
        }
    },

    findById: async(id)=>{
        try {
            const result = await pool.query('SELECT * FROM formation WHERE idformation=$1', [id]);
            return result.rows[0];
        } catch (err) {
            console.log('Erreur lors de la récupération du formations : ', err);
            res.status(500).send({ message: "Erreur lors de la récupération des formations" });
        }
    },

    createFormation: async(nomFormation, descriptionFormation, dateFormation, idUtilisateurManager)=>{
        const result = await pool.query(
            'INSERT INTO formation (nomformation, descriptionformation, dateformation, idutilisateurmanager) VALUES ($1, $2, $3, $4) RETURNING *', 
            [nomFormation, descriptionFormation, dateFormation, idUtilisateurManager]
        );
        return result.rows[0];
    }, 

    updateFormation: async(idFormation, nomFormation, descriptionFormation, dateFormation, idUtilisateurManager)=>{
        const result = await pool.query(
            'UPDATE formation SET nomformation=$1, descriptionformation=$2, dateformation=$3, idutilisateurmanager=$4 WHERE idformation=$5 RETURNING *',
            [nomFormation, descriptionFormation, dateFormation,idUtilisateurManager, idFormation]
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