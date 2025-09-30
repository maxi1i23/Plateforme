const pool = require('../db/db');

module.exports = {
    // Récupérer toutes les demandes
    getAutreDemande: async () => {
        const result = await pool.query('SELECT * FROM autreDemande');        
        return result.rows;
    },
    
    // Récupérer une demande par son ID
    getAutreDemandeById: async (id) => {
        const result = await pool.query(
            "SELECT * FROM autreDemande WHERE idAutreDemande = $1",
            [id]
        );
        return result.rows[0];
    },

    // Créer une nouvelle demande
    createAutreDemande: async (
        nomAutreDemande,
        descriptionAutreDemande,
        dateDemande,
        idAgentAutreDemande,
        idManagerTraiterAutreDemande
    ) => {
        const result = await pool.query(
            `INSERT INTO autreDemande 
            (nomAutreDemande, descriptionAutreDemande, dateDemande, statutAutreDemande, idAgentAutreDemande, idManagerTraiterAutreDemande) 
            VALUES ($1, $2, $3, 'En attente', $4, $5) 
            RETURNING *`,
            [
                nomAutreDemande,
                descriptionAutreDemande,
                dateDemande,
                idAgentAutreDemande,
                idManagerTraiterAutreDemande
            ]
        );
        return result.rows[0];
    },

    // Modifier une demande
    updateAutreDemande: async (
        id,
        nomAutreDemande,
        descriptionAutreDemande,
        dateDemande,
        idManagerTraiterAutreDemande
    ) => {
        const result = await pool.query(
            `UPDATE autreDemande 
            SET nomAutreDemande = $1, 
                descriptionAutreDemande = $2, 
                dateDemande = $3, 
                idManagerTraiterAutreDemande = $4 
            WHERE idAutreDemande = $5 
            RETURNING *`,
            [
                nomAutreDemande,
                descriptionAutreDemande,
                dateDemande,
                idManagerTraiterAutreDemande,
                id
            ]
        );
        return result.rows[0];
    },

    // Supprimer une demande
    deleteAutreDemande: async (id) => {
        const result = await pool.query(
            "DELETE FROM autreDemande WHERE idAutreDemande = $1 RETURNING *",
            [id]
        );
        return result.rows[0]; // retourne la demande supprimée
    },

    // Traiter la demande
    traiterAutreDemande: async (id, statutAutreDemande) => {
        const result = await pool.query(
            `UPDATE autreDemande 
            SET statutAutreDemande = $1 
            WHERE idAutreDemande = $2 
            RETURNING *`,
            [statutAutreDemande, id]
        );
        return result;
    }
    
};
