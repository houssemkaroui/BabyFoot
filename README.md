# BabyFoot Manager

## Installation

1. Clonez le dépôt : `git clone <URL>`
2. Accédez au répertoire : `cd BabyFootManager`
3. Installez les dépendances : `npm install`
4. Configurez votre base de données PostgreSQL dans `db.js`.
5. Créez la base de données et les tables nécessaires dans PostgreSQL :


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

# Modifiez les lignes appropriées comme indiqué ci-dessus

# Redémarrez le service PostgreSQL
sudo service postgresql restart

# Quittez l'utilisateur postgres
exit

```sql
-- Créez la base de données
CREATE DATABASE babyfoot;

-- Connectez-vous à la base de données
\c babyfoot

-- Créez la table games
CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
