# 💬 Plateforme de Messagerie et Gestion Interne

## 🧩 Présentation

Cette application est une **plateforme de communication interne** développée avec **React** (frontend) et **Express.js** (backend), connectée à une base de données **PostgreSQL**.  
Elle permet la **messagerie en temps réel**, la **gestion des utilisateurs par rôle (Admin/Utilisateur)**, et l’envoi de **fichiers** dans les conversations.  
Le système est conçu pour être **sécurisé**, **rapide** et **responsive**, avec une interface moderne respectant les **règles IHM**.

---

## 🚀 Fonctionnalités principales

### 🔐 Authentification et gestion des utilisateurs
- Connexion et déconnexion sécurisées avec stockage de session.
- Seul **l’Administrateur** peut :
  - Créer un compte utilisateur.
  - Modifier les informations et le mot de passe d’un utilisateur.
  - Supprimer un compte.
- En cas d’oubli de mot de passe :
  - L’utilisateur doit **contacter l’administrateur** pour réinitialiser son mot de passe.

---

### 💬 Messagerie instantanée
- Envoi et réception de messages entre utilisateurs connectés.
- Gestion des discussions privées (user-to-user).
- Suppression des messages (selon permissions).
- Messages affichés avec distinction visuelle **expéditeur/récepteur**.
- Indicateurs d’envoi et état de lecture (optionnel).

---

### 📎 Gestion des fichiers
- Envoi de fichiers via le bouton **📎 (Paperclip)**.
- Affichage clair des fichiers joints (images, PDF, documents...).
- Téléchargement ou prévisualisation des fichiers.
- Vérification du type et de la taille avant l’envoi.

---

### 👥 Gestion des rôles et profils
- **Admin :**
  - Gère la création, modification et suppression des comptes.
  - Peut consulter les activités des utilisateurs.
- **Utilisateur :**
  - Peut envoyer et recevoir des messages.
  - Peut modifier ses informations de profil (hors mot de passe).

---

### 🌙 Interface utilisateur (UI/UX)
- Design moderne avec **TailwindCSS**.
- Support du **mode sombre / clair** automatique selon les préférences du navigateur.
- Interface responsive compatible **desktop / tablette / mobile**.
- Animation fluide des composants (framer-motion).

---

### 🔔 Notifications
- Notification visuelle pour les nouveaux messages entrants.
- Indicateur de présence (en ligne / hors ligne).
- Mise à jour automatique sans rechargement de la page.

---

### 🧱 Architecture technique

#### Frontend
- **Framework :** React + Vite
- **Librairies :**
  - TailwindCSS (design réactif)
  - Lucide-react (icônes)
  - SweetAlert2 (boîtes de dialogue)
  - Axios (requêtes API)
  - Context API (authentification)
  - Socket.IO client (communication temps réel)

#### Backend
- **Framework :** Express.js
- **Base de données :** PostgreSQL (via `pg` Pool)
- **Authentification :** JWT ou session (selon configuration)
- **Téléversement de fichiers :** Multer
- **Communication temps réel :** Socket.IO

---

### 🗃️ Schéma simplifié de la base de données

#### Table `utilisateur`
| Colonne              | Type         | Description |
|----------------------|--------------|--------------|
| idutilisateur        | SERIAL PK    | Identifiant unique |
| nomutilisateur       | VARCHAR(100) | Nom d'utilisateur |
| motdepasse           | TEXT         | Mot de passe (haché) |
| role                 | VARCHAR(20)  | 'admin' ou 'user' |
| statut               | BOOLEAN      | En ligne / Hors ligne |

#### Table `message`
| Colonne                   | Type          | Description |
|---------------------------|---------------|--------------|
| idmessage                 | SERIAL PK     | Identifiant du message |
| idutilisateurexpediteur   | INTEGER FK    | Utilisateur qui envoie |
| idutilisateurrecepteur    | INTEGER FK    | Utilisateur qui reçoit |
| contenu                   | TEXT          | Contenu du message |
| fichier                   | TEXT (option) | Nom du fichier joint |
| dateenvoi                 | TIMESTAMP     | Date et heure d’envoi |

---

<img width="1910" height="982" alt="Capture" src="https://github.com/user-attachments/assets/27b5f21d-627c-4339-8f7a-fd88d42f892d" />
<img width="1920" height="972" alt="1" src="https://github.com/user-attachments/assets/f947846f-e91f-4ab8-8109-b3d49a37837f" />
<img width="1887" height="986" alt="2" src="https://github.com/user-attachments/assets/7d3c8d75-34aa-4090-a3c2-63bceff4c117" />
