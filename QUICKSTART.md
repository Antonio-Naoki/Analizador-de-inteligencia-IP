# 🚀 Quick Start Guide - Enhanced IP OSINT Analyzer

## ⚡ Inicio Rápido (Sin API Keys)

Si quieres probar la aplicación inmediatamente sin configurar API keys:

```bash
# 1. Instalar dependencias (ya hecho)
npm install

# 2. Iniciar ambos servidores
npm run dev:full
```

La aplicación estará disponible en: **http://localhost:5173**

> **Nota**: Sin API keys, tendrás acceso a geolocalización básica, DNS, WHOIS y ASN. Para threat intelligence completa y port scanning, necesitas configurar las API keys.

---

## 🔑 Configuración Completa (Con API Keys)

Para acceder a todas las funcionalidades:

### 1. Crear archivo .env

Desde el directorio del proyecto:

**Windows PowerShell:**
```powershell
Copy-Item .env.example .env
```

**Windows CMD:**
```cmd
copy .env.example .env
```

### 2. Obtener API Keys (Todas Gratuitas)

#### AbuseIPDB (Recomendado - Alta prioridad)
1. Visita: https://www.abuseipdb.com/register
2. Crea una cuenta gratuita
3. Ve a tu perfil > API
4. Copia tu API key
5. **Límite gratuito:** 1,000 requests/día

#### Shodan (Recomendado - Para port scanning)
1. Visita: https://account.shodan.io/register
2. Crea una cuenta
3. Ve a https://account.shodan.io/
4. Copia tu API key bajo "API Key"
5. **Límite gratuito:** 100 scan credits/mes

#### VirusTotal
1. Visita: https://www.virustotal.com/gui/join-us
2. Crea una cuenta
3. Ve a tu perfil > API Key
4. **Límite gratuito:** 4 requests/minuto, 500/día

#### IPQualityScore
1. Visita: https://www.ipqualityscore.com/create-account
2. Crea una cuenta gratuita
3. Dashboard > API Key
4. **Límite gratuito:** 5,000 requests/mes

#### AlienVault OTX
1. Visita: https://otx.alienvault.com/accounts/signup/
2. Crea una cuenta
3. Settings > API Integration
4. **Límite:** Ilimitado (con rate limiting razonable)

### 3. Configurar el archivo .env

Edita el archivo `.env` con tus keys:

```env
# Alta prioridad (para mejor experiencia)
ABUSEIPDB_API_KEY=tu_key_aqui
SHODAN_API_KEY=tu_key_aqui

# Media prioridad
VIRUSTOTAL_API_KEY=tu_key_aqui
IPQUALITYSCORE_API_KEY=tu_key_aqui

# Baja prioridad (complementario)
ALIENVALUT_OTX_API_KEY=tu_key_aqui

# Configuración del servidor
PORT=3001
NODE_ENV=development
```

### 4. Reiniciar el servidor

Si el servidor ya está corriendo, detenlo (Ctrl+C) y reinícialo:

```bash
npm run dev:full
```

---

## 📊 Probando la Aplicación

### IPs de Prueba Recomendadas

**IP Limpia (Google DNS):**
```
8.8.8.8
```
- Debería mostrar threat level: LOW o CLEAN
- Ubicación: Mountain View, California
- ISP: Google LLC

**IP con Actividad (Ejemplo):**
```
1.1.1.1
```
- Cloudflare DNS
- Limpia pero con mucha actividad

**IP Propia:**
- Haz clic en la IP mostrada en la esquina superior derecha
- Analiza tu propia IP pública

### Funcionalidades a Probar

1. **Threat Intelligence**
   - Verifica el score agregado
   - Revisa las detecciones de cada fuente
   - Observa el nivel de amenaza

2. **DNS Records**
   - Expande la tabla de registros DNS
   - Usa el botón de copiar para cada registro

3. **WHOIS Information**
   - Revisa la información de organización
   - Expande "View Raw WHOIS Data"

4. **Port Analysis** (requiere Shodan API)
   - Ve los puertos abiertos
   - Revisa servicios detectados
   - Observa vulnerabilidades (si las hay)

5. **Export**
   - Haz clic en "Export Report"
   - Prueba cada formato:
     - JSON → Para procesamiento automático
     - CSV → Abre en Excel
     - PDF → Reporte profesional
     - Markdown → Documentación

6. **Theme Toggle**
   - Haz clic en el icono de sol/luna
   - Verifica que el tema cambie y persista

7. **Historial**
   - Busca varias IPs
   - Verifica que aparezcan en búsquedas recientes
   - Haz clic en una búsqueda reciente

---

## 🔧 Troubleshooting

### El servidor backend no inicia
```bash
# Verifica que el puerto 3001 esté libre
netstat -ano | findstr :3001

# Si está ocupado, cambia el puerto en .env
PORT=3002
```

### "API Key not configured" warnings
- Es normal si no has configurado todas las API keys
- La app sigue funcionando con las que tengas
- Solo afecta la cantidad de datos en threat intelligence

### Frontend no conecta con backend
- Verifica que ambos servidores estén corriendo
- Backend: http://localhost:3001
- Frontend: http://localhost:5173
- El proxy de Vite debe manejar `/api/*` automáticamente

### Error de CORS
- Asegúrate que el backend tenga CORS habilitado (ya configurado)
- Ambos servidores deben estar corriendo

---

## 💡 Consejos de Uso

### Optimiza tus API Credits

1. **Usa el cache**: Espera 10 minutos antes de re-analizar la misma IP
2. **Prioriza keys**: AbuseIPDB + Shodan dan los mejores resultados
3. **Monitorea límites**: Revisa los logs del servidor para uso de APIs

### Interpreta los Resultados

**Threat Level: CRITICAL/HIGH**
- ⚠️ IP potencialmente peligrosa
- Verifica las detecciones específicas
- Revisa los puertos abiertos

**Threat Level: MEDIUM**
- 🟡 Actividad sospechosa detectada
- Puede ser un proxy/VPN legítimo
- Analiza el contexto

**Threat Level: LOW/CLEAN**
- ✅ Sin amenazas detectadas
- Servicios legítimos probables
- Aún así revisa los datos

### Export Best Practices

- **PDF** → Para reportes ejecutivos o clientes
- **CSV** → Para análisis en Excel
- **JSON** → Para integración con otras herramientas
- **Markdown** → Para documentación técnica

---

## 📱 Uso Móvil

La interfaz es completamente responsive:
- Navega desde tu smartphone
- Misma funcionalidad que desktop
- UI adaptada para pantallas pequeñas

---

## 🎯 Próximos Pasos

1. **Configura tus API keys** para máxima funcionalidad
2. **Analiza IPs conocidas** para familiarizarte
3. **Exporta reportes** en diferentes formatos
4. **Explora el código** para personalizaciones

---

## ⚖️ Uso Responsable

### ✅ Usos Legítimos:
- Análisis de seguridad de tu propia infraestructura
- Investigación OSINT autorizada
- Detección de amenazas
- Análisis de tráfico de red propio

### ❌ NO Uses Para:
- Escaneo masivo no autorizado
- Vigilancia ilegal
- Acoso o stalking
- Acceso no autorizado a sistemas

---

## 📞 Soporte

Si encuentras problemas:
1. Revisa la consola del navegador (F12)
2. Revisa los logs del servidor backend
3. Verifica tus API keys
4. Consulta el README.md completo

---

**¡Listo para analizar IPs! 🚀**

*Última actualización: ${new Date().toLocaleDateString('es-ES')}*
