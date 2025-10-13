# 🚀 Microservicio de Usuarios

> Aplicación full-stack desarrollada como prueba técnica, con frontend en Angular y backend con Node.js + PostgreSQL.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Angular](https://img.shields.io/badge/Angular-17-red.svg)](https://angular.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

---

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación-y-configuración)
- [Testing](#-testing)
- [API Endpoints](#-api-endpoints)
- [Solución de Problemas](#-solución-de-problemas)

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Angular 17** - Framework principal
- **Tailwind CSS** - Estilos y diseño
- **Flowbite** - Componentes UI
- **TypeScript** - Tipado estático
- **RxJS** - Programación reactiva
- **Karma + Jasmine** - Testing

### Backend
- **Node.js + Express** - API REST
- **PostgreSQL** - Base de datos
- **TypeScript** - Tipado estático
- **Jest + Supertest** - Testing
- **Docker Compose** - Contenedores

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

| Software | Versión Mínima | Enlace |
|----------|----------------|--------|
| Node.js | v18+ | [Descargar](https://nodejs.org/) |
| npm | v9+ | (incluido con Node.js) |
| Docker | Latest | [Descargar](https://www.docker.com/) |
| Git | Latest | [Descargar](https://git-scm.com/) |

---

## 🚀 Instalación y Configuración

### 1️⃣ Clonar los Repositorios

```bash
# Frontend
git clone https://github.com/Edwin32322/frontend-microservicio.git

# Backend
git clone https://github.com/Edwin32322/backend-microservicio.git
```

> **Nota:** También puedes descargar los repositorios como archivos ZIP.

---

### 2️⃣ Configurar el Backend

#### a) Navegar al directorio

```bash
cd backend-microservicio
```

#### b) Instalar dependencias

```bash
npm install
```

#### c) Levantar PostgreSQL con Docker

Crea un archivo `docker-compose.yml` en la raíz del proyecto:

```yaml
services:
  postgres:
    image: postgres:15
    container_name: ${DB_CONTAINER_NAME:-contenedor-postgres}
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-microservicio-db}
      POSTGRES_USER: ${POSTGRES_USER:-usuario}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-micontrasena}
    ports:
      - "${DB_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./initial-scripts-db:/docker-entrypoint-initdb.d
    restart: unless-stopped

volumes:
  postgres_data:
```

Levanta el contenedor:

```bash
docker-compose up -d
```

Verifica que esté corriendo:

```bash
docker ps
```

#### d) Configurar variables de entorno

Crea un archivo `.env` en la raíz del backend:

```env
# Servidor
PORT=3000

# Base de datos
DB_CONTAINER_NAME=contenedor-postgres
POSTGRES_DB=microservicio-db
POSTGRES_USER=usuario
POSTGRES_PASSWORD=micontrasena
DB_PORT=5432
HOST=localhost
```

#### e) Inicializar la base de datos

La tabla se creará automáticamente al iniciar el servidor, o puedes crearla manualmente:

```sql
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    edad INT
);

-- Datos de ejemplo (opcional)
INSERT INTO usuarios (nombre, correo, edad) VALUES 
('Edwin Goaly', 'edwincastellanos150@gmail.com', 20),
('Leonel Messi', 'leomessi@gmail.com', 38),
('Tom Aspinall', 'aspinallbjj@gmail.com', 32);
```

#### f) Iniciar el servidor

```bash
# Modo desarrollo
npm run dev

# Producción
npm run build
npm start
```

✅ **Backend corriendo en:** http://localhost:3000

---

### 3️⃣ Configurar el Frontend

#### a) Navegar al directorio

```bash
cd frontend-microservicio
```

#### b) Instalar dependencias

```bash
npm install
```

#### c) Configurar la URL del backend

Edita `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/data'
};
```

#### d) Iniciar el servidor de desarrollo

```bash
ng serve
# o
npm start
```

✅ **Frontend corriendo en:** http://localhost:4200

---

## 🧪 Testing

### Backend (Jest + Supertest)

```bash
# Ejecutar todos los tests
npm test

# Modo watch
npm run test:watch

# Cobertura de código
npm run test:coverage
```

### Frontend (Karma + Jasmine)

```bash
# Ejecutar tests
ng test
```

---

## 🌐 API Endpoints

### Usuarios

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `GET` | `/api/data` | Obtener todos los usuarios | - |
| `POST` | `/api/data` | Crear nuevo usuario | `{ nombre, correo, edad }` |
| `PUT` | `/api/data/:id` | Actualizar usuario | `{ nombre, correo, edad }` |
| `POST` | `/api/data/delete-users` | Eliminar usuarios | `{ usersIds: [1, 2, 3] }` |

### Ejemplos de Uso

#### Crear Usuario

```bash
curl -X POST http://localhost:3000/api/data ^
-H "Content-Type: application/json" ^
-d "{\"nombre\":\"Carlos\",\"correo\":\"carlos@example.com\",\"edad\":25}"

```

#### Actualizar Usuario

```bash
curl -X PUT http://localhost:3000/api/data/{id del usuario} ^
-H "Content-Type: application/json" ^
-d "{\"nombre\":\"Usuario Actualizado\",\"correo\":\"usuario@example.com\",\"edad\":25}"
```

#### Eliminar Usuarios

```bash
curl -X POST http://localhost:3000/api/data/delete-users -H "Content-Type: application/json" -d "{\"usersIds\":[1,2,3]}"

```

---

## 🐳 Comandos Útiles de Docker

```bash
# Ver contenedores activos
docker ps

# Ver logs en tiempo real
docker logs -f contenedor-postgres

# Detener contenedores
docker-compose down

# Detener y eliminar volúmenes (⚠️ elimina los datos)
docker-compose down -v

# Reiniciar contenedor
docker-compose restart

# Acceder a PostgreSQL CLI
docker exec -it contenedor-postgres psql -U usuario -d microservicio-db

# Backup de la base de datos
docker exec contenedor-postgres pg_dump -U usuario microservicio-db > backup.sql

# Restaurar backup
docker exec -i contenedor-postgres psql -U usuario microservicio-db < backup.sql
```

---

## 🛠️ Solución de Problemas

❌ El backend no se conecta a PostgreSQL

**Posibles soluciones:**

1. Verifica que el contenedor esté corriendo:
   ```bash
   docker ps
   ```

2. Revisa los logs del contenedor:
   ```bash
   docker logs contenedor-postgres
   ```

3. Verifica las credenciales en el archivo `.env`

4. Asegúrate de que el puerto 5432 no esté ocupado:
   ```bash
   lsof -i :5432  # macOS/Linux
   netstat -ano | findstr :5432  # Windows
   ```

5. Intenta reiniciar el contenedor:
   ```bash
   docker-compose restart
   ```

**❌ El frontend no se conecta al backend**

**Posibles soluciones:**

1. Verifica que el backend esté corriendo:
   ```bash
   curl http://localhost:3000/api/data
   ```

2. Revisa la configuración en `environment.ts`

3. Verifica errores en la consola del navegador (F12)

4. Asegúrate de que no haya problemas de CORS en el backend

**❌ Error: Puerto ocupado**

**Frontend:**
```bash
ng serve --port 4300
```

**Backend:** Cambia el puerto en `.env`:
```env
PORT=3001
```

**❌ Error al instalar dependencias**

**Solución:**

1. Limpia la caché de npm:
   ```bash
   npm cache clean --force
   ```

2. Elimina `node_modules` y reinstala:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Verifica tu versión de Node.js:
   ```bash
   node --version
   ```
---

## 👨‍💻 Autor

**Edwin Castellanos**

- GitHub: [@Edwin32322](https://github.com/Edwin32322)
- Email: edwincastellanos150@gmail.com

---

## 🙏 Agradecimientos

Proyecto desarrollado como prueba técnica. Agradecimientos especiales a todos los que revisaron y evaluaron este trabajo.

---