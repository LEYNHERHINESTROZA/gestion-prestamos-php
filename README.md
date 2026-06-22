# 💰 Sistema de Gestión de Préstamos

Una aplicación web completa (Frontend + Backend PHP) para administrar, registrar y calcular préstamos, intereses, abonos y saldos restantes.

## ✨ Características Principales

- **Registro de Préstamos:** Permite ingresar datos del cliente, monto, fecha y observaciones.
- **Cálculo Automático:** Calcula dinámicamente el interés (20%), el monto total y el saldo restante basado en los abonos a capital e interés.
- **Gestión de Abonos:** Registra los abonos realizados por los clientes para actualizar su saldo de manera automática.
- **Notificación de Pagos (Alertas):** Genera alertas para notificar sobre próximos pagos a realizarse.
- **Interfaz Amigable:** Diseño limpio y responsivo utilizando HTML, CSS y notificaciones flotantes con `Toastify`.

## 📁 Estructura de Archivos

```text
├── index.html               # Interfaz principal (Formulario y Tabla)
├── styles.css               # Hoja de estilos de la aplicación
├── script.js                # Lógica del cliente, cálculos en tiempo real y AJAX
├── procesar.php             # Script backend para procesar el guardado de datos
├── verificar_pagos.php      # Script backend para generar alertas de pagos
├── gestion_cuentas.sql      # Archivo de base de datos / Consultas SQL iniciales
└── uploads/                 # Directorio para archivos adjuntos
```

## 🚀 Requisitos y Configuración

1. **Servidor Local (XAMPP/WAMP):** Asegúrate de tener Apache y MySQL corriendo.
2. **Base de Datos:** 
   - Crea una base de datos en `phpMyAdmin`.
   - Ejecuta las consultas del archivo `gestion_cuentas.sql` para crear las tablas necesarias.
3. **Configuración de Conexión:**
   - Si es necesario, actualiza las credenciales de conexión en los archivos `.php` (`procesar.php` y `verificar_pagos.php`) para que coincidan con tu usuario y contraseña de MySQL (por defecto usuario `root` sin contraseña en XAMPP).

## 💻 Uso

1. Coloca los archivos en la carpeta `htdocs` (si usas XAMPP).
2. Ingresa a `http://localhost/prueba%201/index.html` en tu navegador.
3. Llena el formulario con los datos del préstamo y haz clic en "Guardar Registro".
4. Verás el registro actualizado en la tabla inferior y recibirás notificaciones en caso de que existan pagos próximos.
