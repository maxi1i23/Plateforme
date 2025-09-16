const pool = require('../db/db');

module.exports = {

  // Créer une activité et mettre à jour la performance
  createActiviter: async (nbAppelle, pauses, dureeAppelle, dateActiviter, idAgent) => {
    // Calculer semaine et mois
    const date = new Date(dateActiviter);
    const semaine = Math.ceil(date.getDate() / 7);
    const mois = date.getMonth() + 1;

    // Vérifier si une performance existe déjà
    let perfResult = await pool.query(
      'SELECT * FROM performance WHERE idAgent=$1 AND semaine=$2 AND mois=$3',
      [idAgent, semaine, mois]
    );

    let idPerformance;
    if (perfResult.rows.length > 0) {
      idPerformance = perfResult.rows[0].idperformance;
    } else {
      // Créer une nouvelle performance
      const insertPerf = await pool.query(
        'INSERT INTO performance(semaine, mois, productiviter, idAgent) VALUES($1, $2, 0, $3) RETURNING *',
        [semaine, mois, idAgent]
      );
      idPerformance = insertPerf.rows[0].idperformance;
    }

    // Insérer l'activité
    const activiteResult = await pool.query(
      'INSERT INTO activiter(nbAppelle, pauses, dureeAppelle, dateActiviter, idAgent, idPerformance) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [nbAppelle, pauses, dureeAppelle, dateActiviter, idAgent, idPerformance]
    );

    // Recalculer productiviter
    await module.exports.recalculatePerformance(idPerformance);

    return activiteResult.rows[0];
  },

  // Recalculer productiviter d'une performance
  recalculatePerformance: async (idPerformance) => {
    const totalActivites = await pool.query(
      'SELECT SUM(nbAppelle) as totalAppelle, SUM(dureeAppelle + pauses) as totalTemps FROM activiter WHERE idPerformance=$1',
      [idPerformance]
    );

    const { totalappelle, totaltemps } = totalActivites.rows[0];
    const productiviter = totaltemps > 0 ? totalappelle / totaltemps : 0;

    await pool.query(
      'UPDATE performance SET productiviter=$1 WHERE idPerformance=$2',
      [productiviter, idPerformance]
    );
  },

  // Récupérer toutes les activités d'un agent
  getActiviterByAgent: async (idAgent) => {
    const result = await pool.query(
      'SELECT * FROM activiter WHERE idAgent=$1 ORDER BY dateActiviter DESC',
      [idAgent]
    );
    return result.rows;
  },

  // Récupérer toutes les performances d'un agent
  getPerformanceByAgent: async (idAgent) => {
    const result = await pool.query(
      'SELECT * FROM performance WHERE idAgent=$1 ORDER BY mois DESC, semaine DESC',
      [idAgent]
    );
    return result.rows;
  },

  // Modifier une activité et recalculer la performance
  updateActiviter: async (idActiviter, nbAppelle, pauses, dureeAppelle, dateActiviter) => {
    // Mettre à jour l'activité
    const activiteResult = await pool.query(
      'UPDATE activiter SET nbAppelle=$1, pauses=$2, dureeAppelle=$3, dateActiviter=$4 WHERE idActiviter=$5 RETURNING *',
      [nbAppelle, pauses, dureeAppelle, dateActiviter, idActiviter]
    );

    if (activiteResult.rows.length > 0) {
      // Recalculer productiviter
      const idPerformance = activiteResult.rows[0].idperformance;
      await module.exports.recalculatePerformance(idPerformance);
    }

    return activiteResult.rows[0];
  },

  // Supprimer une activité et recalculer la performance
  deleteActiviter: async (idActiviter) => {
    // Récupérer idPerformance avant suppression
    const activite = await pool.query(
      'SELECT idPerformance FROM activiter WHERE idActiviter=$1',
      [idActiviter]
    );

    if (activite.rows.length === 0) return false;

    const idPerformance = activite.rows[0].idperformance;

    // Supprimer l'activité
    await pool.query(
      'DELETE FROM activiter WHERE idActiviter=$1',
      [idActiviter]
    );

    // Recalculer la performance
    await module.exports.recalculatePerformance(idPerformance);

    return true;
  }
};
