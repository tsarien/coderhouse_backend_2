# ![Programación Backend II: Desarrollo Avanzado de Backend](https://img.shields.io/badge/CURSO%3A-%20PROGRAMACION%20BACKEND%20II-green?style=plastic&logo=codementor)

## Coderhouse - Comision 77260

### Tecnologías utilizadas

![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white)
![Handlebars JS](https://img.shields.io/badge/Handlebars%20js-f0772b?style=for-the-badge&logo=handlebarsdotjs&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

---

## Entrega #1 (10-11-2025)

### Consigna

Implementar en el proyecto ecommerce facilitado al inicio del curso un CRUD de usuarios, junto con un sistema de Autenticación y Autorización.

## Aspectos a incluir:

### 1. Modelo de Usuario:

Crear un modelo User que contenga los siguientes campos:

- first_name: `String`
- last_name: `String`
- email: `String` (debe ser único)
- age: `Number`
- password: `String` (en formato hash)
- cart: `Id` con referencia a Carts
- role: `String` (valor por defecto: `user`)

### 2. Encriptacion de Contraseña:

Utilizar el paquete bcrypt para encriptar la contraseña del usuario mediante el método hashSync.

### 3. Estrategias de Passport:

Desarrollar las estrategias de Passport para que funcionen con el modelo de usuarios creado.

### 4. Sistema de Login:

Implementar un sistema de login del usuario que trabaje con JWT (JSON Web Tokens).

### 5. Ruta de Validación:

Agregar al router `/api/sessions/` la ruta `/current`, que validará al usuario logueado y devolverá en una respuesta sus datos asociados al JWT.

## Formato de Entrega:

Link al repositorio de GitHub con el proyecto completo, sin incluir la carpeta node_modules.

Esta actividad es una parte fundamental de la preparación para la entrega del proyecto final y se centra en la implementación de mecanismos de seguridad y gestión de usuarios, que son esenciales para el desarrollo de aplicaciones backend robustas y seguras.

|                              `home.handlebars`                              |                                `productDetail.handlebars`                                |
| :-------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------: |
|     <img src="./src/public/img/readme/home.png" alt="home" width="400">     | <img src="./src/public/img/readme/productDetail.png" alt="detalle-producto" width="400"> |
|                            **`cart.handlebars`**                            |                                  **`login.handlebars`**                                  |
|     <img src="./src/public/img/readme/cart.png" alt="cart" width="400">     |          <img src="./src/public/img/readme/login.png" alt="login" width="400">           |
|                          **`register.handlebars`**                          |                                                                                          |
| <img src="./src/public/img/readme/register.png" alt="register" width="400"> |                                                                                          |
