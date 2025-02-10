# PWA Camera

## Description
PWA Camera est une application web progressive permettant d'accéder à diverses fonctionnalités d'un smartphone, notamment l'utilisation de l'appareil photo, la géolocalisation, l'appel téléphonique, la vibration, la gestion de la batterie et la validation OTP.

## Installation
### 1. Prérequis
- Node.js installé sur votre machine.
- Un navigateur compatible avec les PWA (Chrome, Edge, Firefox, etc.).

### 2. Installation du projet
1. Clonez le dépôt du projet :
   ```sh
   git clone https://github.com/Alanarex/typescript_camera.git
   ```
2. Accédez au dossier du projet :
   ```sh
   cd pwa-camera
   ```
3. Installez les dépendances :
   ```sh
   npm install
   ```
4. Démarrez l'application en mode développement :
   ```sh
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:5173/` (selon la configuration de Vite).

5. Pour générer une version optimisée en production :
   ```sh
   npm run build
   ```

## Fonctionnalités

### 1. 📸 Appareil Photo (`camera.tsx`)
- Active la caméra du smartphone.
- Capture des images et les sauvegarde en local.
- Permet la suppression des images.
- Génère une notification après chaque capture.

### 2. 📍 Géolocalisation (`geolocalisation.tsx`)
- Récupère la position GPS de l'utilisateur.
- Affiche la latitude, longitude et précision.
- Montre l'emplacement sur une carte interactive (Leaflet).
- Lien vers Google Maps pour afficher l'emplacement.
- Notification lors de la récupération de la position.

### 3. 📞 Appel Téléphonique (`phoneCall.tsx`)
- Permet de saisir un numéro de téléphone.
- Lance un appel via l'application téléphonique du smartphone.
- Affiche une notification et active une vibration lors de l'appel.

### 4. 🔋 Niveau de Batterie (`battery.tsx`)
- Affiche le pourcentage de batterie du téléphone.
- Change de couleur en fonction du niveau (vert, jaune, orange, rouge).

### 5. 📳 Vibration (`vibrator.tsx`)
- Active ou désactive la vibration du téléphone.
- Utilise l'API de vibration pour générer des vibrations à intervalles.

### 6. 🔢 Validation OTP (`otpValidation.tsx`)
- Permet d'entrer un numéro de téléphone français.
- Génère un code OTP et le remplit automatiquement si la WebOTP API est supportée.
- Vérifie la validité du code OTP.

## Déploiement en PWA
1. Dans le fichier `manifest.json`, configurez le `start_url` et les icônes pour correspondre à votre projet.
2. Ajoutez un service worker pour permettre l'installation en tant que PWA.
3. Pour tester la PWA en local, servez votre application avec un serveur HTTPS (ex: `vite preview`).

## Compatibilité
L'application fonctionne sur les navigateurs modernes supportant les API utilisées (Geolocation, MediaDevices, Vibration, WebOTP, Notifications). Pour tester certaines fonctionnalités, l'application doit être exécutée sur un appareil mobile.

## Auteurs
Développé par [Votre Nom] dans le cadre du projet PWA Camera.

