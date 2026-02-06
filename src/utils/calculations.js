/**
 * Valuation Calculation Utilities
 * Core financial algorithms for SME valuation
 */

import { SECTOR_MULTIPLES, COMPANY_SIZES, DEFAULTS } from '../data/sectorMultiples';

/**
 * Calculate valuation using Comparable Multiples method
 * @param {Object} data - Company financial data
 * @returns {Object} Valuation result with details
 */
export function calculateMultiples(data) {
    const { sector, ebitda, ingresos } = data;
    const sectorData = SECTOR_MULTIPLES[sector];

    if (!sectorData || !ebitda) {
        return { value: 0, details: {} };
    }

    const latestRevenue = Array.isArray(ingresos) ? ingresos[ingresos.length - 1] : ingresos;

    // Calculate EV using EBITDA multiple
    const evEbitdaMultiple = sectorData.evEbitda.typical;
    const evFromEbitda = ebitda * evEbitdaMultiple;

    // Calculate EV using Revenue multiple
    const evRevenueMultiple = sectorData.evRevenue.typical;
    const evFromRevenue = latestRevenue * evRevenueMultiple;

    // Weighted average (70% EBITDA, 30% Revenue for SMEs)
    const enterpriseValue = (evFromEbitda * 0.7) + (evFromRevenue * 0.3);

    // Calculate range
    const minValue = (ebitda * sectorData.evEbitda.min * 0.7) + (latestRevenue * sectorData.evRevenue.min * 0.3);
    const maxValue = (ebitda * sectorData.evEbitda.max * 0.7) + (latestRevenue * sectorData.evRevenue.max * 0.3);

    return {
        value: enterpriseValue,
        min: minValue,
        max: maxValue,
        details: {
            evEbitdaMultiple,
            evRevenueMultiple,
            evFromEbitda,
            evFromRevenue
        }
    };
}

/**
 * Calculate valuation using Simplified DCF method
 * @param {Object} data - Company financial data
 * @returns {Object} DCF valuation result
 */
export function calculateDCF(data) {
    const { ebitda, tasaCrecimiento, wacc: inputWacc, sector } = data;

    if (!ebitda || tasaCrecimiento === undefined) {
        return { value: 0, details: {} };
    }

    const wacc = inputWacc || calculateWACC(data);
    const growthRate = tasaCrecimiento / 100;
    const taxRate = DEFAULTS.taxRate;
    const depRate = DEFAULTS.depreciationRate;
    const capexRate = DEFAULTS.capexRate;
    const terminalGrowth = DEFAULTS.terminalGrowth;
    const years = DEFAULTS.projectionYears;

    // Project future free cash flows
    const projectedFCF = [];
    let currentEbitda = ebitda;

    for (let year = 1; year <= years; year++) {
        currentEbitda = currentEbitda * (1 + growthRate);

        // FCF = EBITDA × (1 - Tax Rate) - CapEx + Depreciation
        // Simplified: FCF ≈ EBITDA × (1 - Tax Rate) × 0.85 (assuming net reinvestment)
        const fcf = currentEbitda * (1 - taxRate) * 0.85;

        // Discount to present value
        const discountFactor = Math.pow(1 + wacc, year);
        const presentValue = fcf / discountFactor;

        projectedFCF.push({
            year,
            ebitda: currentEbitda,
            fcf,
            discountFactor,
            presentValue
        });
    }

    // Calculate terminal value using Gordon Growth Model
    const finalFCF = projectedFCF[years - 1].fcf;
    const terminalValue = (finalFCF * (1 + terminalGrowth)) / (wacc - terminalGrowth);
    const terminalValuePV = terminalValue / Math.pow(1 + wacc, years);

    // Sum of all present values
    const sumPV = projectedFCF.reduce((sum, fcf) => sum + fcf.presentValue, 0);
    const enterpriseValue = sumPV + terminalValuePV;

    return {
        value: enterpriseValue,
        details: {
            wacc,
            growthRate,
            projectedFCF,
            terminalValue,
            terminalValuePV,
            sumPV
        }
    };
}

/**
 * Calculate valuation using Adjusted Asset Value method
 * @param {Object} data - Company financial data
 * @returns {Object} Asset-based valuation result
 */
