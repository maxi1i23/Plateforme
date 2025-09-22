const pool = require('../db/db');

module.exports = {
    getAllMessages: async () => {
        const messages = await pool.query('SELECT * FROM message ORDER BY dateMessage DESC');
        return messages.rows;
    },
    getMessageById: async (id) => {
        const messages = await pool.query('SELECT * FROM message WHERE idutilisateurrecepteur=$1', [id]);
        return messages.rows;
    },

    createMessage: async (contenuMessage, idUtilisateurExpediteur, idUtilisateurRecepteur) => {
        const etat = false
        const newMessage = await pool.query(
            'INSERT INTO message(contenuMessage, etat, idUtilisateurExpediteur, idUtilisateurRecepteur) VALUES($1,$2,$3,$4) RETURNING *',
            [contenuMessage, etat, idUtilisateurExpediteur, idUtilisateurRecepteur]
        );
        return newMessage.rows[0];
    },

    updateMessage: async ( idMessage, contenuMessage) => {
        const updateMessage = await pool.query(
            'UPDATE message SET contenuMessage=$1 WHERE idMessage=$2 RETURNING *',
            [contenuMessage, idMessage]
        );
        return updateMessage.rows[0];
    },

    deleteMessage: async (idMessage) => {
        const deleteMessage = await pool.query('DELETE FROM message WHERE idMessage=$1', [
            idMessage
        ]);
        return deleteMessage.rowCount > 0;
    }
}