const pool = require('../db/db');

module.exports = {
    add: async (idUtilisateur, idNotification) => {
        const result = await pool.query(`INSERT INTO userNotif(idUtilisateur, idNotification) VALUES ($1, $2) RETURNING *`,
            [idUtilisateur, idNotification]
        )
        return result.rows[0];
    },
    delete: async (idUserNotif) => {
        const result = await pool.query(`DELETE FROM userNotif WHERE idUserNotif=$1`,
            [idUserNotif]
        )
        return result.rowCount > 0;
    },
    query: async (idUtilisateur) => {
        const result = await pool.query(
            `SELECT n.*, un.idUserNotif, un.idutilisateur 
            FROM userNotif un
            JOIN notification n ON un.idNotification = n.idNotification 
            WHERE idUtilisateur=$1
            ORDER BY n.datenotification DESC`
            , [idUtilisateur])
        return result.rows;
    },
    count: async (idUtilisateur) => {
        const result = await pool.query(
            `SELECT COUNT(n.*) 
            FROM userNotif un
            JOIN notification n ON un.idNotification = n.idNotification 
            WHERE idUtilisateur=$1 AND un.statut=false`
            , [idUtilisateur])
        return result.rows[0];
    },
    updateStatut: async (idUtilisateur) => {
        const result = await pool.query(
            `UPDATE userNotif SET statut=true WHERE idUtilisateur=$1 RETURNING *`, [idUtilisateur]
        )
        return result.rows;
    }
}