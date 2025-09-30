const pool = require('../db/db');

module.exports = {
    getDemandeConger: async () => {
        
        const result = await pool.query(`
            SELECT 
            c.*, 
            u.nomUtilisateur AS nomAgentDemander,
            m.nomUtilisateur AS nomManagerTraiter
            FROM demandeConger c
            JOIN utilisateur u ON c.idAgentDemander = u.idUtilisateur
            LEFT JOIN utilisateur m ON c.idManagerTraiter = m.idUtilisateur;

            `);
        return result.rows;
    },

    getDemandeCongerbyId: async (id) => {
        const result = await pool.query(`SELECT * FROM demandeConger WHERE idDemandeConger=$1`, [id]);
        return result.rows[0];
    },

    getDemandeCongerbyUser: async (idUser) => {
        const result = await pool.query(`SELECT * FROM demandeConger WHERE idAgentDemander=$1`, [idUser]);
        return result.rows;
    },

    creerDemandeConger: async (typeConger, dateDebutConger, dateFinConger, idAgentDemander, idManagerTraiter) => {
        const result = await pool.query(
            `INSERT INTO demandeConger(typeConger, dateDebutConger, dateFinConger, statutConger, idAgentDemander, idManagerTraiter)
            VALUES ($1, $2, $3, 'en attente', $4, $5)
            RETURNING *`, [typeConger, dateDebutConger, dateFinConger, idAgentDemander, idManagerTraiter]
        );
        return result.rows[0];
    },

    updateDemandeConger: async (id, typeConger, dateDebutConger, dateFinConger, idManagerTraiter) => {
        const result = await pool.query(
            `UPDATE demandeConger 
             SET typeConger=$1, dateDebutConger=$2, dateFinConger=$3, idManagerTraiter=$4
             WHERE idDemandeConger=$5 RETURNING *`, [typeConger, dateDebutConger, dateFinConger, idManagerTraiter, id]
        );
        return result.rows[0];
    },

    deleteDemandeConger: async (id) => {
        const result = await pool.query(`DELETE FROM demandeConger WHERE idDemandeConger=$1 RETURNING *`, [id]);
        return result.rowCount > 0; // Retourne true si la suppression a réussi, sinon false
    },

    traiterDemandeConger: async (id, statutConger) => {
        const result = await pool.query(
            `UPDATE demandeConger
             SET statutConger=$1
             WHERE idDemandeConger=$2 RETURNING *`, [statutConger, id]
        );
        return result.rows[0];
    }
}