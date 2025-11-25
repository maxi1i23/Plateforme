CREATE DATABASE plateforme;

CREATE TABLE utilisateur (
    idUtilisateur SERIAL PRIMARY KEY,
    nomUtilisateur VARCHAR(100) NOT NULL,
    emailUtilisateur VARCHAR(100) UNIQUE NOT NULL,
    motDePasseUtilisateur VARCHAR(255) NOT NULL,
    dateInscription TIMESTAMP DEFAULT now(),
    roleUtilisateur VARCHAR(10) NOT NULL CHECK (roleUtilisateur IN ('Admin', 'Manager', 'Agent'))
);

CREATE TABLE formation(
    idFormation SERIAL PRIMARY KEY,
    nomFormation VARCHAR(50) NOT NULL,
    descriptionFormation TEXT NOT NULL,
    dateFormation TIMESTAMP DEFAULT now(),
    idUtilisateurManager INTEGER REFERENCES utilisateur(idUtilisateur) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE briefing(
    idBriefing SERIAL PRIMARY KEY,
    nomBriefing VARCHAR(50) NOT NULL,
    contenuBriefing TEXT NOT NULL,
    dateBriefing TIMESTAMP DEFAULT now(),
    idManager INTEGER REFERENCES utilisateur(idUtilisateur) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE notification(
    idNotification SERIAL PRIMARY KEY,
    contenu TEXT NOT NULL,
    dateNotification TIMESTAMP DEFAULT now(),
    statut BOOLEAN DEFAULT FALSE,
    raisonNotification VARCHAR(255),
    idUtilisateurDestinataire INTEGER REFERENCES utilisateur(idUtilisateur) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE autreDemande(
    idAutreDemande SERIAL PRIMARY KEY,
    nomAutreDemande VARCHAR(50) NOT NULL,
    descriptionAutreDemande TEXT NOT NULL,
    dateCreationAutreDemande TIMESTAMP DEFAULT NOW(),
    dateDemande DATE NOT NULL,
    statutAutreDemande VARCHAR(50),
    idAgentAutreDemande INTEGER REFERENCES utilisateur(idUtilisateur) ON DELETE CASCADE ON UPDATE CASCADE,
    idManagerTraiterAutreDemande INTEGER REFERENCES utilisateur(idUtilisateur) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE demandeConger(
    idDemandeConger SERIAL PRIMARY KEY,
    typeConger VARCHAR(50) NOT NULL,
    dateDebutConger DATE NOT NULL,
    dateFinConger DATE NOT NULL,
    statutConger VARCHAR(50),
    idAgentDemander INTEGER REFERENCES utilisateur(idUtilisateur) ON DELETE CASCADE ON UPDATE CASCADE,
    idManagerTraiter INTEGER REFERENCES utilisateur(idUtilisateur) ON DELETE CASCADE ON UPDATE CASCADE,
    dateCreationDemandeConger TIMESTAMP DEFAULT now(),
    CONSTRAINT chk_dates CHECK (dateDebutConger > dateCreationDemandeConger),
    CONSTRAINT chk_dates_finConger CHECK (dateFinConger > dateDebutConger)
);

CREATE TABLE performance(
    idPerformance SERIAL PRIMARY KEY,
    semaine INTEGER,
    mois INTEGER,
    productiviter FLOAT,
    idAgent INTEGER REFERENCES utilisateur(idUtilisateur) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE activiter(
    idActiviter SERIAL PRIMARY KEY,
    nbAppelle INTEGER NOT NULL,
    pauses INTEGER NOT NULL,
    dureeAppelle FLOAT NOT NULL,
    dateActiviter DATE DEFAULT CURRENT_DATE,
    idAgent INTEGER REFERENCES utilisateur(idUtilisateur) ON DELETE CASCADE ON UPDATE CASCADE,
    idPerformance INTEGER REFERENCES performance(idPerformance) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE groupe (
    idGroupe SERIAL PRIMARY KEY,
    nomGroupe VARCHAR(100) NOT NULL,
    dateCreation TIMESTAMP DEFAULT now(),
    idUtilisateurCreateur INTEGER REFERENCES utilisateur(idUtilisateur) ON DELETE SET NULL
);

CREATE TABLE message (
    idMessage SERIAL PRIMARY KEY,
    contenuMessage TEXT,
    dateMessage TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    etat BOOLEAN DEFAULT FALSE, 
    idUtilisateurExpediteur INTEGER REFERENCES utilisateur(idUtilisateur) ON DELETE CASCADE ON UPDATE CASCADE,
    idUtilisateurRecepteur INTEGER REFERENCES utilisateur(idUtilisateur) ON DELETE CASCADE ON UPDATE CASCADE,
    idGroupe INT REFERENCES groupe(idGroupe) ON DELETE CASCADE
);

CREATE TABLE fichierMessage (
    idFichier SERIAL PRIMARY KEY,
    nomFichier VARCHAR(255) NOT NULL,
    urlFichier TEXT NOT NULL, 
    typeFichier VARCHAR(50),  
    idMessage INTEGER REFERENCES message(idMessage) ON DELETE CASCADE ON UPDATE CASCADE
); 

CREATE TABLE groupeMembre (
    idMembre SERIAL PRIMARY KEY,
    idGroupe INT NOT NULL REFERENCES groupe(idGroupe) ON DELETE CASCADE,
    idUtilisateur INT NOT NULL REFERENCES utilisateur(idUtilisateur) ON DELETE CASCADE,
    dateAjout TIMESTAMP DEFAULT now(),
    UNIQUE(idGroupe, idUtilisateur) 
);

CREATE TABLE messageSupprimer (
    idMessageSupprimer SERIAL PRIMARY KEY,
    idMessage INTEGER REFERENCES message(idMessage) ON DELETE CASCADE ON UPDATE CASCADE,
    idUtilisateur INTEGER REFERENCES utilisateur(idUtilisateur) ON DELETE CASCADE ON UPDATE CASCADE,
    dateSuppression TIMESTAMP DEFAULT now()
);

CREATE TABLE avisBriefing (
  idAvis SERIAL PRIMARY KEY,
  idBriefing INT REFERENCES briefing(idBriefing) ON DELETE CASCADE ON UPDATE CASCADE,
  idUtilisateurAvis INT REFERENCES utilisateur(idUtilisateur) ON DELETE CASCADE ON UPDATE CASCADE,
  commentaire TEXT,
  dateAvis TIMESTAMP DEFAULT now()
);