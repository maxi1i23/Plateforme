const pool = require('../db/db');

module.exports = {
    getAllNotifications: async () => {
        const notifications = await pool.query('SELECT * FROM notification ORDER BY datenotification DESC');
        return notifications.rows;
    },

    getOneNotification : async (id) => {
        const notification = await pool.query('SELECT * FROM notification WHERE idnotification = $1', [id]);
        return notification.rows[0];
    },

    createNotification : async (contenu, raisonNotification, idUtilisateurDestinataire) => {
        const newNotification = await pool.query('INSERT INTO notification (contenu, raisonNotification, idUtilisateurDestinataire) VALUES ($1,$2,$3) RETURNING *',[contenu, raisonNotification, idUtilisateurDestinataire]);
        return newNotification.rows[0];
    },

    updateNotification: async (id, contenu, raisonNotification, idUtilisateurDestinataire) => {
        const updatedNotification = await pool.query('UPDATE notification SET contenu=$1, raisonNotification=$2, idUtilisateurDestinataire=$3 WHERE idNotification = $4 RETURNING *',[contenu, raisonNotification,idUtilisateurDestinataire,id]);
        return updatedNotification.rows[0];
    },

    deleteNotification: async (id) => {
        const result = await pool.query('DELETE FROM notification WHERE idNotification = $1 RETURNING *', [id]);
        return result.rowCount > 0;
    }
}