CREATE DATABASE plateforme;

CREATE TABLE utilisateur (
    idUtilisateur SERIAL PRIMARY KEY,
    nomUtilisateur VARCHAR(100) NOT NULL,
    emailUtilisateur VARCHAR(100) UNIQUE NOT NULL,
    motDePasseUtilisateur VARCHAR(255) NOT NULL,
    dateInscription timestamp DEFAULT now(),
    roleUtilisateur VARCHAR(10) NOT NULL CHECK (roleUtilisateur IN ('Admin', 'Manager', 'Agent'))
);

CREATE TABLE message (
    idMessage SERIAL PRIMARY KEY,
    contenuMessage TEXT NOT NULL,
    dateMessage TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    etat BOOLEAN DEFAULT FALSE,
    idUtilisateurExpediteur INTEGER REFERENCES utilisateur(idUtilisateur),
    idUtilisateurRecepteur INTEGER REFERENCES utilisateur(idUtilisateur)
);

CREATE TABLE formation(
    idFormation SERIAL PRIMARY KEY,
    nomFormation VARCHAR(50) NOT NULL,
    descriptionFormation TEXT NOT NULL,
    dateFormation timestamp DEFAULT now(),
    
     INTEGER REFERENCES utilisateur(idUtilisateur)
);

CREATE TABLE briefing(
    idBriefing SERIAL PRIMARY KEY,
    nomBriefing VARCHAR(50) NOT NULL,
    contenuBriefing TEXT NOT NULL,
    dateBriefing timestamp DEFAULT now(),
    idManager INTEGER REFERENCES utilisateur(idUtilisateur)
);

CREATE TABLE notification(
    idNotification SERIAL PRIMARY KEY,
    contenu TEXT NOT NULL,
    dateNotification timestamp DEFAULT now(),
    statut BOOLEAN DEFAULT FALSE,
    raisonNotification VARCHAR(255),
    idUtilisateurDestinataire INTEGER REFERENCES utilisateur(idUtilisateur)
);


CREATE TABLE autreDemande(
    idAutreDemande SERIAL PRIMARY KEY,
    nomAutreDemande VARCHAR(50) NOT NULL,
    descriptionAutreDemande TEXT NOT NULL,
    dateCreationAutreDemande TIMESTAMP DEFAULT NOW(),
    dateDemande DATE NOT NULL,
    statutAutreDemande VARCHAR(50),
    idAgentAutreDemande INTEGER REFERENCES utilisateur(idUtilisateur),
    idManagerTraiterAutreDemande INTEGER REFERENCES utilisateur(idUtilisateur)
);

CREATE TABLE demandeConger(
    idDemandeConger SERIAL PRIMARY KEY,
    typeConger VARCHAR(50) NOT NULL,
    dateDebutConger DATE NOT NULL,
    dateFinConger DATE NOT NULL,
    statutConger VARCHAR(50),
    idAgentDemander INTEGER REFERENCES utilisateur(idUtilisateur),
    idManagerTraiter INTEGER REFERENCES utilisateur(idUtilisateur)
);

CREATE TABLE performance(
    idPerformance SERIAL PRIMARY KEY,
    semaine INTEGER,
    mois INTEGER,
    productiviter FLOAT,
    idAgent INTEGER REFERENCES utilisateur(idUtilisateur)
);

CREATE TABLE activiter(
    idActiviter SERIAL PRIMARY KEY,
    nbAppelle INTEGER NOT NULL,
    pauses INTEGER NOT NULL,
    dureeAppelle FLOAT NOT NULL,
    dateActiviter DATE NOT NULL,
    idAgent INTEGER REFERENCES utilisateur(idUtilisateur),
    idPerformance INTEGER REFERENCES performance(idPerformance)
);