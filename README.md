```markdown
# 🧾 GestionVentes – Application Angular

Application de **gestion de clients et transactions** développée en **Angular 20** (CLI 19.2.17) dans le cadre du projet final de 5ème année.

---

## ✨ Fonctionnalités

### 👨‍💼 **Admin**
- Créer des clients et gérer leurs informations.  
- Ajouter, modifier et supprimer des transactions.

### 👤 **Clients**
- Se connecter avec leurs identifiants.  
- Consulter uniquement leurs transactions personnelles.

---

## 🛠️ **Installation & Lancement**

### 1️⃣ Cloner le projet
```bash
git clone <url-du-repo>
cd GestionVentes
```

### 2️⃣ Installer les dépendances
```bash
npm install
```

### 3️⃣ Lancer l’application
```bash
ng serve -o
```

➡️ L’application sera accessible sur [http://localhost:4200/](http://localhost:4200/)  
➡️ Le navigateur s’ouvrira automatiquement.

---

## 🔑 **Identifiants par défaut**

**Admin :**  
- Username : `admin`  
- Password : `admin`

> ⚡ L’admin peut créer de nouveaux clients avec un **email** et un **mot de passe**.  
> Ces identifiants permettent ensuite aux clients de se connecter et de voir leurs propres transactions.

---

## 📂 **Structure du projet**

```bash
src/app/
├── auth/                # Authentification & Guards
│   ├── login/           # Composant de login
│   ├── admin.guard.ts   # Protection Admin
│   └── auth.service.ts  # Service d’auth
│
├── features/
│   ├── clients/         # Gestion des clients
│   │   ├── clients.component.ts
│   │   ├── clients.service.ts
│   │   └── client.guard.ts
│   └── transactions/    # Gestion des transactions
│       ├── transactions.component.ts
│       └── transaction.service.ts
│
├── app.routes.ts        # Définition des routes (guards inclus)
├── app.config.ts        # Configuration globale
└── app.component.ts     # Composant racine
```

---

## ✅ **Fonctionnalités Implémentées**

### 🔐 Authentification & Autorisation
- Login **admin** & **client**  
- Guards : `AdminGuard`, `ClientGuard`  
- Persistance de session via **localStorage**

### 📝 Gestion des Clients (Admin)
- CRUD complet (création, liste, suppression)  
- Formulaire réactif avec validations (email, SIRET, téléphone)

### 💳 Transactions
- **Admin** : ajout / modification / suppression  
- **Client** : consultation de ses transactions uniquement  
- Calcul automatique du **solde** via Angular **Signals**

### ⚡ Gestion d’État
- Signals `writable` et `computed`  
- Réactivité instantanée de l’interface

### 🎨 Interface Utilisateur
- **Tailwind CSS** pour le design  
- Responsive design (desktop & mobile)  
- Feedback utilisateur (messages de succès, erreurs)

---

## 📌 **Technologies utilisées**

- Angular 20  
- TypeScript  
- Tailwind CSS  
- Angular Signals  
- LocalStorage

---

## 👨‍💻 **Auteur**

Projet réalisé par **Othmane Haddouche** – 5ème année d’ingénierie.
```
