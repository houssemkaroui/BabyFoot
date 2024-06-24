# BabyFoot Manager

## Installation

1. Accédez au répertoire : `cd BabyFoot`
2. Installez les dépendances : `npm install`
3. Configurez votre base de données PostgreSQL dans `db.js`.
4. Créez la base de données et les tables nécessaires dans PostgreSQL :
5. Accédez à ` http://localhost:3000/`

# Démarrez le service PostgreSQL
sudo service postgresql start

# Connectez-vous en tant qu'utilisateur postgres
sudo -i -u postgres

# Lancez psql
psql

# Créez un utilisateur avec un mot de passe
CREATE USER myuser WITH PASSWORD 'mypassword';

# Accordez tous les privilèges sur la base de données babyfoot à l'utilisateur créé
GRANT ALL PRIVILEGES ON DATABASE babyfoot TO myuser;

# Quittez psql
\q

# Modifiez la configuration de pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Redémarrez le service PostgreSQL
sudo service postgresql restart


# Création de base et de table
```sql
-- Créez la base de données
CREATE DATABASE IF NOT EXISTS babyfoot;

-- Connectez-vous à la base de données
\c babyfoot

-- Créez la table games
CREATE TABLE  IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

