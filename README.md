# 🏢 ValuaPyME - Simulador de Valuación de Empresas

<div align="center">

![ValuaPyME](https://img.shields.io/badge/ValuaPyME-v1.0.0-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite)

**Simulador profesional de valuación de empresas PyME para transacciones de M&A**

[🚀 Demo](#instalación-y-uso) · [📖 Documentación](#funcionalidades) · [🧮 Metodologías](#metodologías-de-valuación)

</div>

---

## 📋 Descripción

ValuaPyME es una aplicación web interactiva que permite a socios de PyMEs e inversores calcular el valor de una empresa de capital cerrado utilizando metodologías profesionales de valuación. La aplicación combina tres enfoques de valuación reconocidos internacionalmente y proporciona análisis visual avanzado.

### ¿Para quién es?
- 🎯 **Emprendedores** que quieren conocer el valor de su empresa
- 💼 **Inversores** evaluando oportunidades de inversión
- 📚 **Estudiantes** de finanzas y negocios
- 🤝 **Asesores** en procesos de M&A

---

## 🛠️ Tecnologías Utilizadas

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18.2 | Framework principal de UI |
| **Vite** | 5.0 | Build tool y dev server |
| **Tailwind CSS** | 3.4 | Framework de estilos utility-first |
| **Recharts** | 2.10 | Gráficos interactivos (barras, radar, gauge) |

### Utilidades
| Tecnología | Propósito |
|------------|-----------|
| **jsPDF** | Generación de reportes PDF |
| **html2canvas** | Captura de componentes para PDF |
| **LocalStorage API** | Persistencia de datos en el navegador |
| **Claude API** | Análisis narrativo con IA (opcional) |

### Arquitectura
- ⚛️ Componentes React funcionales con Hooks
- 🎨 Diseño Mobile-First responsive
- 💾 Sin backend - 100% client-side
- 🔒 API keys almacenadas solo en sesión

---

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/Simulador-de-Valuacion-de-Empresas.git

# Entrar al directorio
cd Simulador-de-Valuacion-de-Empresas

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la versión de producción |
| `npm run preview` | Previsualiza el build de producción |

---

## ✨ Funcionalidades

### 📊 Wizard de 3 Pasos

**Paso 1: Información Básica**
- Nombre de la empresa (opcional)
- Selección de sector industrial (9 opciones)
- Tamaño: Micro, Pequeña, Mediana
- Antigüedad de la empresa

**Paso 2: Datos Financieros**
- Ingresos anuales (últimos 3 años)
- EBITDA del último año
- Activos totales
- Pasivos totales
- Cálculo automático de CAGR y Margen EBITDA

**Paso 3: Proyecciones**
- Tasa de crecimiento esperada (slider -10% a +50%)
- WACC automático o manual (5% a 25%)
- Escenario: Optimista (+20%), Base, Pesimista (-20%)

### 📈 Dashboard de Resultados

- **Valor Principal**: Enterprise Value con animación de contador
- **Rango de Valuación**: Visualización min-max con slider
- **Desglose por Metodología**: Gráfico de barras horizontales
- **Investment Readiness Score**: Gauge SVG (0-100 puntos)
- **Métricas Clave**: EV/EBITDA, Margen EBITDA, Deuda/EBITDA, WACC
- **Benchmarking Radar**: Comparación empresa vs sector

### 🎛️ Simulador What-If

Sliders interactivos para simular escenarios en tiempo real:
- Cambio en Margen EBITDA (±30%)
- Cambio en Tasa de Crecimiento (±20pp)
- Ajuste al Múltiplo EV/EBITDA (±3x)
- Cambio en WACC (±3pp)

Incluye **Gráfico Tornado** de sensibilidad.

### 🤖 Análisis con IA

Integración con Claude API para generar análisis ejecutivo que incluye:
- Resumen de salud financiera
- Fortalezas y debilidades clave
- Comparación vs sector
- Recomendaciones para aumentar valor
- Red flags identificados

> Requiere API key de Anthropic (Claude)

### 💾 Persistencia y Exportación

- **Guardar Valuación**: Almacena hasta 20 valuaciones en localStorage
- **Historial**: Vista de tarjetas con todas las valuaciones guardadas
- **Comparador**: Tabla comparativa de 2-3 empresas
- **Exportar PDF**: Reporte profesional de 4 páginas

### 📚 Glosario Educativo

Sidebar deslizable con definiciones de:
- Metodologías de valuación
- Métricas financieras (EBITDA, EV, WACC, CAGR)
- Ratios clave
- Conceptos de M&A

---

## 🧮 Metodologías de Valuación

### 1. Múltiplos Comparables (40% del peso)

Valúa la empresa comparándola con transacciones similares del sector.

```
EV = (EBITDA × Múltiplo_EV/EBITDA × 0.7) + (Revenue × Múltiplo_EV/Revenue × 0.3)
```

**Múltiplos por Sector:**

| Sector | EV/EBITDA | EV/Revenue |
|--------|-----------|------------|
| Tecnología/Software | 8-12x | 3-5x |
| Retail | 6-8x | 0.5-1x |
| Manufactura | 5-7x | 0.8-1.2x |
| Servicios Profesionales | 6-9x | 1-2x |
| Alimentos & Bebidas | 7-10x | 1-1.5x |
| Construcción | 5-7x | 0.4-0.8x |
| Salud | 8-12x | 2-3x |
| Agro | 6-9x | 0.8-1.5x |
| Transporte/Logística | 6-8x | 0.5-1x |

### 2. Flujo de Caja Descontado - DCF (40% del peso)

Proyecta 5 años de flujos de caja y calcula el valor presente.

```
FCF = EBITDA × (1 - Tax Rate) × 0.85
VP = Σ(FCF_t / (1 + WACC)^t) + Terminal Value / (1 + WACC)^5

Terminal Value = FCF_5 × (1 + g) / (WACC - g)
Donde g = 2% (crecimiento perpetuo)
```

**Cálculo del WACC:**
```
WACC = (E/V × Re) + (D/V × Rd × (1 - Tc))

Donde:
- E = Equity (Activos - Pasivos)
- D = Deuda total
- V = E + D
- Re = Costo del equity (CAPM simplificado)
- Rd = Costo de la deuda (8-12%)
- Tc = Tasa impositiva (25%)
```

### 3. Valor Patrimonial Ajustado (20% del peso)

Calcula el valor basado en activos netos más ajustes.

```
Valor = (Activos - Pasivos) × Multiplicador_Goodwill + Intangibles_Estimados

Multiplicador_Goodwill:
- Base: 1.0
- +0.15 si antigüedad ≥ 10 años
- +0.08 si antigüedad ≥ 5 años
- +0.10 si empresa mediana
- +0.05 si empresa pequeña

Intangibles = Activos × (15% si tech/servicios, 5% otros)
```

### Fórmula Final Ponderada

```
EV_Final = (Múltiplos × 0.4) + (DCF × 0.4) + (Patrimonial × 0.2)
EV_Ajustado = EV_Final × (1 - Descuento_por_Tamaño)

Descuentos por tamaño:
- Microempresa: -15%
- Pequeña: -8%
- Mediana: -3%
```

---

## 🎯 Investment Readiness Score

El score de 0-100 evalúa qué tan atractiva es la empresa para inversores.

| Factor | Puntos Máx | Criterios |
|--------|------------|-----------|
| Margen EBITDA | 25 | ≥15% = 25pts, 10-15% = 15pts, 5-10% = 8pts |
| Ratio Deuda/EBITDA | 20 | ≤2x = 20pts, 2-4x = 12pts, 4-6x = 5pts |
| Crecimiento CAGR | 20 | ≥15% = 20pts, 10-15% = 15pts, 5-10% = 10pts |
| Tamaño/Escala | 15 | Mediana = 15pts, Pequeña = 10pts, Micro = 5pts |
| Antigüedad | 10 | ≥10 años = 10pts, 5-10 = 7pts, 2-5 = 4pts |
| Liquidez (Activos/Pasivos) | 10 | ≥1.5x = 10pts, 1.2-1.5x = 7pts, 1-1.2x = 4pts |

**Badges automáticos:**
- 🏆 EBITDA Saludable (margen ≥15%)
- 💪 Bajo Endeudamiento (D/EBITDA ≤2x)
- 📈 Alto Crecimiento (CAGR ≥10%)
- ⚡ Líquido (ratio ≥1.5x)
- 🏛️ Empresa Consolidada (≥10 años)
- ⭐ Top Performer (score ≥80)

---

## 📁 Estructura del Proyecto

```
src/
├── App.jsx                      # Componente principal con estado global
├── main.jsx                     # Entry point de React
├── index.css                    # Estilos Tailwind + custom CSS
│
├── components/
│   ├── Header.jsx               # Navegación y logo
│   ├── WizardContainer.jsx      # Wizard de 3 pasos con progress bar
│   ├── ResultsDashboard.jsx     # Dashboard de resultados con gráficos
│   ├── WhatIfSimulator.jsx      # Simulador interactivo
│   ├── Glossary.jsx             # Sidebar educativo
│   ├── ValuationHistory.jsx     # Lista de valuaciones guardadas
│   │
│   ├── steps/
│   │   ├── Step1BasicInfo.jsx   # Datos básicos de empresa
│   │   ├── Step2Financial.jsx   # Datos financieros
│   │   └── Step3Projections.jsx # Proyecciones y WACC
│   │
│   └── charts/
│       └── InvestmentScoreGauge.jsx  # Gauge SVG animado
│
├── utils/
│   ├── calculations.js          # Algoritmos de valuación
│   ├── storage.js               # Helpers de localStorage
│   └── pdfGenerator.js          # Generación de PDF con jsPDF
│
└── data/
    └── sectorMultiples.js       # Base de datos de múltiplos
```

---

## 🎨 Diseño y UX

### Paleta de Colores
- **Primario**: Azul corporativo (#1e40af → #3b82f6)
- **Éxito**: Verde financiero (#059669)
- **Acento**: Dorado (#f59e0b)
- **Neutros**: Escala de grises slate

### Efectos Visuales
- Glassmorphism en tarjetas
- Gradientes sutiles
- Animaciones CSS (fade-in, slide-up, confetti)
- Transiciones suaves en hover

### Responsividad
- Mobile: < 640px (wizard vertical, cards en columna)
- Tablet: 640-1024px (layout 2 columnas)
- Desktop: > 1024px (dashboard completo)

---

## 🔐 Seguridad y Privacidad

- ✅ Sin backend - datos procesados localmente
- ✅ API keys almacenadas solo en sessionStorage (no persisten)
- ✅ LocalStorage encriptable por el navegador
- ✅ No se envían datos a servidores externos (excepto Claude API si se usa)

---

## 📄 Exportación PDF

El reporte PDF incluye:

1. **Portada**: Logo, nombre de empresa, sector, fecha
2. **Resumen**: Enterprise Value, rango, métricas clave
3. **Metodologías**: Desglose detallado de cada método
4. **Investment Score**: Breakdown de puntuación
5. **Análisis IA**: Si fue generado
6. **Disclaimers**: Supuestos y limitaciones

---

## ⚠️ Limitaciones

- Los múltiplos son promedios sectoriales y pueden variar
- El modelo DCF asume crecimiento constante
- No reemplaza una valuación profesional con due diligence
- Los resultados son estimaciones educativas

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📜 Licencia

Este proyecto es de código abierto bajo la licencia MIT.

---

## 👨‍💻 Autor

Desarrollado como proyecto académico universitario.

---

<div align="center">

**⭐ Si te resultó útil, dale una estrella al repositorio ⭐**

</div>
