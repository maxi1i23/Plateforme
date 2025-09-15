const pool = require('../db/db');

module.exports = {
    getAutreDemande: async () => {
        const result = await pool.query('SELECT * FROM autreDemande');        
        return res.status(200).json(result.rows);
    },
    
    getAutreDemandeById: async (id) => {
        const result = await pool.query(`SELECT * FROM autreDemande WHERE idAutreDemande=${id}`);
        return result.rows[0];
    },

    createAutreDemande: async (nomAutreDemande, descriptionAutreDemande, dateAutreDemande, statutAutreDemande, idAgentAutreDemande, idManagerTraiterAutreDemande) => {
        const result = await pool.query(
            `INSERT INTO idAutreDemande (nomAutreDemande, descriptionAutreDemande, dateAutreDemande, statutAutreDemande, idAgentAutreDemande) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [nomAutreDemande, descriptionAutreDemande, dateAutreDemande, statutAutreDemande, idAgentAutreDemande, idManagerTraiterAutreDemande]
          );
        return result.rows[0];
    },

    updateAutreDemande: async (id, nomAutreDemande, descriptionAutreDemande, dateAutreDemande, statutAutreDemande, idAgentAutreDemande, idManagerTraiterAutreDemande) => {
        const result = await pool.query(
            `UPDATE autreDemande SET nomAutreDemande=$1, descriptionAutreDemande=$2, dateAutreDemande=$3, statutAutreDemande=$4, idAgentAutreDemande=$5, idManagerTraiterAutreDemande=$6 WHERE idAutreDemande=$7 RETURNING *`,
            [nomAutreDemande, descriptionAutreDemande, dateAutreDemande, statutAutreDemande, idAgentAutreDemande, idManagerTraiterAutreDemande, id]
          );
        return result.rows[0];
    },

    deleteAutreDemande: async (id) => {
        const result = await pool.query(`DELETE FROM autreDemande WHERE idAutreDemande=${id}`);
        return result;
    }
}