# Proyecto React Avanzado - Fullstack App (Next.js)

Bienvenido aplicacion Fullstack básica construida con **Next.js (App Router)** y **PostgreSQL**. Contiene ejemplos sobre Server Components, Server Actions, Formularios con UI Optimista y protección de rutas usando middleware.

---

## 🚀 Guía Rápida para Levantar el Proyecto

Sigue estos pasos en orden para iniciar la aplicación desde cero.

### 1. Requisitos Previos

- **Node.js**: Instalado (recomendado v18+).
- **pnpm**: Gestor de paquetes (`npm install -g pnpm`).
- **Docker** o **Docker Desktop**: Para levantar la base de datos fácilmente.

### 2. Levantar la Base de Datos (Docker)

El proyecto incluye un entorno pre-configurado para levantar PostgreSQL localmente.

```bash
cd setup-db
docker-compose up -d
```
*Esto levantará un contenedor postgres:16 en el puerto 5434 de tu equipo.*

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la estructura raíz del proyecto (junto a `package.json`) y pega la variable correcta para conectarte a la BD Dockerizada:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/nextjs_db?schema=public"
```

### 4. Instalar Dependencias

Regresa a la raíz de tu proyecto e instala todo:

```bash
pnpm install
```

### 5. Configurar Prisma (ORM)

Prisma es la herramienta que se comunica con nuestra base de datos. Debes mandar los "planos" (esquemas) a la DB recién creada.

1. **Sincronizar la base de datos** (Crea las tablas):
   ```bash
   pnpm dlx prisma db push
   ```
2. **Generar el cliente de TypeScript**:
   ```bash
   pnpm dlx prisma generate
   ```
3. **Poblar la base de datos (Opcional - Seed)**:
   *Carga proyectos de ejemplo automáticamente.*
   ```bash
   node prisma/seed.mjs
   ```

---

## 💻 Entorno de Desarrollo (Local)

Para revisar el código en vivo, con Hot-Reloading y reportes de error interactivos, levanta el entorno de desarrollo:

```bash
pnpm run dev
```
👉 Tu aplicación estará corriendo en [http://localhost:3000](http://localhost:3000).

*Si quieres ver la Base de Datos directamente como un panel de Excel, abre otra terminal y pon `pnpm dlx prisma studio`.*

---

## 🏗 Entorno de Producción

Para simular exactamente cómo correrá la aplicación en un servidor real público, necesitas "Construir" (Build) la aplicación, que minificará el código y prerenderizará las páginas estáticas.

1. **Construir el código**:
   ```bash
   pnpm run build
   ```
2. **Iniciar el servidor ultra-rápido de prod**:
   ```bash
   pnpm run start
   ```

---

## 🗂 Estructura del Proyecto Recomendada

- `/src/app`: Rutas del sistema (App Router), páginas y layouts. (Ej. `/dashboard`). Backend y Frontend se cruzan aquí.
- `/src/components`: Botones visuales, Formularios interactivos y componentes reutilizables sin lógica de ruteaje.
- `/src/lib`: Utilidades o lógica puramente de backend como configuraciones a Prisma, o llamadas a APIs.
- `/prisma`: La magia de base de datos. Modelos (`schema.prisma`) y _scripts_ de _seeding_.
- `/schemas`: Zod Types para validar los formularios evitando intrusiones maliciosas de usuarios antes de guardar.
