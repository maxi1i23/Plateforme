const pool = require('../db/db');
const path = require("path");

module.exports = {
    getAllMessages: async () => {
        const messages = await pool.query(
            `SELECT m.*, json_agg(f.*) AS fichiers 
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
        SELECT m.*, 
        COALESCE(json_agg(f.*) FILTER (WHERE f.idmessage IS NOT NULL), '[]') AS fichiers,
        u.nomutilisateur
        FROM message m
        LEFT JOIN fichiermessage f ON f.idmessage = m.idmessage
        JOIN utilisateur u ON u.idutilisateur = m.idutilisateurexpediteur
        LEFT JOIN messageSupprimer s 
            ON s.idMessage = m.idMessage AND s.idUtilisateur = $1
        WHERE (
            (m.idutilisateurexpediteur = $1 AND m.idutilisateurrecepteur = $2)
            OR (m.idutilisateurexpediteur = $2 AND m.idutilisateurrecepteur = $1)
        )
        AND s.idMessage IS NULL  -- <-- uniquement les messages non supprimés par $1
        GROUP BY m.idmessage, u.nomutilisateur
        ORDER BY m.datemessage ASC;


    `;
        const result = await pool.query(query, [userId1, userId2]);
        return result.rows;
    },
    getMessagesGroup: async (userId1, idGroupe) => {
        const query = `
        SELECT m.*, 
        COALESCE(json_agg(f.*) FILTER (WHERE f.idmessage IS NOT NULL), '[]') AS fichiers,
        u.nomutilisateur
        FROM message m
        LEFT JOIN fichiermessage f ON f.idmessage = m.idmessage
        LEFT JOIN messageSupprimer s 
            ON s.idMessage = m.idMessage AND s.idUtilisateur = $1
        JOIN utilisateur u ON u.idutilisateur = m.idutilisateurexpediteur
        WHERE m.idGroupe = $2
        AND s.idMessage IS NULL   -- <-- uniquement les messages non supprimés par l'utilisateur
        GROUP BY m.idmessage, u.nomutilisateur
        ORDER BY m.datemessage ASC;

    `;
        const result = await pool.query(query, [userId1, idGroupe]);
        return result.rows;
    },
    getMessageById: async (id) => {
        const messages = await pool.query(
            `SELECT m.*, json_agg(f.*) AS fichiers 
            FROM message m LEFT JOIN fichiermessage f ON f.idmessage = m.idmessage 
            WHERE m.idutilisateurrecepteur = $1 
            GROUP BY m.idmessage 
            ORDER BY m.datemessage ASC;`, [id]
        );
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

    createMessage: async (contenuMessage, idUtilisateurExpediteur, idUtilisateurRecepteur, idGroupe) => {
        const etat = false
        const newMessage = await pool.query(
            'INSERT INTO message(contenuMessage, etat, idUtilisateurExpediteur, idUtilisateurRecepteur, idGroupe) VALUES($1,$2,$3,$4, $5) RETURNING *',
            [contenuMessage, etat, idUtilisateurExpediteur, idUtilisateurRecepteur, idGroupe]
        );
        return newMessage.rows[0];
    },

    updateMessage: async (idUtilisateurRecepteur) => {
        const updateMessage = await pool.query(
            'UPDATE message SET etat=TRUE WHERE idUtilisateurRecepteur=$1 RETURNING *',
            [idUtilisateurRecepteur]
        );
        return updateMessage.rows[0];
    },

    deleteMessage: async (idMessage) => {
        const deleteMessage = await pool.query('DELETE FROM message WHERE idMessage=$1', [
            idMessage
        ]);
        return deleteMessage.rowCount > 0;
    },

    suppressionMessage: async (idMessage, idUtilisateur) => {
        const suppressionMessage = await pool.query(`INSERT INTO messageSupprimer(idMessage, idUtilisateur) VALUES ($1, $2) RETURNING *`, [idMessage, idUtilisateur])
        return suppressionMessage.rows;
    },

    lastMessageUser: async (idUtilisateurExpediteur) => {
        const lastMessage = await pool.query(`
            SELECT m.*
            FROM message m
            WHERE m.idmessage IN (
                SELECT DISTINCT ON (
                    CASE
                        WHEN idutilisateurexpediteur = $1 THEN idutilisateurrecepteur
                        ELSE idutilisateurexpediteur
                    END
                ) m2.idmessage
                FROM message m2
                LEFT JOIN messagesupprimer ms
                    ON m2.idmessage = ms.idmessage AND ms.idutilisateur = $1
                WHERE (m2.idutilisateurexpediteur = $1 OR m2.idutilisateurrecepteur = $1)
                AND ms.idmessage IS NULL
                ORDER BY 
                    CASE
                        WHEN idutilisateurexpediteur = $1 THEN idutilisateurrecepteur
                        ELSE idutilisateurexpediteur
                    END,
                    m2.datemessage DESC
            )
            ORDER BY datemessage DESC;

            `, [idUtilisateurExpediteur])
        return lastMessage.rows
    },

    lastMessageGroupe: async (idUtilisateurExpediteur) => {
        const lastMessage = await pool.query(`
            SELECT *
            FROM (
            SELECT m.*,
           ROW_NUMBER() OVER (
               PARTITION BY m.idgroupe 
               ORDER BY m.datemessage DESC
           ) AS rn
            FROM message m
            JOIN groupeMembre gm 
            ON m.idgroupe = gm.idGroupe
            LEFT JOIN messagesupprimer ms
            ON m.idmessage = ms.idmessage AND ms.idutilisateur = $1
            WHERE gm.idUtilisateur = $1
            AND ms.idmessage IS NULL
            AND m.idgroupe IS NOT NULL
            ) sub
            WHERE rn = 1
            ORDER BY datemessage DESC;
            `, [idUtilisateurExpediteur])
        return lastMessage.rows
    },
    getUnreadCount: async (idUtilisateur) => {
        const result = await pool.query(`
            SELECT COUNT(*) AS unread_count
            FROM message m
            LEFT JOIN messageSupprimer ms
              ON m.idMessage = ms.idMessage AND ms.idUtilisateur = $1
            WHERE (m.idUtilisateurRecepteur = $1 OR m.idGroupe IN (
                      SELECT idGroupe
                      FROM groupeMembre
                      WHERE idUtilisateur = $1
                  ))
              AND ms.idMessage IS NULL
              AND m.etat = FALSE;
        `, [idUtilisateur]);
        return result.rows[0].unread_count;
    }
}