export function calculateAssetValue(data) {
    const { activos, pasivos, antiguedad, tamano, sector } = data;

    if (!activos) {
        return { value: 0, details: {} };
    }

    // Book value
    const bookValue = activos - (pasivos || 0);

    // Goodwill adjustment based on company age and size
    let goodwillMultiplier = 1.0;

    // Age premium
    if (antiguedad >= 10) {
        goodwillMultiplier += 0.15;
    } else if (antiguedad >= 5) {
        goodwillMultiplier += 0.08;
    } else if (antiguedad >= 2) {
        goodwillMultiplier += 0.03;
    }

    // Size premium
    const sizeData = COMPANY_SIZES[tamano];
    if (tamano === 'mediana') {
        goodwillMultiplier += 0.10;
    } else if (tamano === 'pequena') {
        goodwillMultiplier += 0.05;
    }

    // Intangibles estimation (brand, relationships, know-how)
    const sectorData = SECTOR_MULTIPLES[sector];
    const intangibleFactor = sector === 'tecnologia' || sector === 'servicios' ? 0.15 : 0.05;
    const estimatedIntangibles = activos * intangibleFactor;

    const adjustedValue = (bookValue * goodwillMultiplier) + estimatedIntangibles;

    return {
        value: Math.max(adjustedValue, bookValue), // Never less than book value
        min: bookValue,
        max: adjustedValue * 1.2,
        details: {
            bookValue,
            goodwillMultiplier,
            estimatedIntangibles,
            adjustedValue
        }
    };
}

/**
 * Calculate Weighted Average Cost of Capital (WACC)
 * @param {Object} data - Company financial data
 * @returns {number} WACC as decimal
 */
export function calculateWACC(data) {
    const { activos, pasivos, sector } = data;

    const equity = (activos || 0) - (pasivos || 0);
    const debt = pasivos || 0;
    const totalValue = equity + debt;

    if (totalValue <= 0) {
        return 0.12; // Default 12%
    }

    const sectorData = SECTOR_MULTIPLES[sector] || {};
    const riskPremium = sectorData.riskPremium || 0.03;

    // Cost of Equity (CAPM simplified)
    const riskFree = DEFAULTS.riskFreeRate;
    const marketPremium = DEFAULTS.marketPremium;
    const beta = 1.0 + riskPremium * 10; // Approximate beta from risk premium
    const costOfEquity = riskFree + (beta * marketPremium) + riskPremium;

    // Cost of Debt (estimated based on size risk)
    const baseCostOfDebt = 0.08; // 8% base rate
    const costOfDebt = baseCostOfDebt + riskPremium;

    // Tax shield
    const taxRate = DEFAULTS.taxRate;
    const afterTaxCostOfDebt = costOfDebt * (1 - taxRate);

    // WACC calculation
    const equityWeight = equity / totalValue;
    const debtWeight = debt / totalValue;

    const wacc = (equityWeight * costOfEquity) + (debtWeight * afterTaxCostOfDebt);

    return Math.max(0.08, Math.min(0.25, wacc)); // Bound between 8% and 25%
}

/**
 * Calculate Investment Readiness Score (0-100)
 * @param {Object} data - Company financial data
 * @param {Object} results - Valuation results
 * @returns {Object} Score and breakdown
 */
