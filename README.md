# Analizador de Inteligencia IP

Herramienta de código abierto para realizar un análisis OSINT (Open Source Intelligence) completo de direcciones IP. Esta aplicación web permite a los usuarios obtener información detallada sobre una dirección IP, incluyendo datos de geolocalización, proveedor de servicios de Internet (ISP), información de red y un análisis de seguridad básico.

## Características

- **Información Detallada de IP:** Obtén datos como país, ciudad, región, código postal, zona horaria, ISP, organización y sistema autónomo (AS).
- **Geolocalización:** Visualiza la ubicación de la IP en un mapa (a través de Google Maps).
- **Análisis de Seguridad:** Evaluación básica del nivel de amenaza, si la IP es maliciosa y una puntuación de reputación.
- **Historial de Búsquedas:** Accede rápidamente a tus búsquedas de IP recientes.
- **Exportación de Datos:** Guarda los resultados del análisis en formato JSON.
- **Integración con Shodan:** Enlace directo a Shodan para una investigación más profunda de la IP.
- **Detección de IP del Usuario:** Muestra automáticamente la dirección IP pública del usuario al cargar la aplicación.

## Tecnologías Utilizadas

- **React:** Biblioteca de JavaScript para construir interfaces de usuario.
- **TypeScript:** Superset de JavaScript que añade tipado estático.
- **Vite:** Herramienta de construcción rápida para proyectos web modernos.
- **Tailwind CSS:** Framework CSS de utilidad para un diseño rápido y responsivo.
- **Lucide React:** Colección de iconos personalizables y de código abierto.

## Instalación

Para configurar y ejecutar el proyecto localmente, sigue estos pasos:

1.  Clona el repositorio:
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_REPOSITORIO>
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    # o
    yarn install
    ```
3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    # o
    yarn dev
    ```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

## Uso

1.  Ingresa una dirección IP en el campo de búsqueda.
2.  Haz clic en "Analizar IP" para obtener la información.
3.  Explora las diferentes secciones de resultados: Información Básica, Geolocalización, Red e ISP, Análisis de Seguridad e Información Adicional.
4.  Utiliza los botones de acción para exportar los datos o ver la IP en Shodan.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.