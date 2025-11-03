const pool = require('../db/db');

module.exports = {
    getAvis: async ()=>{
        const result = await pool.query("SELECT * FROM avis");
        return result.rows;
    },
    getAvisByBriefing: async (idBriefing) => {
        const result = await pool.query(`
            SELECT a.*, u.nomUtilisateur, u.idUtilisateur
            FROM avisBriefing a
            JOIN utilisateur u ON a.idUtilisateurAvis = u.idUtilisateur 
            WHERE idBriefing = $1`, 
            [idBriefing]);
        return result.rows;
    },
    createAvis: async (idBriefing, idUtilisateurAvis, commentaire) => {
        const result = await pool.query(
            "INSERT INTO avisBriefing (idBriefing, idUtilisateurAvis, commentaire) VALUES ($1, $2, $3) RETURNING *",
            [idBriefing, idUtilisateurAvis, commentaire]
        );
        return result.rows[0];
    },
    updateAvis: async (idBriefing, idUtilisateurAvis, commentaire) => {
        const result = await pool.query(
            "UPDATE avisBriefing SET commentaire = $3, dateAvis = now() WHERE idBriefing = $1 AND idUtilisateurAvis = $2 RETURNING *",
            [idBriefing, idUtilisateurAvis, commentaire]
        );
        return result.rows[0];
    },
    deleteAvis: async (id) => {
        const result = await pool.query(
            "DELETE FROM avisBriefing WHERE idAvis = $1 RETURNING *",
            [id]
        );
        return result.rows[0];
    }
}