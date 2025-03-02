# 📸 **PWA Camera - Installation et Utilisation**
### **Application TypeScript avec WebSockets et React**
Ce projet est une **Progressive Web App (PWA)** développée avec **TypeScript, React, WebSockets et Express.js**. Il permet de prendre des photos, gérer une galerie, discuter en temps réel et utiliser la localisation des utilisateurs.

---

## Tester l'application en ligne
Vous pouvez tester l'application **sans installation** via l'URL suivante :  
👉 **[Accéder à l'application (https://alaa.khalil.angers.mds-project.fr/typescript_camera)](https://alaa.khalil.angers.mds-project.fr/typescript_camera)**

**💡 Remarque :**  
- **Créez un compte** ou utilisez un compte existant pour tester la messagerie et la gestion des photos.  
- L'application fonctionne avec **WebSockets**, donc ouvrez **plusieurs onglets** pour voir les mises à jour en temps réel.  
- Si vous avez des problèmes, videz le cache (`Ctrl + Shift + R`).
  
---

## 🚀 **Installation Locale**
### **1️⃣ Prérequis**
Avant d'installer l'application, assurez-vous d'avoir :
- **Node.js** (version 18+ recommandée)
- **npm** (inclus avec Node.js)
- **Git** (facultatif, mais recommandé)

### **2️⃣ Cloner le projet**
```sh
git clone https://github.com/Alanarex/typescript_camera.git
cd typescript_camera
```

### **3️⃣ Installer les dépendances**
```sh
npm install
```

### **4️⃣ Configurer le fichier `.env`**
Créez un fichier **`.env`** à la racine du projet et ajoutez :
```ini
# Backend Configuration
PORT=8080

# Frontend URL (pour CORS et WebSocket)
VITE_FRONTEND_URL=http://localhost:5174/typescript_camera

# Backend URL
VITE_SERVER_URL=http://localhost:8080
VITE_WS_PROTOCOL=ws

# Préfixe des API (laisser vide si non utilisé)
VITE_API_PREFIX=/typescript_camera
```
**💡 Astuce :** Si vous exécutez le frontend sur un autre port, adaptez `VITE_FRONTEND_URL`.

---

### **5️⃣ Démarrer le serveur backend**
```sh
node server/server.js
```
> **💡 Assurez-vous que le port `8080` est libre.**

### **6️⃣ Démarrer le frontend**
Dans un autre terminal :
```sh
npm run dev
```
Le projet sera accessible sur **`http://localhost:5174/typescript_camera`**.

---

## 🌍 **Installation sur un VPS**
### **1️⃣ Prérequis**
- Un serveur **Linux (Ubuntu/Debian)**
- **Apache2** installé (`sudo apt install apache2`)
- **Node.js et npm** (`sudo apt install nodejs npm`)
- **PM2** pour gérer le serveur backend (`npm install -g pm2`)
- **Certbot** pour le SSL (`sudo apt install certbot python3-certbot-apache`)

---

### **2️⃣ Déployer le projet**
**Copiez le projet sur votre serveur :**
```sh
scp -r typescript_camera user@votre-vps:/var/www/typescript_camera
```
Sur le **VPS**, installez les dépendances :
```sh
cd /var/www/typescript_camera
npm install
```

---

### **3️⃣ Configurer le fichier `.env`**
Modifiez `/var/www/typescript_camera/.env` :
```ini
PORT=8080

# URL du frontend et backend
VITE_FRONTEND_URL=https://votre-domaine.com/typescript_camera
VITE_SERVER_URL=https://votre-domaine.com
VITE_WS_PROTOCOL=wss

# Préfixe API
VITE_API_PREFIX=/api
```

---

### **4️⃣ Configurer Apache pour proxy WebSockets**
Ouvrez la configuration Apache :
```sh
sudo nano /etc/apache2/sites-available/000-default-le-ssl.conf
```
Ajoutez ces lignes :
```apache
<VirtualHost *:443>
    ServerName votre-domaine.com

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/votre-domaine.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/votre-domaine.com/privkey.pem

    # Proxy API
    ProxyRequests Off
    ProxyPass /api http://localhost:8080/api
    ProxyPassReverse /api http://localhost:8080/api

    # Proxy WebSocket
    ProxyPass /socket.io/ ws://localhost:8080/socket.io/
    ProxyPassReverse /socket.io/ ws://localhost:8080/socket.io/

    # Fallback HTTP WebSocket
    ProxyPass /socket.io/ http://localhost:8080/socket.io/
    ProxyPassReverse /socket.io/ http://localhost:8080/socket.io/

    # Servir le frontend
    Alias /typescript_camera /var/www/typescript_camera/dist
    <Directory /var/www/typescript_camera/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        <IfModule mod_rewrite.c>
            RewriteEngine On
            RewriteBase /typescript_camera
            RewriteCond %{REQUEST_FILENAME} !-f
            RewriteCond %{REQUEST_FILENAME} !-d
            RewriteRule ^ index.html [QSA,L]
        </IfModule>
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/typescript_camera_https_error.log
    CustomLog ${APACHE_LOG_DIR}/typescript_camera_https_access.log combined
</VirtualHost>
```
Redémarrez Apache :
```sh
sudo systemctl restart apache2
```

---

### **5️⃣ Démarrer le serveur backend avec PM2**
```sh
pm2 start /var/www/typescript_camera/server/server.js --name typescript_camera
pm2 save
pm2 startup
```

---

## 🛠 **Résolution des erreurs courantes**
### ❌ **Erreur CORS : `Blocked by CORS policy`**
🔹 **Solution :** Vérifiez que votre backend autorise bien l'origine du frontend dans `server.js` :
```js
app.use(cors({
    origin: ["https://votre-domaine.com"],
    methods: ["GET", "POST"],
    credentials: true
}));
```

### ❌ **WebSockets ne fonctionne pas (`socket.io/ 404`)**
🔹 **Solution :** Vérifiez que **Apache proxy bien les WebSockets** :
```sh
sudo a2enmod proxy proxy_http proxy_wstunnel
sudo systemctl restart apache2
```

### ❌ **Le frontend affiche une page blanche**
🔹 **Solution :** Vérifiez que votre **`homepage`** est bien configurée dans `package.json` :
```json
"homepage": "/typescript_camera"
```
Et reconstruisez le projet :
```sh
npm run build
```

---

## 🎯 **Fonctionnalités Principales**
- 📸 **Caméra** : Capture d'images et stockage local
- 💬 **Messagerie** : Envoi de messages en temps réel via WebSockets
- 📍 **Localisation** : Stockage et affichage des coordonnées de l'utilisateur
- 🖼 **Galerie** : Gestion des photos capturées
- 📞 **Appels vocaux** : Intégration des appels téléphoniques via `tel://`

---

## ✅ **Conclusion**
🎉 **Félicitations !** Vous avez installé **PWA Camera** en local et sur un **VPS**.  
Si vous rencontrez des erreurs, utilisez les logs :
```sh
pm2 logs typescript_camera
sudo journalctl -xeu apache2
```
📬 **Contactez-nous sur GitHub pour toute question !**

🚀 **Bon développement !**