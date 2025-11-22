# Analizador de Inteligencia IP - OSINT Tool

Herramienta profesional de código abierto para realizar un análisis OSINT (Open Source Intelligence) completo de direcciones IP. Esta aplicación integra múltiples fuentes de inteligencia de amenazas y herramientas de red para proporcionar un análisis exhaustivo.

## 🚀 Características

### Inteligencia de Amenazas
- **AbuseIPDB**: Reportes de abuso y scoring
- **VirusTotal**: Detecciones de malware y reputación
- **IPQualityScore**: Detección de VPN/Proxy/Tor y scoring de fraude
- **AlienVault OTX**: Indicadores de compromiso y pulsos de amenazas
- **Scoring Agregado**: Análisis combinado de múltiples fuentes

### Información de Red
- **DNS Completo**: Registros A, AAAA, MX, NS, TXT, CNAME
- **WHOIS**: Información de registro y organización
- **Reverse DNS**: Resolución inversa de IP a hostname
- **ASN/BGP**: Información del sistema autónomo y rutas BGP

### Análisis de Puertos
- **Shodan Integration**: Puertos abiertos detectados
- **Detección de Servicios**: Identificación de servicios y versiones
- **Vulnerabilidades**: CVEs conocidos asociados
- **Evaluación de Riesgo**: Clasificación de puertos por nivel de amenaza

### Información Geográfica
- País, ciudad, región, código postal
- Zona horaria
- Coordenadas GPS con enlace a Google Maps
- ISP y organización

### Exportación de Datos
- **JSON**: Formato estructurado
- **CSV**: Compatible con Excel
- **PDF**: Reporte profesional con formato
- **Markdown**: Documentación

### Interfaz de Usuario
- Tema oscuro/claro
- Historial de búsquedas
- Loading states y skeleton screens
- Diseño responsive
- Integración con Shodan para investigación adicional

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn

## 🔧 Instalación

1. **Clona el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd project
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las claves API (opcional pero recomendado):**
   
   Copia el archivo de ejemplo:
   ```bash
   copy .env.example .env
   ```
   
   Edita `.env` y agrega tus claves API:
   
   - **AbuseIPDB** (gratis hasta 1000 requests/día): https://www.abuseipdb.com/api
   - **VirusTotal** (gratis con límites): https://www.virustotal.com/gui/my-apikey
   - **IPQualityScore** (gratis con límites): https://www.ipqualityscore.com/create-account
   - **AlienVault OTX** (gratis): https://otx.alienvault.com/api
   - **Shodan** (opcional): https://account.shodan.io/

   > **Nota**: La aplicación funciona sin claves API, pero con datos limitados. Para obtener información completa de threat intelligence y puertos, se recomienda configurar al menos AbuseIPDB y Shodan.

## 🎯 Uso

### Modo Desarrollo (Recomendado)

Inicia tanto el backend como el frontend:

```bash
npm run dev:full
```

O inícialos por separado:

```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend  
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`
El backend estará en `http://localhost:3001`

### Modo Producción

```bash
npm run build
npm run preview
```

## 📖 Cómo Usar la Aplicación

1. **Ingresa una dirección IP** en el campo de búsqueda (IPv4 o IPv6)
2. **Haz clic en "Analizar IP"** para obtener la información
3. **Explora los resultados** organizados en secciones:
   - Threat Intelligence: Análisis de seguridad agregado
   - Información Básica: Geolocalización e ISP
   - DNS Records: Todos los registros DNS disponibles
   - WHOIS: Información de registro
   - Port Analysis: Puertos abiertos y servicios (requiere Shodan API)
4. **Exporta los datos** usando el botón "Export Report" (JSON, CSV, PDF, o Markdown)
5. **Consulta el historial** de tus últimas 10 búsquedas

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 18 con TypeScript
- Vite (build tool)
- Tailwind CSS
- Lucide React (iconos)
- jsPDF + autoTable (exportación PDF)
- Recharts (visualizaciones)

### Backend
- Express.js
- Node.js con TypeScript
- Axios (HTTP client)
- node-cache (caching)
- express-rate-limit (rate limiting)
- whois-json (WHOIS lookups)
- dns (built-in Node module)

### APIs Integradas
- IP-API (geolocalización)
- AbuseIPDB
- VirusTotal
- IPQualityScore
- AlienVault OTX
- Shodan
- RIPE Stat (ASN/BGP)

## 📁 Estructura del Proyecto

```
project/
├── server/
│   ├── server.ts              # Servidor Express
│   └── services/
│       ├── threatIntel.ts     # Integraciones de threat intelligence
│       ├── networkTools.ts    # DNS, WHOIS, ASN
│       └── portScanning.ts    # Shodan integration
├── src/
│   ├── App.tsx                # Componente principal
│   ├── components/
│   │   ├── ThreatIntelCard.tsx
│   │   ├── DnsRecordsTable.tsx
│   │   ├── PortVisualization.tsx
│   │   ├── WhoisInfo.tsx
│   │   └── ExportMenu.tsx
│   └── utils/
│       └── exportHelpers.ts   # Funciones de exportación
├── .env.example               # Template de variables de entorno
└── package.json
```

## 🔐 Seguridad y Privacidad

- **API Keys**: Nunca expongas tus claves API en el frontend. Se manejan de forma segura en el servidor
- **Rate Limiting**: El servidor tiene rate limiting activado (100 requests/15 minutos por IP)
- **Caching**: Los resultados se cachean por 10 minutos para reducir llamadas a APIs externas
- **CORS**: Configurado apropiadamente para desarrollo y producción
- **No Logging**: No se registran ni almacenan las IPs analizadas

## ⚖️ Consideraciones Legales

Esta herramienta está diseñada para propósitos de investigación OSINT legítima y seguridad de red. El uso de esta herramienta debe cumplir con:

- Las leyes locales y regionales sobre ciberseguridad
- Los términos de servicio de las APIs utilizadas
- Principios éticos de investigación de seguridad

**No utilices esta herramienta para:**
- Actividades maliciosas o ilegales
- Escaneo no autorizado de sistemas
- Acoso o vigilancia no autorizada

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- IP-API por su API gratuita de geolocalización
- AbuseIPDB por su base de datos de IPs maliciosas
- VirusTotal por su plataforma de análisis de amenazas
- Shodan por su motor de búsqueda de dispositivos en internet
- AlienVault OTX por su plataforma de threat intelligence
- RIPE NCC por sus datos de ASN/BGP

## 📧 Contacto

Para preguntas, sugerencias o reportar problemas, abre un issue en GitHub.

---

**⚠️ Disclaimer**: Los datos proporcionados por esta herramienta son informativos y provienen de fuentes públicas. La precisión puede variar. Siempre verifica la información crítica con múltiples fuentes.