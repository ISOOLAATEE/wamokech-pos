# ☕ Wamokech - Système POS (Coffee Shop POS)

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E)

## 📖 À propos du projet (Overview)
Wamokech est une application web de Point de Vente (POS) développée pour la gestion complète d'un café. Entièrement construite avec HTML, CSS et JavaScript Vanilla, elle fonctionne de manière autonome dans le navigateur sans nécessiter de backend externe, grâce à une utilisation avancée de l'API Web Storage.

## 🔑 Accès Démo (Demo Access)
Pour tester l'application, l'authentification est requise. Utilisez les identifiants codés en dur :
* **Nom d'utilisateur :** `chakir`
* **Mot de passe :** `123`

## ✨ Fonctionnalités Principales (Key Features)
* **Tableau de Bord Dynamique :** Suivi en temps réel des ventes du jour (en MAD), de la valeur moyenne des commandes, et de l'article le plus populaire.
* **Caisse et Paiement :** Gestion des paiements en espèces (avec calcul automatique de la monnaie à rendre) ou par carte. Permet l'application de remises (en % ou montant fixe) et la gestion des commandes sur place (tables) ou à emporter.
* **Reçus et Factures :** Génération automatique de reçus avec options d'impression (`window.print()`) et de téléchargement (.txt). Exportation de l'historique complet des factures au format CSV.
* **Gestion d'Inventaire :** Suivi des stocks avec alertes automatiques lorsque les articles (ex: Grains de café, Lait, Gobelets) atteignent leur seuil critique.
* **Base de Données Clients :** Enregistrement des clients fidèles avec suivi automatique de leur historique de commandes et du total dépensé.
* **Menu CRUD :** Interface d'administration pour ajouter, modifier ou supprimer des articles du menu avec prise en charge des images encodées en base64 via `FileReader`.

## 💻 Architecture Technique (Tech Stack)
* **Interface (UI) :** HTML5, CSS3, et icônes FontAwesome pour une expérience utilisateur moderne et responsive.
* **Logique Métier :** JavaScript Vanilla gérant le panier, les calculs de taxes/remises, et le filtrage dynamique.
* **Persistance des Données :** Utilisation de `localStorage` pour sauvegarder l'historique des commandes, l'inventaire, les clients et les articles du menu entre les sessions.
* **Exportation de données :** Génération de fichiers CSV et de reçus texte à la volée via des objets JavaScript `Blob`.

## 🚀 Installation (Getting Started)
L'application s'exécute entièrement côté client.
1. Clonez ce dépôt sur votre machine locale.
2. Ouvrez le fichier `index.html` dans n'importe quel navigateur web moderne.
