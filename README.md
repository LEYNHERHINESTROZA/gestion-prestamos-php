# 💰 Sistema de Gestión de Préstamos y Pagos (PHP + Python)

Sistema web integral para la gestión y seguimiento de préstamos, cuentas y pagos. Integra un dashboard analítico procesado con Python y una base de datos robusta en MySQL, ofreciendo una experiencia de usuario moderna y fluida.

---

## ✨ Características Principales

- **Gestión de Cuentas y Préstamos**: Panel principal para registrar y administrar préstamos de usuarios.
- **Verificación de Pagos**: Módulo backend (`verificar_pagos.php`) para procesar y validar abonos o liquidaciones de cuentas.
- **Dashboard Analítico (Python + JS)**: Incorpora análisis de datos automatizado (`eda_dashboard.py`) que genera estadísticas en JSON (`dashboard_data.json`) para ser visualizadas de forma interactiva en la interfaz.
- **Base de Datos Estructurada**: Incluye esquema SQL (`gestion_cuentas.sql`) preparado para escalabilidad.
- **Interfaz Moderna y Responsiva**: Diseño atractivo y adaptativo usando HTML5, CSS3 y JavaScript moderno.

---

## 🗂️ Estructura del Proyecto

```
gestion-prestamos-php/
├── css/ & js/                 # Recursos frontend (Estilos y Scripts)
├── index.html                 # Página principal y portal de acceso
├── dashboard.html             # Panel de administración visual
├── styles.css                 # Hoja de estilos global
├── script.js                  # Lógica de validaciones y UI
├── procesar.php               # Controlador principal de lógica de negocio
├── verificar_pagos.php        # Módulo de validación de transacciones
├── gestion_cuentas.sql        # Backup y esquema de Base de Datos MySQL
├── eda_dashboard.py           # Análisis de datos en Python (Pandas)
└── dashboard_data.json        # Archivo de caché de métricas generadas
```

---

## 🚀 Instalación y Configuración (Local)

1. **Clonar el Repositorio**
   ```bash
   git clone https://github.com/LEYNHERHINESTROZA/gestion-prestamos-php.git
   ```

2. **Configurar Servidor y Base de Datos (XAMPP)**
   - Mueve la carpeta del proyecto a `C:/xampp/htdocs/`
   - Inicia los servicios de **Apache** y **MySQL** en el panel de XAMPP.
   - Abre phpMyAdmin, crea una base de datos (ej. `gestion_prestamos`) e importa el archivo `gestion_cuentas.sql`.

3. **Configurar el Backend**
   - Asegúrate de que las credenciales en `procesar.php` y `verificar_pagos.php` coincidan con las de tu entorno local (por defecto usuario `root` y sin contraseña en XAMPP).

4. **Procesar Datos Estadísticos (Opcional)**
   - Si deseas actualizar el dashboard de estadísticas, ejecuta el script de Python:
   ```bash
   python eda_dashboard.py
   ```

5. **Abrir la Aplicación**
   - Navega a `http://localhost/gestion-prestamos-php/index.html` en tu navegador.

---

## 🛠️ Stack Tecnológico

- **Frontend**: HTML5, CSS3, Vanilla JavaScript.
- **Backend Core**: PHP 8+.
- **Base de Datos**: MySQL.
- **Data Analytics**: Python (Pandas).

---

## 👨‍💻 Autor

**Leynher Hinestroza** - Desarrollador y Analista de Datos.
---

**Leynher Ferney Hinestroza Mosquera**
*Desarrollador Fullstack & Analista de Datos*
- ?? [LinkedIn](https://linkedin.com) (En construcci�n)
- ?? [GitHub](https://github.com/LEYNHERHINESTROZA)
- ?? Email: leynercrs@gmail.com
