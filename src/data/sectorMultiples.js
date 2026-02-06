/**
 * Sector Multiples Database
 * Real-world valuation benchmarks for PyME (SME) companies
 * Source: Industry analysis and M&A transaction data
 */

export const SECTOR_MULTIPLES = {
    tecnologia: {
        name: 'Tecnología / Software',
        icon: '💻',
        evEbitda: { min: 8, max: 12, typical: 10 },
        evRevenue: { min: 3, max: 5, typical: 4 },
        peRatio: { min: 15, max: 25, typical: 20 },
        riskPremium: 0.04, // 4% additional risk
        benchmarks: {
            margenEbitda: 20,
            crecimiento: 15,
            roic: 18,
            deudaEbitda: 1.5
        }
    },
    retail: {
        name: 'Retail / Comercio',
        icon: '🛒',
        evEbitda: { min: 6, max: 8, typical: 7 },
        evRevenue: { min: 0.5, max: 1, typical: 0.75 },
        peRatio: { min: 10, max: 18, typical: 14 },
        riskPremium: 0.03,
        benchmarks: {
            margenEbitda: 8,
            crecimiento: 5,
            roic: 12,
            deudaEbitda: 2.5
        }
    },
    manufactura: {
        name: 'Manufactura / Industrial',
        icon: '🏭',
        evEbitda: { min: 5, max: 7, typical: 6 },
        evRevenue: { min: 0.8, max: 1.2, typical: 1 },
        peRatio: { min: 8, max: 15, typical: 12 },
        riskPremium: 0.025,
        benchmarks: {
            margenEbitda: 12,
            crecimiento: 4,
            roic: 10,
            deudaEbitda: 2
        }
    },
    servicios: {
        name: 'Servicios Profesionales',
        icon: '💼',
        evEbitda: { min: 6, max: 9, typical: 7.5 },
        evRevenue: { min: 1, max: 2, typical: 1.5 },
        peRatio: { min: 12, max: 20, typical: 16 },
        riskPremium: 0.03,
        benchmarks: {
            margenEbitda: 15,
            crecimiento: 8,
            roic: 20,
            deudaEbitda: 1
        }
    },
    alimentos: {
        name: 'Alimentos & Bebidas',
        icon: '🍽️',
        evEbitda: { min: 7, max: 10, typical: 8.5 },
        evRevenue: { min: 1, max: 1.5, typical: 1.25 },
        peRatio: { min: 12, max: 18, typical: 15 },
        riskPremium: 0.02,
        benchmarks: {
            margenEbitda: 10,
            crecimiento: 6,
            roic: 12,
            deudaEbitda: 2
        }
    },
    construccion: {
        name: 'Construcción',
        icon: '🏗️',
        evEbitda: { min: 5, max: 7, typical: 6 },
        evRevenue: { min: 0.4, max: 0.8, typical: 0.6 },
        peRatio: { min: 8, max: 14, typical: 11 },
        riskPremium: 0.035,
        benchmarks: {
            margenEbitda: 8,
            crecimiento: 3,
            roic: 10,
            deudaEbitda: 3
        }
    },
    salud: {
        name: 'Salud / Healthcare',
        icon: '🏥',
        evEbitda: { min: 8, max: 12, typical: 10 },
        evRevenue: { min: 2, max: 3, typical: 2.5 },
        peRatio: { min: 15, max: 25, typical: 20 },
        riskPremium: 0.025,
        benchmarks: {
            margenEbitda: 18,
            crecimiento: 10,
            roic: 15,
            deudaEbitda: 1.5
        }
    },
    agro: {
        name: 'Agro / Agricultura',
        icon: '🌾',
        evEbitda: { min: 6, max: 9, typical: 7.5 },
        evRevenue: { min: 0.8, max: 1.5, typical: 1.1 },
        peRatio: { min: 10, max: 16, typical: 13 },
        riskPremium: 0.04,
        benchmarks: {
            margenEbitda: 12,
            crecimiento: 5,
            roic: 10,
            deudaEbitda: 2.5
        }
    },
    logistica: {
        name: 'Transporte / Logística',
        icon: '🚚',
        evEbitda: { min: 6, max: 8, typical: 7 },
        evRevenue: { min: 0.5, max: 1, typical: 0.75 },
        peRatio: { min: 10, max: 16, typical: 13 },
        riskPremium: 0.03,
        benchmarks: {
            margenEbitda: 10,
            crecimiento: 6,
            roic: 12,
            deudaEbitda: 2.5
        }
    }
};

/**
 * Company Size Categories
 */
export const COMPANY_SIZES = {
    micro: {
        name: 'Microempresa',
        description: 'Menos de 10 empleados',
        employeeRange: [1, 9],
        sizeDiscount: 0.15, // 15% discount for size risk
        scorePoints: 5
    },
    pequena: {
        name: 'Pequeña Empresa',
        description: '10 a 50 empleados',
        employeeRange: [10, 50],
        sizeDiscount: 0.08,
        scorePoints: 10
    },
    mediana: {
        name: 'Mediana Empresa',
        description: '50 a 250 empleados',
        employeeRange: [51, 250],
        sizeDiscount: 0.03,
        scorePoints: 15
    }
};

/**
 * Scenario Adjustments
 */
export const SCENARIOS = {
    optimista: {
        name: 'Optimista',
        adjustment: 0.2, // +20%
        color: '#10b981',
        description: 'Mejor caso esperado'
    },
    base: {
        name: 'Base',
        adjustment: 0,
        color: '#3b82f6',
        description: 'Caso más probable'
    },
    pesimista: {
        name: 'Pesimista',
        adjustment: -0.2, // -20%
        color: '#ef4444',
        description: 'Caso conservador'
    }
};

/**
 * Default Financial Assumptions
 */
export const DEFAULTS = {
    taxRate: 0.25, // 25% corporate tax
    riskFreeRate: 0.05, // 5% risk-free rate
    marketPremium: 0.06, // 6% market risk premium
    terminalGrowth: 0.02, // 2% perpetuity growth
    depreciationRate: 0.05, // 5% of revenue
    capexRate: 0.03, // 3% of revenue
    projectionYears: 5
};

/**
 * Pre-loaded Example Companies
 */
export const EXAMPLES = {
    techStartup: {
        name: 'TechStart SaaS',
        description: 'Startup de software con alto crecimiento, bajo EBITDA',
        sector: 'tecnologia',
        tamano: 'pequena',
        antiguedad: 3,
        ingresos: [800000, 1200000, 1800000],
        ebitda: 180000,
        activos: 500000,
        pasivos: 150000,
        empleados: 25,
        tasaCrecimiento: 40,
        escenario: 'optimista'
    },
    retailConsolidado: {
        name: 'Distribuidora Central',
        description: 'Retail consolidado con crecimiento moderado, EBITDA saludable',
        sector: 'retail',
        tamano: 'mediana',
        antiguedad: 15,
        ingresos: [5000000, 5200000, 5500000],
        ebitda: 440000,
        activos: 3000000,
        pasivos: 1200000,
        empleados: 120,
        tasaCrecimiento: 5,
        escenario: 'base'
    },
    manufacturaTradicional: {
        name: 'Metalmecánica Industrial',
        description: 'Manufactura tradicional, bajo crecimiento, alto EBITDA',
        sector: 'manufactura',
        tamano: 'mediana',
        antiguedad: 25,
        ingresos: [8000000, 8100000, 8200000],
        ebitda: 1200000,
        activos: 6000000,
        pasivos: 2500000,
        empleados: 180,
        tasaCrecimiento: 2,
        escenario: 'pesimista'
    }
};
