const pool = require('../db/db');

module.exports = {
    add : async (idUtilisateur, idNotification) => {
        const result = await pool.query(`INSERT INTO userNotif(idUtilisateur, idNotification) VALUES ($1, $2) RETURNING *`, 
            [idUtilisateur, idNotification]
        )
        return result.rows[0];
    },
    delete : async (idUserNotif) => {
        const result = await pool.query(`DELETE FROM userNotif WHERE idUserNotif=$1`,
            [idUserNotif]
        )
        return result.rowCount > 0;
    },
    query : async (idUtilisateur) => {
        const result = await pool.query(`SELECT * FROM userNotif WHERE idUtilisateur=$1`, [idUtilisateur])
        return result.rows;
    }
}