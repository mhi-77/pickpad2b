# Guía de Despliegue - Documentación PickPad

Esta guía explica cómo publicar el sitio de documentación en diferentes plataformas.

## Opción 1: GitHub Pages (Recomendado)

### Configuración Inicial

1. **Preparar el Repositorio**
   ```bash
   # Asegúrese de tener la carpeta docs/ en la raíz del repositorio
   git add docs/
   git commit -m "Add documentation site"
   git push origin main
   ```

2. **Configurar GitHub Pages**
   - Vaya a Settings > Pages en su repositorio
   - En "Source", seleccione "Deploy from a branch"
   - En "Branch", seleccione `main` y carpeta `/docs`
   - Click "Save"

3. **Acceder al Sitio**
   - GitHub generará automáticamente la URL:
   - `https://<username>.github.io/<repository-name>/`
   - El despliegue toma 1-3 minutos

### Actualizaciones

Cada vez que haga cambios en la carpeta `docs/` y haga push, GitHub Pages se actualizará automáticamente.

```bash
# Edite archivos en docs/
git add docs/
git commit -m "Update documentation"
git push origin main
# Espere 1-3 minutos para ver cambios
```

## Opción 2: Netlify

### Despliegue Rápido (Drag & Drop)

1. Vaya a [netlify.com](https://netlify.com) e inicie sesión
2. Click en "Sites" > "Add new site" > "Deploy manually"
3. Arrastre la carpeta `docs/` a la zona de drop
4. Netlify generará una URL aleatoria como `random-name-123.netlify.app`

### Despliegue con Git (Recomendado para Producción)

1. En Netlify, click "Add new site" > "Import an existing project"
2. Conecte su repositorio (GitHub, GitLab, o Bitbucket)
3. Configure:
   - **Base directory:** `docs`
   - **Build command:** (dejar vacío)
   - **Publish directory:** `.` (punto)
4. Click "Deploy site"

### Dominio Personalizado

1. En Site settings > Domain management
2. Click "Add custom domain"
3. Ingrese su dominio (ej: `docs.pickpad.com`)
4. Siga las instrucciones de DNS

## Opción 3: Vercel

1. Instale Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Despliegue:
   ```bash
   cd docs
   vercel
   # Siga las instrucciones en pantalla
   ```

3. Para dominios personalizados:
   ```bash
   vercel --prod
   vercel domains add docs.pickpad.com
   ```

## Opción 4: Servidor Web Tradicional

### Apache

1. **Copiar Archivos**
   ```bash
   # En su servidor
   scp -r docs/ usuario@servidor:/var/www/html/docs/
   ```

2. **Configurar Apache**
   ```apache
   <VirtualHost *:80>
       ServerName docs.pickpad.com
       DocumentRoot /var/www/html/docs

       <Directory /var/www/html/docs>
           Options -Indexes +FollowSymLinks
           AllowOverride None
           Require all granted

           # Para SPA routing
           RewriteEngine On
           RewriteBase /
           RewriteRule ^index\.html$ - [L]
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteRule . /index.html [L]
       </Directory>

       # Caché para assets estáticos
       <FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
           Header set Cache-Control "max-age=31536000, public"
       </FilesMatch>
   </VirtualHost>
   ```

3. **Activar Sitio**
   ```bash
   sudo a2ensite docs-pickpad
   sudo systemctl reload apache2
   ```

### Nginx

1. **Configuración**
   ```nginx
   server {
       listen 80;
       server_name docs.pickpad.com;
       root /var/www/html/docs;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Caché para assets estáticos
       location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # Compresión gzip
       gzip on;
       gzip_types text/css application/javascript application/json;
       gzip_min_length 1000;
   }
   ```

2. **Activar**
   ```bash
   sudo ln -s /etc/nginx/sites-available/docs-pickpad /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## Opción 5: Hosting Estático Simple

### Amazon S3 + CloudFront

1. **Crear Bucket S3**
   ```bash
   aws s3 mb s3://docs-pickpad
   aws s3 sync docs/ s3://docs-pickpad/
   ```

2. **Configurar como Sitio Web**
   ```bash
   aws s3 website s3://docs-pickpad/ \
     --index-document index.html \
     --error-document index.html
   ```

3. **Hacer Público**
   - En AWS Console: Bucket > Permissions
   - Desactive "Block all public access"
   - Agregue bucket policy:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::docs-pickpad/*"
       }
     ]
   }
   ```

### Firebase Hosting

1. **Instalar Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Inicializar**
   ```bash
   firebase init hosting
   # Public directory: docs
   # Configure as single-page app: No
   # Set up automatic builds: No
   ```

3. **Desplegar**
   ```bash
   firebase deploy --only hosting
   ```

## Configuración de DNS

Para dominios personalizados, configure estos registros DNS:

### Para subdominios (docs.pickpad.com)

```
Tipo: CNAME
Nombre: docs
Valor: [URL de su hosting]
TTL: 3600
```

Ejemplos:
- GitHub Pages: `<username>.github.io`
- Netlify: `<site-name>.netlify.app`
- Vercel: `<site-name>.vercel.app`

### Para dominio raíz (pickpad.com)

```
Tipo: A
Nombre: @
Valor: [IP del hosting]
TTL: 3600
```

O use ALIAS/ANAME si su proveedor DNS lo soporta.

## SSL/HTTPS

### Let's Encrypt (Certbot)

```bash
# Instalar certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d docs.pickpad.com

# Renovación automática
sudo certbot renew --dry-run
```

### CloudFlare (Gratuito)

1. Agregue su dominio a CloudFlare
2. Cambie los nameservers en su registrador
3. En CloudFlare: SSL/TLS > Full
4. Espere 5-10 minutos para propagación

## Optimizaciones de Performance

### Compresión

```nginx
# Nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
gzip_min_length 1000;
```

```apache
# Apache (.htaccess)
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript
</IfModule>
```

### Caché de Navegador

```nginx
# Nginx
location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

```apache
# Apache
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    Header set Cache-Control "max-age=31536000, public, immutable"
</FilesMatch>
```

### CDN

Para mejor performance global, use un CDN:

1. **CloudFlare** (Gratuito)
   - Agregue su dominio
   - Active "Auto Minify" para HTML/CSS/JS
   - Active "Brotli compression"

2. **Fastly** o **Cloudfront**
   - Configure origen apuntando a su hosting
   - Configure caché rules
   - Use edge locations cercanas a usuarios

## Monitoreo y Analytics

### Google Analytics

Agregue al final de `<head>` en `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Plausible Analytics (Privacy-Friendly)

```html
<script defer data-domain="docs.pickpad.com" src="https://plausible.io/js/script.js"></script>
```

## Troubleshooting

### Problema: 404 en navegación

**Solución:** Configure fallback a index.html en su servidor

### Problema: Estilos no cargan

**Solución:** Verifique rutas relativas y MIME types

### Problema: Cambios no se reflejan

**Solución:**
1. Limpie caché del navegador (Ctrl+Shift+R)
2. Verifique caché del servidor/CDN
3. Verifique que los archivos se subieron correctamente

### Problema: CORS errors

**Solución:** Configure headers CORS en su servidor:
```nginx
add_header Access-Control-Allow-Origin "*";
add_header Access-Control-Allow-Methods "GET, OPTIONS";
```

## Checklist de Despliegue

Antes de publicar, verifique:

- [ ] Todos los enlaces internos funcionan
- [ ] Búsqueda funciona correctamente
- [ ] Navegación móvil funciona
- [ ] Imágenes cargan correctamente
- [ ] No hay errores en console del navegador
- [ ] Funciona en Chrome, Firefox, Safari
- [ ] Funciona en móvil y tablet
- [ ] HTTPS configurado y funcionando
- [ ] Dominio personalizado apunta correctamente
- [ ] Analytics configurado (si aplica)
- [ ] Sitemap generado (si aplica)

## Mantenimiento

### Backup Regular

```bash
# Backup local
tar -czf docs-backup-$(date +%Y%m%d).tar.gz docs/

# Backup a S3
aws s3 sync docs/ s3://backup-docs-pickpad/$(date +%Y%m%d)/
```

### Monitoreo de Uptime

Use servicios como:
- UptimeRobot (gratuito)
- Pingdom
- StatusCake

### Actualizaciones

1. Pruebe cambios localmente
2. Haga commit a rama de desarrollo
3. Revise en entorno de staging
4. Merge a main/production
5. Verifique despliegue exitoso

---

Para más información, consulte la documentación específica de cada plataforma de hosting.
