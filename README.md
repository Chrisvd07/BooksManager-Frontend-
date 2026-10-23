# Guia de Instalacion y Ejecucion - Frontend (Angular 21)

## Descripcion del Proyecto
Aplicacion web desarrollada en Angular 21 (arquitectura basada en componentes autonomos o Standalone Components) para la gestion de libros y autores. La aplicacion consume los servicios de la API REST .NET intermediaria (https://localhost:7278/api) y cuenta con una estructura modularizada con carga diferida (lazy loading), formularios reactivos con captura de errores del servidor y diseno responsivo con Angular Material.

---

## 1. Requisitos Previos del Sistema
Para instalar y ejecutar este proyecto es necesario disponer de:
- Node.js: Version 20.19+, 22.12+ o 24+ instalada en el equipo (requerido por Angular 21, https://nodejs.org/).
- npm: Gestor de paquetes incluido con la instalacion de Node.js (version 10 o superior).
- Angular CLI: Opcional para comandos globales de desarrollo (`npm install -g @angular/cli`).
- Backend API (.NET): Debe encontrarse en ejecucion en https://localhost:7278 (o en http://localhost:5120 si el navegador no tiene configurado el certificado dev de desarrollo; configurable centralizadamente en `src/environments/environment.ts`).

---

## 2. Clonacion del Repositorio
```bash
git clone https://github.com/Chrisvd07/BooksManager-Frontend-.git
cd BooksManager-Frontend-
```
*(Si ya se encuentra en el directorio local del proyecto, situarse en la carpeta raiz `book-frontend`).*

---

## 3. Instalacion de Dependencias
Ejecutar en la terminal dentro del directorio del proyecto:
```bash
npm install
```

---

## 4. Ejecucion del Servidor de Desarrollo
Para iniciar el servidor local de Angular:
```bash
npm start
```
*(o alternativamente: `ng serve`)*

Una vez completada la compilacion en memoria, abrir el navegador en:
- URL de la aplicacion: http://localhost:4200

---

## 5. Compilacion para Produccion
Para compilar y empaquetar la aplicacion lista para despliegue:
```bash
npm run build
```
Los archivos finales optimizados se generaran en el directorio `dist/book-frontend/`.

---

## 6. Rutas de la Aplicacion (Lazy Loading)
La aplicacion utiliza carga bajo demanda organizada por modulos funcionales (features):

### Libros (/books)
- `/books`: Catalogo principal de libros con buscador interactivo y acciones de gestion.
- `/books/new`: Pagina de formulario para registrar un nuevo libro.
- `/books/:id`: Ficha tecnica detallada del libro con sus autores asociados (relacion por idBook).
- `/books/:id/edit`: Pagina de formulario para editar un libro existente.

### Autores (/authors)
- `/authors`: Directorio de autores con calculo veridico de obras publicadas.
- `/authors/new`: Pagina de formulario para registrar un nuevo autor.
- `/authors/:id/edit`: Pagina de formulario para editar un autor existente.

---

## 7. Estructura del Codigo Fuente
- `src/app/core/`: Servicios HTTP singleton (`BookService`, `AuthorService`) y modelos de datos tipados (`Book`, `Author`).
- `src/app/shared/`: Componentes comunes reutilizables (`MainLayoutComponent`, `ConfirmDialogComponent`).
- `src/app/features/books/`: Modulo de libros (`books.routes.ts`) con vistas de listado, detalle y formularios.
- `src/app/features/authors/`: Modulo de autores (`authors.routes.ts`) con vistas de directorio y formularios.

---

## 8. Caracteristicas Tecnicas Implementadas
- Formularios Reactivos con Manejo de Errores: Las peticiones de guardado gestionan tanto la respuesta exitosa como los errores del servidor (400, 500 o fallos de red), presentando alertas en la vista y notificaciones flotantes con MatSnackBar.
- Conteo Real de Publicaciones: El calculo de obras por autor agrupa los identificadores unicos (`idBook`) asociados, mostrando fielmente `0 Libros publicados` si un autor aun no cuenta con obras registradas.
- Correspondencia Libro - Autor: La pantalla de detalle de libro normaliza la propiedad numerica `idBook` para vincular correctamente los autores correspondientes.
- Diseno Responsivo: Maquetacion fluida construida con Angular Material y Flexbox, evitando el uso de CSS Grid para garantizar compatibilidad entre dispositivos.
