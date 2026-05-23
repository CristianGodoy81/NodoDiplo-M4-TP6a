# API Nodo Cine

API RESTful para la gestión de una plataforma de películas. Proporciona autenticación, gestión de perfiles de usuario, catálogo de películas con roles de administrador y listas de seguimiento (Watchlist) por perfil.

## 🚀 Tecnologías Utilizadas

* **Node.js & Express (v5.x)** - Framework del servidor web.
* **MongoDB & Mongoose** - Base de datos NoSQL y ODM.
* **JWT (JSON Web Tokens)** - Autenticación basada en tokens.
* **Bcrypt** - Encriptación de contraseñas.
* **Axios** - Peticiones HTTP a APIs externas (para importar películas/trailers).
* **ES Modules** - Uso de sintaxis `import/export` mediante archivos `.mjs`.

## 📁 Estructura del Proyecto

src/
 ├── config/         # Configuración de base de datos e inicializadores
 ├── controllers/    # Lógica de negocio (auth, movies, profiles, watchlist)
 ├── middlewares/    # Validaciones intermedias (Auth JWT, control de Roles)
 ├── models/         # Esquemas de Mongoose (User, Profile, Movie, Watchlist)
 └── routes/         # Definición de endpoints
app.mjs              # Punto de entrada de la aplicación

## ⚙️ Configuración e Instalación

1. **Clona el repositorio** o descarga el código fuente.
2. **Instala las dependencias:**

   npm install

3. **Configura las variables de entorno:**
   Crea un archivo .env en la raíz del proyecto y define las siguientes variables:

   PORT=3000
   MONGO_URI=tu_url_de_mongodb
   JWT_SECRET=tu_clave_secreta_jwt

4. **Ejecuta el servidor de desarrollo:**

   npm run dev

   El servidor se iniciará en `http://localhost:3000` (o el puerto configurado).

## 🚏 Endpoints de la API

La API cuenta con los siguientes recursos principales:

### Autenticación (`/api/auth`)
* `POST /register` - Registra un nuevo usuario del sistema.
* `POST /login` - Inicia sesión y devuelve un token JWT.

### Perfiles de Usuario (`/api/profiles`)
*(Requiere Autenticación)*
* Endpoints para la gestión de múltiples perfiles por cuenta (crear, leer, actualizar, borrar).

### Películas (`/api/movies`)
*(Requiere Autenticación)*
* `GET /` - Obtiene todas las películas del catálogo.
* `GET /:id` - Obtiene una película del catálogo.
* `GET /:id/trailer` - Obtiene el trailer de una película.

*(Solo Administradores)*
* `POST /import` - Importa películas desde una fuente externa usando Axios.
* `POST /` - Crea una nueva película en el catálogo.
* `PUT /:id` - Actualiza la información de una película.
* `DELETE /:id` - Elimina una película del sistema.

### Listas de Seguimiento (`/api/watchlist`)
*(Requiere Autenticación)*
* `POST /` - Agrega una película a la lista de seguimiento (Watchlist) de un perfil.
* `GET /:profileId` - Obtiene la lista de películas guardadas en un perfil específico.
* `DELETE /:id` - Remueve un elemento de la lista de seguimiento.

## 🔒 Middlewares
* **`authMiddleware`**: Valida que la petición cuente con un Bearer Token (`JWT`) válido en los headers.
* **`adminMiddleware`**: Valida que el usuario autenticado tenga el rol de administrador para realizar modificaciones críticas en el catálogo.

## 📜 Scripts
* `npm run dev` - Ejecuta la API en modo de desarrollo usando `nodemon`.