export function calculateInvestmentScore(data, results) {
    const { ebitda, ingresos, activos, pasivos, tamano, antiguedad } = data;

    const latestRevenue = Array.isArray(ingresos) ? ingresos[ingresos.length - 1] : ingresos;

    let score = 0;
    const breakdown = [];

    // 1. EBITDA Margin (25 points max)
    const margenEbitda = (ebitda / latestRevenue) * 100;
    let margenPoints = 0;
    if (margenEbitda >= 15) {
        margenPoints = 25;
    } else if (margenEbitda >= 10) {
        margenPoints = 15;
    } else if (margenEbitda >= 5) {
        margenPoints = 8;
    } else {
        margenPoints = 3;
    }
    score += margenPoints;
    breakdown.push({
        name: 'Margen EBITDA',
        points: margenPoints,
        maxPoints: 25,
        value: `${margenEbitda.toFixed(1)}%`,
        status: margenEbitda >= 15 ? 'excellent' : margenEbitda >= 10 ? 'good' : margenEbitda >= 5 ? 'fair' : 'poor'
    });

    // 2. Debt/EBITDA Ratio (20 points max)
    const debtRatio = ebitda > 0 ? pasivos / ebitda : 999;
    let debtPoints = 0;
    if (debtRatio <= 2) {
        debtPoints = 20;
    } else if (debtRatio <= 4) {
        debtPoints = 12;
    } else if (debtRatio <= 6) {
        debtPoints = 5;
    } else {
        debtPoints = 0;
    }
    score += debtPoints;
    breakdown.push({
        name: 'Ratio Deuda/EBITDA',
        points: debtPoints,
        maxPoints: 20,
        value: `${debtRatio.toFixed(1)}x`,
        status: debtRatio <= 2 ? 'excellent' : debtRatio <= 4 ? 'good' : debtRatio <= 6 ? 'fair' : 'poor'
    });

    // 3. Revenue Growth CAGR (20 points max)
    let growthPoints = 0;
    let cagr = 0;
    if (Array.isArray(ingresos) && ingresos.length >= 2) {
        const firstRevenue = ingresos[0];
        const lastRevenue = ingresos[ingresos.length - 1];
        const years = ingresos.length - 1;
        cagr = (Math.pow(lastRevenue / firstRevenue, 1 / years) - 1) * 100;

        if (cagr >= 15) {
            growthPoints = 20;
        } else if (cagr >= 10) {
            growthPoints = 15;
        } else if (cagr >= 5) {
            growthPoints = 10;
        } else if (cagr >= 0) {
            growthPoints = 5;
        } else {
            growthPoints = 0;
        }
    }
    score += growthPoints;
    breakdown.push({
        name: 'Crecimiento (CAGR)',
        points: growthPoints,
        maxPoints: 20,
        value: `${cagr.toFixed(1)}%`,
        status: cagr >= 15 ? 'excellent' : cagr >= 10 ? 'good' : cagr >= 5 ? 'fair' : 'poor'
    });

    // 4. Company Size (15 points max)
    const sizeData = COMPANY_SIZES[tamano];
    const sizePoints = sizeData ? sizeData.scorePoints : 5;
    score += sizePoints;
    breakdown.push({
        name: 'Tamaño/Escala',
        points: sizePoints,
        maxPoints: 15,
        value: sizeData ? sizeData.name : tamano,
        status: sizePoints >= 12 ? 'excellent' : sizePoints >= 8 ? 'good' : 'fair'
    });

    // 5. Company Age (10 points max)
    let agePoints = 0;
    if (antiguedad >= 10) {
        agePoints = 10;
    } else if (antiguedad >= 5) {
        agePoints = 7;
    } else if (antiguedad >= 2) {
        agePoints = 4;
    } else {
        agePoints = 2;
    }
    score += agePoints;
    breakdown.push({
        name: 'Antigüedad',
        points: agePoints,
        maxPoints: 10,
        value: `${antiguedad} años`,
        status: antiguedad >= 10 ? 'excellent' : antiguedad >= 5 ? 'good' : antiguedad >= 2 ? 'fair' : 'poor'
    });

    // 6. Liquidity (Current Ratio) (10 points max)
    const currentRatio = pasivos > 0 ? activos / pasivos : 999;
    let liquidityPoints = 0;
    if (currentRatio >= 1.5) {
        liquidityPoints = 10;
    } else if (currentRatio >= 1.2) {
        liquidityPoints = 7;
    } else if (currentRatio >= 1.0) {
        liquidityPoints = 4;
    } else {
        liquidityPoints = 0;
    }
    score += liquidityPoints;
    breakdown.push({
        name: 'Liquidez',
        points: liquidityPoints,
        maxPoints: 10,
        value: `${currentRatio.toFixed(2)}x`,
        status: currentRatio >= 1.5 ? 'excellent' : currentRatio >= 1.2 ? 'good' : currentRatio >= 1.0 ? 'fair' : 'poor'
    });

    // Generate badges
    const badges = [];
    if (margenEbitda >= 15) badges.push({ icon: '🏆', text: 'EBITDA Saludable', color: 'success' });
    if (debtRatio <= 2) badges.push({ icon: '💪', text: 'Bajo Endeudamiento', color: 'success' });
    if (cagr >= 10) badges.push({ icon: '📈', text: 'Alto Crecimiento', color: 'success' });
    if (currentRatio >= 1.5) badges.push({ icon: '⚡', text: 'Líquido', color: 'info' });
    if (antiguedad >= 10) badges.push({ icon: '🏛️', text: 'Empresa Consolidada', color: 'info' });
    if (score >= 80) badges.push({ icon: '⭐', text: 'Top Performer', color: 'accent' });

    // Red flags
    if (margenEbitda < 5) badges.push({ icon: '⚠️', text: 'Margen Bajo', color: 'warning' });
    if (debtRatio > 6) badges.push({ icon: '🚨', text: 'Alto Endeudamiento', color: 'danger' });
    if (currentRatio < 1) badges.push({ icon: '🔴', text: 'Riesgo de Liquidez', color: 'danger' });

    return {
        score,
        breakdown,
        badges,
        rating: score >= 80 ? 'Excelente' : score >= 60 ? 'Bueno' : score >= 40 ? 'Regular' : 'Bajo'
    };
}

