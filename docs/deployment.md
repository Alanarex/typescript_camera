# VPS deployment (Apache + PM2)

> Moved from the original README (French). Paths and domains are examples.

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
