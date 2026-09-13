# Vue 3 Project Base

Proyecto base desarrollado con **Vue 3 + TypeScript + Vite**, siguiendo una arquitectura modular y orientada a la separación de responsabilidades.

## Tecnologías

* Vue 3
* TypeScript
* Vite
* Vue Router
* Pinia
* Axios
* JSON Server
* JSON Server Auth
* Vitest

## Requisitos

* Node.js
* npm

## Instalación

```bash
npm install
```

## Configuración de ambientes

El proyecto utiliza variables de entorno mediante archivos `.env`.

Archivos utilizados como referencia:

```text
.env.example
```

Configuraciones locales:

```text
.env
.env.development
.env.testing
.env.production
```

Los archivos `.env` locales no se versionan. Para iniciar una configuración local puede utilizarse `.env.example` como referencia.

## Ejecución

### Frontend - desarrollo

```bash
npm run dev
```

### Frontend - pruebas

```bash
npm run dev:test
```

### Backend

```bash
npm run backend
```

El backend utiliza JSON Server y JSON Server Auth.

## Build

```bash
npm run build
```

Para pruebas:

```bash
npm run build:test
```

Para producción:

```bash
npm run build:prod
```

## Estructura principal

```text
src/
├── app/
│   ├── layouts/
│   └── router/
├── core/
│   ├── config/
│   ├── http/
│   └── storage/
├── infrastructure/
│   └── rest/
├── modules/
│   ├── auth/
│   ├── categories/
│   ├── home/
│   └── products/
├── shared/
│   └── components/
├── App.vue
└── main.ts

backend/
├── db.json
└── routes.json
```

## Funcionalidades actuales

* Autenticación y registro de usuarios.
* Protección de rutas mediante Vue Router.
* Persistencia del token de autenticación.
* CRUD de categorías.
* CRUD de productos.
* Relación producto-categoría.
* Búsqueda de productos por nombre.
* Filtrado de productos por categoría.
* Manejo centralizado de peticiones HTTP y errores.
* Layout para usuarios autenticados.
* Navegación principal reutilizable.
* Configuración diferenciada por ambiente.

## Estado del proyecto

Proyecto base funcional en desarrollo.
