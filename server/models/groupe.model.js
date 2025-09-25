const pool = require('../db/db');

module.exports = {
    createGroupe : async (nomGroupe)=> {
        const result = await pool.query(`INSERT INTO groupe (nomGroupe) VALUES ($1) RETURNING *`, [nomGroupe]);
        return result;
    },
    
    getGroupe: async () => {
        const result = await pool.query('SELECT * FROM groupe');
        return result;
    },

    updateGroupe: async (idGroupe, nomGroupe) => {
        const result = await pool.query(`UPDATE groupe SET nomGroupe=$2 WHERE idGroupe=$1 RETURNING *`,[idGroupe,nomGroupe]);
        return result;
    },
    
    deleteGroupe: async(idGroupe) => {
        const result = await pool.query(`DELETE FROM groupe WHERE idGroupe=$1 RETURNING *`, [idGroupe]);
        return result.rowCount > 0;
    }
}