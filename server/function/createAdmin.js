const bcrypt = require("bcrypt");
const pool = require("./db/db");

async function createDefaultAdmin() {
  try {
    const result = await pool.query(
      "SELECT * FROM utilisateur WHERE roleutilisateur = 'Admin' LIMIT 1"
    );

    if (result.rows.length === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await pool.query(
        "INSERT INTO utilisateur (nomutilisateur, emailutilisateur, motdepasseutilisateur, roleutilisateur) VALUES ($1, $2, $3, $4)",
        ["Admin", "admin@successmdg.com", hashedPassword, "Admin"]
      );
      console.log("✅ Admin par défaut créé : admin@successmdg.com / admin123");
    } else {
      console.log("ℹ️ Admin déjà existant, aucune action.");
    }
  } catch (err) {
    console.error("Erreur lors de la création de l'admin par défaut :", err);
  }
}

module.exports = createDefaultAdmin;
