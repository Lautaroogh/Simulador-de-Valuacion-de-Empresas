/**
 * PDF Generator Utility
 * Generates professional PDF reports of valuations
 */
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { formatCurrency, formatPercentage } from './calculations';
import { SECTOR_MULTIPLES } from '../data/sectorMultiples';

/**
 * Generate a PDF report from valuation results
 * @param {Object} results - Valuation results
 * @param {Object} companyData - Company input data
 * @param {string} aiAnalysis - AI-generated analysis text
 * @returns {Promise<void>}
 */
export async function generatePDFReport(results, companyData, aiAnalysis = null) {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    const sectorData = SECTOR_MULTIPLES[companyData.sector];
    const companyName = companyData.nombre || 'Empresa Analizada';
    const latestRevenue = results?.companyData?.ingresos?.[results.companyData.ingresos.length - 1] || 0;
    const ebitdaMargin = latestRevenue > 0 ? (results?.companyData?.ebitda / latestRevenue) * 100 : 0;
    const debtRatio = results?.companyData?.ebitda > 0 ? results?.companyData?.pasivos / results.companyData.ebitda : 0;

    // =====================
    // PAGE 1: Cover & Summary
    // =====================

    // Header gradient (simulated with rectangles)
    doc.setFillColor(30, 64, 175); // primary-800
    doc.rect(0, 0, pageWidth, 60, 'F');

    // Logo/Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('ValuaPyME', margin, 35);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Informe de Valuación de Empresa', margin, 48);

    // Company Name
    doc.setTextColor(30, 41, 59); // slate-800
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName, margin, 85);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Sector: ${sectorData?.name || 'N/A'}`, margin, 95);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-AR')}`, margin, 103);

    // Main Value Box
    doc.setFillColor(239, 246, 255); // primary-50
    doc.roundedRect(margin, 115, contentWidth, 50, 5, 5, 'F');

    doc.setTextColor(30, 64, 175); // primary-800
    doc.setFontSize(10);
    doc.text('ENTERPRISE VALUE ESTIMADO', margin + 10, 130);

    doc.setTextColor(30, 64, 175);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(results?.enterpriseValue), margin + 10, 150);

    // Range
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Rango: ${formatCurrency(results?.range?.min)} - ${formatCurrency(results?.range?.max)}`, pageWidth - margin - 60, 150);

    // Key Metrics Grid
    let yPos = 180;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Métricas Clave', margin, yPos);
    yPos += 10;

    const metrics = [
        { label: 'Investment Score', value: `${results?.investmentScore?.score}/100`, rating: results?.investmentScore?.rating },
        { label: 'EV/EBITDA', value: `${(results?.enterpriseValue / results?.companyData?.ebitda).toFixed(1)}x` },
        { label: 'Margen EBITDA', value: `${ebitdaMargin.toFixed(1)}%` },
        { label: 'Deuda/EBITDA', value: `${debtRatio.toFixed(1)}x` },
        { label: 'WACC', value: formatPercentage(results?.wacc, true) }
    ];

    const colWidth = contentWidth / 3;
    metrics.forEach((metric, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        const x = margin + (col * colWidth);
        const y = yPos + (row * 25);

        doc.setFillColor(248, 250, 252);
        doc.roundedRect(x, y, colWidth - 5, 20, 3, 3, 'F');

        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(metric.label, x + 5, y + 8);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 64, 175);
        doc.text(metric.value, x + 5, y + 16);
    });

    // =====================
    // PAGE 2: Methodology Breakdown
    // =====================
    doc.addPage();

    // Header
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Desglose de Metodologías', margin, 20);

    yPos = 50;

    // Multiples Method
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Método de Múltiplos Comparables (40%)', margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const multiplesDetails = results?.methodologies?.multiples?.details || {};
    doc.text(`Valor: ${formatCurrency(results?.methodologies?.multiples?.value)}`, margin + 5, yPos);
    yPos += 7;
    doc.text(`EV/EBITDA Múltiplo: ${multiplesDetails.evEbitdaMultiple?.toFixed(1) || 'N/A'}x`, margin + 5, yPos);
    yPos += 7;
    doc.text(`EV/Revenue Múltiplo: ${multiplesDetails.evRevenueMultiple?.toFixed(1) || 'N/A'}x`, margin + 5, yPos);
    yPos += 15;

    // DCF Method
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Flujo de Caja Descontado - DCF (40%)', margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const dcfDetails = results?.methodologies?.dcf?.details || {};
    doc.text(`Valor: ${formatCurrency(results?.methodologies?.dcf?.value)}`, margin + 5, yPos);
    yPos += 7;
    doc.text(`WACC utilizado: ${formatPercentage(dcfDetails.wacc, true)}`, margin + 5, yPos);
    yPos += 7;
    doc.text(`Tasa de crecimiento: ${formatPercentage(dcfDetails.growthRate, true)}`, margin + 5, yPos);
    yPos += 7;
    doc.text(`Valor Terminal: ${formatCurrency(dcfDetails.terminalValuePV)}`, margin + 5, yPos);
    yPos += 15;

    // Asset Method
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('3. Valor Patrimonial Ajustado (20%)', margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const assetDetails = results?.methodologies?.asset?.details || {};
    doc.text(`Valor: ${formatCurrency(results?.methodologies?.asset?.value)}`, margin + 5, yPos);
    yPos += 7;
    doc.text(`Valor Libro: ${formatCurrency(assetDetails.bookValue)}`, margin + 5, yPos);
    yPos += 7;
    doc.text(`Multiplicador Goodwill: ${assetDetails.goodwillMultiplier?.toFixed(2) || 'N/A'}x`, margin + 5, yPos);
    yPos += 7;
    doc.text(`Intangibles Estimados: ${formatCurrency(assetDetails.estimatedIntangibles)}`, margin + 5, yPos);
    yPos += 20;

    // Investment Score Breakdown
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Investment Readiness Score', margin, yPos);
    yPos += 10;

    results?.investmentScore?.breakdown?.forEach((item) => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(`${item.name}: ${item.points}/${item.maxPoints} pts (${item.value})`, margin + 5, yPos);
        yPos += 6;
    });

    // =====================
    // PAGE 3: AI Analysis (if available)
    // =====================
    if (aiAnalysis) {
        doc.addPage();

        doc.setFillColor(30, 64, 175);
        doc.rect(0, 0, pageWidth, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Análisis con Inteligencia Artificial', margin, 20);

        doc.setTextColor(71, 85, 105);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        const splitText = doc.splitTextToSize(aiAnalysis, contentWidth);
        doc.text(splitText, margin, 45);
    }

    // =====================
    // Final Page: Disclaimer
    // =====================
    doc.addPage();

    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    yPos = 50;
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Supuestos y Limitaciones', margin, yPos);
    yPos += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const disclaimers = [
        '• Los múltiplos utilizados son promedios sectoriales y pueden variar según condiciones de mercado.',
        '• El modelo DCF asume crecimiento constante y no considera eventos extraordinarios.',
        '• La valuación no incluye due diligence ni verificación independiente de datos.',
        '• Los resultados son estimaciones y no constituyen asesoramiento financiero profesional.',
        '• Se recomienda consultar con asesores financieros antes de tomar decisiones de inversión.',
        '',
        'Parámetros utilizados:',
        `• Tasa impositiva corporativa: 25%`,
        `• Tasa libre de riesgo: 5%`,
        `• Prima de riesgo de mercado: 6%`,
        `• Crecimiento perpetuo (Gordon Growth): 2%`,
        `• Horizonte de proyección DCF: 5 años`
    ];

    disclaimers.forEach((line) => {
        doc.text(line, margin, yPos);
        yPos += 6;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Generado por ValuaPyME | Proyecto Académico', margin, pageHeight - 15);
    doc.text(new Date().toISOString(), pageWidth - margin - 40, pageHeight - 15);

    // Save the PDF
    doc.save(`valuacion_${companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
}
