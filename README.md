# 🌐 C21 Website - Plataforma Inmobiliaria Fullstack

Proyecto web para la gestión y visualización de propiedades inmobiliarias, desarrollado para Century 21. Incluye backend con Node.js/Express/Prisma y frontend con React.

---

## 📁 Estructura del Proyecto

```bash
c21-website/
├── backend/ → API REST con Node.js, Express y Prisma
├── frontend/ → Interfaz web con React y Tailwind
```
---

## 🚀 Tecnologías Utilizadas

### Backend:
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- JWT para autenticación
- BcryptJS para hasheo de contraseñas

### Frontend:
- [React.js](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- Axios para llamadas HTTP

---

## 🛠️ Configuración Inicial

### Clonar el proyecto

### Backend:
```bash
git clone https://github.com/francescaac190/realstateweb.git
cd c21-backend
npm install
cp .env.example .env  # crea tus variables
npx prisma generate
npx prisma migrate dev --name init
npm run seed          # datos iniciales (roles, monedas, etc)
npm run dev
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Variables de Entorno (backend)

Crea un archivo .env en /c21-backend con:

```bash
DATABASE_URL="postgresql://usuario:password@localhost:5432/c21db"
JWT_SECRET="..."
PORT=4000
```
---

## ✅ Funcionalidades

- Registro y login de agentes
- Gestión de propiedades (CRUD)
- Panel de administración (futuro)
- Catálogos centralizados: roles, monedas, tipos y estados
- Autenticación con JWT
- Panel visual para ver inmuebles (frontend)

---

### 🧑‍💻 Autor

### Francesca Antelo
Proyecto personal para ayudar a mi padre con la gestión de inmuebles en Century 21.
