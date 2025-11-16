# Proyecto de Gestión de Usuarios y Registro con Verificación por Email

Este proyecto consiste en una aplicación fullstack para la gestión de usuarios, registro, verificación de cuentas por email y campos opcionales. Incluye frontend en React + TypeScript + Tailwind y backend en Node.js + Express + TypeORM + PostgreSQL.  

---

## Tecnologías utilizadas

### 🔹 Backend (Node.js)
- **Node.js**: Entorno de ejecución de JavaScript del lado del servidor.
- **Express**: Framework web minimalista para crear rutas y controladores.
- **TypeScript**: Tipado estático para mayor seguridad y escalabilidad.
- **TypeORM**: ORM para PostgreSQL, manejo de entidades, relaciones y migraciones.
- **PostgreSQL**: Base de datos relacional para almacenar usuarios y sus datos.
- **Nodemailer**: Envío de correos electrónicos de verificación.
- **Crypto**: Generación de tokens de verificación seguros.
- **Multer**: Manejo de subida de archivos (fotos de usuario).
- **Dotenv**: Manejo de variables de entorno para configuraciones sensibles.
- **Cors**: Configuración de permisos de acceso desde el frontend.
- **ts-node / ts-node-dev**: Ejecución de TypeScript directamente sin compilar manualmente.

#### Dependencias principales
```bash
npm install express typeorm pg reflect-metadata nodemailer multer cors dotenv crypto
npm install --save-dev typescript ts-node-dev @types/express @types/node @types/multer @types/cors

## Estructura del proyecto
/backend
  /controllers
  /models
  /repositories
  /services
  /routes
  app.ts
  tsconfig.json
  .env
/frontend
  /src
    /pages
    /components
  index.tsx
  App.tsx
  vite.config.ts
  tailwind.config.js

## Para ejecutarlo
-Backend:  BEERSP/backend>  npx ts-node .\src\files\server.ts
-Frontend: BEERSP/frontend> npm run dev