/**
 * Calculate final weighted valuation
 * @param {Object} data - Company financial data
 * @returns {Object} Complete valuation results
 */
export function calculateValuation(data) {
    const multiplesResult = calculateMultiples(data);
    const dcfResult = calculateDCF(data);
    const assetResult = calculateAssetValue(data);

    // Weighted average: 40% Multiples, 40% DCF, 20% Asset
    const weightedValue =
        (multiplesResult.value * 0.4) +
        (dcfResult.value * 0.4) +
        (assetResult.value * 0.2);

    // Apply size discount
    const sizeData = COMPANY_SIZES[data.tamano];
    const sizeDiscount = sizeData ? sizeData.sizeDiscount : 0;
    const adjustedValue = weightedValue * (1 - sizeDiscount);

    // Calculate range based on scenario
    const scenarioAdjustment = data.escenario === 'optimista' ? 0.2 :
        data.escenario === 'pesimista' ? -0.2 : 0;

    const minValue = adjustedValue * 0.85; // -15% for range
    const maxValue = adjustedValue * 1.15; // +15% for range

    // Calculate equity value (subtract net debt)
    const netDebt = (data.pasivos || 0) - (data.efectivo || 0);
    const equityValue = Math.max(0, adjustedValue - netDebt);

    const investmentScore = calculateInvestmentScore(data, {
        multiplesResult,
        dcfResult,
        assetResult
    });

    return {
        enterpriseValue: adjustedValue,
        equityValue,
        range: {
            min: minValue,
            max: maxValue
        },
        methodologies: {
            multiples: multiplesResult,
            dcf: dcfResult,
            asset: assetResult
        },
        weights: {
            multiples: 0.4,
            dcf: 0.4,
            asset: 0.2
        },
        sizeDiscount,
        investmentScore,
        wacc: dcfResult.details.wacc || calculateWACC(data),
        timestamp: new Date().toISOString()
    };
}

/**
 * Calculate CAGR from revenue array
 * @param {Array} revenues - Array of annual revenues
 * @returns {number} CAGR as percentage
 */
export function calculateCAGR(revenues) {
    if (!Array.isArray(revenues) || revenues.length < 2) return 0;

    const firstValue = revenues[0];
    const lastValue = revenues[revenues.length - 1];
    const years = revenues.length - 1;

    if (firstValue <= 0) return 0;

    return (Math.pow(lastValue / firstValue, 1 / years) - 1) * 100;
}

/**
 * Format currency value
 * @param {number} value - Numeric value
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, currency = 'USD') {
    if (value === undefined || value === null || isNaN(value)) return '-';

    const formatter = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    return formatter.format(value);
}

/**
 * Format number with abbreviation (K, M, B)
 * @param {number} value - Numeric value
 * @returns {string} Abbreviated string
 */
export function formatAbbreviated(value) {
    if (value === undefined || value === null || isNaN(value)) return '-';

    if (value >= 1e9) {
        return `$${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
        return `$${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
        return `$${(value / 1e3).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
}

/**
 * Format percentage
 * @param {number} value - Numeric value (decimal or percentage)
 * @param {boolean} isDecimal - If true, value is in decimal form
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, isDecimal = false) {
    if (value === undefined || value === null || isNaN(value)) return '-';

    const percentage = isDecimal ? value * 100 : value;
    return `${percentage.toFixed(1)}%`;
}
