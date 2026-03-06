# 🎯 Guess the Number

Un jeu de devinette quotidien — chaque jour, un nombre secret entre 1 et 100 est choisi. Trouve-le en le moins d'essais possible !

---

## 🌐 Site Web

Jeu jouable directement dans le navigateur, sans installation. Ouvre simplement `index.html`.

- Nombre du jour unique, sauvegardé via `localStorage`
- Feedback instantané (trop haut / trop bas) avec historique des essais
- Design responsive avec animations

**Stack :** HTML5 · CSS3 · JavaScript vanilla · Google Fonts

---

## 🤖 Bot Discord

Version Discord du jeu avec classement, stats par joueur et support multi-serveurs.

- Commandes : `/guess`, `/stats`, `/leaderboard`, `/info`, `/reset`
- Nombre quotidien unique par serveur
- Persistance des données en JSON

**Stack :** Node.js · discord.js v14

> Les instructions d'installation du bot se trouvent dans `discord-bot/`.
