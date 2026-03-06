# 🎯 Guess the Number

Un petit jeu de devinette quotidien fait en HTML, CSS et JavaScript vanilla.

---

## 🕹️ Comment jouer

1. Chaque jour, le site choisit **un nombre secret entre 1 et 100**
2. Entre ton estimation dans le champ et appuie sur **Guess** (ou `Entrée`)
3. Le site te dit si le nombre secret est **plus grand** ou **plus petit**
4. Continue jusqu'à trouver le bon nombre !
5. Le nombre change automatiquement le lendemain

---

## ✨ Fonctionnalités

- **Nombre du jour** — le même nombre pour tout le monde tout au long de la journée, généré et sauvegardé via `localStorage`
- **Feedback instantané** — message coloré indiquant si c'est trop bas ou trop haut
- **Historique des tentatives** — chaque essai est affiché avec une icône ↑ ↓ ✓
- **Désactivation en cas de victoire** — le jeu se verrouille dès que le nombre est trouvé
- **Design responsive** — fonctionne sur mobile et desktop

---

## 🗂️ Structure du projet

```
Guess-the-number/
├── index.html   # Structure de la page
├── style.css    # Styles et animations
├── script.js    # Logique du jeu
└── README.md
```

---

## 🛠️ Technologies

| Technologie       | Utilisation                       |
| ----------------- | --------------------------------- |
| HTML5             | Structure de la page              |
| CSS3              | Styles, animations, glassmorphism |
| JavaScript (ES6+) | Logique du jeu, localStorage      |
| Google Fonts      | Police _Space Grotesk_ & _Syne_   |
