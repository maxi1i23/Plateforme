const pool = require('../db/db');
const path = require("path");

module.exports = {
    getAllMessages: async () => {
        const messages = await pool.query(`SELECT m.*, json_agg(f.*) AS fichiers
                                            FROM message m
                                            LEFT JOIN fichiermessage f ON f.idmessage = m.idmessage
                                            GROUP BY m.idmessage
                                            ORDER BY m.datemessage ASC;
        `);
        return messages.rows;
    },
    // Récupérer tous les messages entre deux utilisateurs
    getMessagesBetweenUsers: async (userId1, userId2) => {
        const query = `
      SELECT m.*, COALESCE(json_agg(f.*) FILTER (WHERE f.idmessage IS NOT NULL), '[]') AS fichiers
      FROM message m
      LEFT JOIN fichiermessage f ON f.idmessage = m.idmessage
      WHERE (m.idutilisateurexpediteur = $1 AND m.idutilisateurrecepteur = $2)
         OR (m.idutilisateurexpediteur = $2 AND m.idutilisateurrecepteur = $1)
      GROUP BY m.idmessage
      ORDER BY m.datemessage ASC
    `;
        const result = await pool.query(query, [userId1, userId2]);
        return result.rows;
    },
    getMessageById: async (id) => {
        const messages = await pool.query(`SELECT m.*, json_agg(f.*) AS fichiers
                                            FROM message m
                                            LEFT JOIN fichiermessage f ON f.idmessage = m.idmessage
                                            WHERE m.idutilisateurrecepteur = $1
                                            GROUP BY m.idmessage
                                            ORDER BY m.datemessage ASC;
                                            `, [id]);
        return messages.rows;
    },



    FichierMessage: {
        addFiles: async (idMessage, files) => {
            const queries = files.map(file => {
                const urlFichier = `/uploads/${path.basename(file.path)}`; // URL accessible depuis le navigateur
                return pool.query(
                    `INSERT INTO fichiermessage (nomfichier, urlfichier, typefichier, idmessage) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
                    [file.originalname, urlFichier, file.mimetype, idMessage]
                );
            });

            const results = await Promise.all(queries);
            return results.map(r => r.rows[0]);
        }
    }
    ,

    createMessage: async (contenuMessage, idUtilisateurExpediteur, idUtilisateurRecepteur) => {
        const etat = false
        const newMessage = await pool.query(
            'INSERT INTO message(contenuMessage, etat, idUtilisateurExpediteur, idUtilisateurRecepteur) VALUES($1,$2,$3,$4) RETURNING *',
            [contenuMessage, etat, idUtilisateurExpediteur, idUtilisateurRecepteur]
        );
        return newMessage.rows[0];
    },

    updateMessage: async (idMessage, contenuMessage) => {
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