# 🤖 Guess the Number — Discord Bot Setup

Bot Discord multi-serveurs avec classement, stats et jeu quotidien.

---

## 📋 Prérequis

- [Node.js](https://nodejs.org/) **v18 ou supérieur**
- Un compte Discord
- Git (optionnel)

---

## 🔧 Étape 1 — Créer l'application Discord

1. Aller sur [discord.com/developers/applications](https://discord.com/developers/applications)
2. Cliquer sur **New Application**, donner un nom (ex: `Guess the Number`)
3. Dans le menu **Bot** (colonne gauche) :
   - Cliquer sur **Reset Token** → copier le token (tu en auras besoin plus tarde)
   - Activer **Public Bot** si tu veux que d'autres serveurs puissent l'ajouter
4. Dans le menu **OAuth2** → **General** :
   - Copier ton **Client ID** (tu en auras besoin aussi)

---

## 🔑 Étape 2 — Configurer le fichier .env

Dans le dossier `discord-bot/`, copier `.env.example` en `.env` :

```bash
cp .env.example .env
```

Remplir les valeurs :

```env
TOKEN=ton_token_ici
CLIENT_ID=ton_client_id_ici
```

---

## 📦 Étape 3 — Installer les dépendances

```bash
cd discord-bot
npm install
```

---

## 🚀 Étape 4 — Enregistrer les commandes slash

Cette commande enregistre `/guess`, `/stats`, `/leaderboard`, `/info`, `/reset` auprès de Discord :

```bash
npm run deploy
```

> ⚠️ Les commandes globales peuvent prendre jusqu'à **1 heure** pour apparaître dans tous les serveurs. Pour un test instantané, voir la section "Avancé" ci-dessous.

---

## ▶️ Étape 5 — Lancer le bot

```bash
npm start
```

Tu devrais voir :

```
✅ Logged in as Guess the Number#1234
📡 Serving 0 server(s)
```

---

## 🔗 Étape 6 — Inviter le bot sur ton serveur

Remplace `YOUR_CLIENT_ID` par ton **Client ID** dans ce lien :

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=18432&scope=bot%20applications.commands
```

Permissions accordées : **Send Messages** + **Embed Links** (minimum requis).

---

## 🎮 Commandes disponibles

| Commande              | Description                               |
| --------------------- | ----------------------------------------- |
| `/guess <number>`     | Proposer un nombre (1–100)                |
| `/stats [player]`     | Voir les stats d'un joueur                |
| `/leaderboard [type]` | Classement (wins / best score / today)    |
| `/info`               | Infos du jeu du jour + compte à rebours   |
| `/reset`              | Réinitialiser la partie (Admin seulement) |

---

## ☁️ Héberger le bot en ligne (pour qu'il tourne 24/7)

### Option A — Railway (recommandé, gratuit au départ)

1. Créer un compte sur [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Sélectionner ton repo
4. Dans **Settings** → **Root Directory** : mettre `discord-bot`
5. Dans **Variables** : ajouter `TOKEN` et `CLIENT_ID`
6. Dans **Settings** → **Start Command** : `node bot.js`
7. Deployer ✅

### Option B — Render (gratuit)

1. Créer un compte sur [render.com](https://render.com)
2. **New** → **Web Service** → connecter ton repo GitHub
3. **Root Directory** : `discord-bot`
4. **Build Command** : `npm install`
5. **Start Command** : `node bot.js`
6. Ajouter les variables d'environnement `TOKEN` et `CLIENT_ID`
7. Choisir **Free** plan → Deploy ✅

### Option C — VPS (Debian/Ubuntu)

```bash
# Installer Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Cloner le repo et installer
git clone https://github.com/TON_USER/Guess-the-number.git
cd Guess-the-number/discord-bot
npm install

# Configurer .env
cp .env.example .env
nano .env  # remplir TOKEN et CLIENT_ID

# Enregistrer les commandes
npm run deploy

# Lancer avec PM2 (pour garder actif après déconnexion)
npm install -g pm2
pm2 start bot.js --name "guess-bot"
pm2 save
pm2 startup
```

---

## ⚙️ Avancé — Commandes instantanées (pour un serveur de test)

Pour éviter l'attente d'1h, tu peux enregistrer les commandes seulement sur un serveur spécifique.

Dans `deploy-commands.js`, remplacer :

```js
await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
  body: commands,
});
```

par :

```js
await rest.put(
  Routes.applicationGuildCommands(process.env.CLIENT_ID, "TON_GUILD_ID"),
  { body: commands },
);
```

Les commandes apparaissent **instantanément** sur ce serveur.

---

## 📁 Structure des fichiers

```
discord-bot/
├── bot.js                  # Point d'entrée du bot
├── deploy-commands.js      # Enregistrement des commandes slash
├── package.json
├── .env                    # Secrets (ne pas commit !)
├── .env.example            # Template
├── .gitignore
├── commands/
│   ├── guess.js            # /guess
│   ├── stats.js            # /stats
│   ├── leaderboard.js      # /leaderboard
│   ├── info.js             # /info
│   └── reset.js            # /reset (admin)
├── utils/
│   ├── db.js               # Lecture/écriture JSON
│   └── game.js             # Logique du jeu
└── data/
    └── db.json             # Données (auto-créé, ne pas commit)
```
