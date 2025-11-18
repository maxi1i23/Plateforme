const pool = require('../db/db')

module.exports = {
    getAllBriefing: async () => {
        const result = await pool.query(`
            SELECT b.* , u.nomutilisateur AS nomManager
            FROM briefing b
            JOIN utilisateur u ON u.idUtilisateur = b.idManager
            ORDER BY b.dateBriefing DESC`)
        return result.rows;
    },
    getOneById: async(idBriefing)=>{
        const result=await pool.query(`SELECT * FROM briefing WHERE idBriefing=${idBriefing}`);
        return result.rows[0];
    },
    createBriefing: async(nomBriefing, contenuBriefing, idManager)=>{
        const result=await pool.query(
            `INSERT INTO briefing(nomBriefing, contenuBriefing, idManager) VALUES ($1,$2,$3) RETURNING *`,
            [nomBriefing, contenuBriefing, idManager]
        );
        return result.rows[0];
    },

    updateBriefing: async (idBriefing, nomBriefing, contenuBriefing)=>{
        const result=await pool.query(
            `UPDATE briefing SET nomBriefing=$1, contenuBriefing=$2 WHERE idbriefing=$3 RETURNING *`,
            [nomBriefing,contenuBriefing,idBriefing]
        );
        return result.rows[0];
    },

    deleteBriefing: async(idBriefing)=>{
        const result=await pool.query(`DELETE FROM briefing WHERE idbriefing=$1`,[idBriefing]);
        return result.rowCount > 0;
    }
}