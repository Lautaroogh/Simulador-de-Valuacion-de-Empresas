import { useMemo } from 'react';
import { calculateCAGR } from '../../utils/calculations';

/**
 * Step 2: Financial Data
 * Revenue, EBITDA, Assets, Liabilities
 */
export default function Step2Financial({ data, onUpdate, onUpdateIngreso }) {
    // Calculate CAGR from revenue inputs
    const cagr = useMemo(() => {
        const revenues = data.ingresos.map(v => parseFloat(v) || 0).filter(v => v > 0);
        if (revenues.length >= 2) {
            return calculateCAGR(revenues);
        }
        return null;
    }, [data.ingresos]);

    // Calculate EBITDA margin
    const ebitdaMargin = useMemo(() => {
        const latestRevenue = parseFloat(data.ingresos[2]) || parseFloat(data.ingresos[1]) || parseFloat(data.ingresos[0]) || 0;
        const ebitda = parseFloat(data.ebitda) || 0;
        if (latestRevenue > 0 && ebitda > 0) {
            return (ebitda / latestRevenue * 100).toFixed(1);
        }
        return null;
    }, [data.ingresos, data.ebitda]);

    // Validation warnings
    const warnings = useMemo(() => {
        const warns = [];
        if (ebitdaMargin !== null) {
            if (parseFloat(ebitdaMargin) < 0) {
                warns.push({ type: 'error', message: 'EBITDA negativo indica pérdidas operativas' });
            } else if (parseFloat(ebitdaMargin) > 50) {
                warns.push({ type: 'warning', message: 'Verifica: Margen EBITDA >50% es inusual' });
            }
        }
        const pasivos = parseFloat(data.pasivos) || 0;
        const activos = parseFloat(data.activos) || 0;
        if (pasivos > 0 && activos > 0 && pasivos > activos) {
            warns.push({ type: 'error', message: 'Pasivos > Activos: Empresa técnicamente insolvente' });
        }
        return warns;
    }, [ebitdaMargin, data.pasivos, data.activos]);

    const formatNumber = (value) => {
        if (!value) return '';
        const num = parseFloat(value);
        if (isNaN(num)) return value;
        return num.toLocaleString('es-AR');
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <span className="text-2xl">💰</span>
                Datos Financieros
            </h3>

            {/* Revenue - 3 Years */}
            <div className="space-y-4">
                <label className="input-label flex items-center gap-2">
                    Ingresos Anuales (últimos 3 años)
                    <div className="tooltip">
                        <span className="w-4 h-4 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center cursor-help">i</span>
                        <span className="tooltip-content">Ventas/Revenue totales de cada año fiscal</span>
                    </div>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Año -2', 'Año -1', 'Último Año'].map((label, index) => (
                        <div key={index} className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                            <input
                                type="number"
                                value={data.ingresos[index]}
                                onChange={(e) => onUpdateIngreso(index, e.target.value)}
                                placeholder={`Ej: ${(1000000 + index * 200000).toLocaleString()}`}
                                className="input-field pl-8"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                                {label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* CAGR Display */}
                {cagr !== null && (
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
            ${cagr >= 10 ? 'bg-success-100 text-success-700' :
                            cagr >= 0 ? 'bg-primary-100 text-primary-700' :
                                'bg-red-100 text-red-700'}`}>
                        <span>📈</span>
                        Tasa de Crecimiento (CAGR): {cagr.toFixed(1)}%
                    </div>
                )}
            </div>

            {/* EBITDA */}
            <div className="space-y-2">
                <label className="input-label flex items-center gap-2">
                    EBITDA (último año)
                    <div className="tooltip">
                        <span className="w-4 h-4 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center cursor-help">i</span>
                        <span className="tooltip-content">Earnings Before Interest, Taxes, Depreciation & Amortization</span>
                    </div>
                </label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                    <input
                        type="number"
                        value={data.ebitda}
                        onChange={(e) => onUpdate('ebitda', e.target.value)}
                        placeholder="Ej: 500,000"
                        className="input-field pl-8"
                    />
                </div>

                {/* EBITDA Margin Display */}
                {ebitdaMargin !== null && (
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
            ${parseFloat(ebitdaMargin) >= 15 ? 'bg-success-100 text-success-700' :
                            parseFloat(ebitdaMargin) >= 5 ? 'bg-primary-100 text-primary-700' :
                                'bg-accent-100 text-accent-700'}`}>
                        <span>📊</span>
                        Margen EBITDA: {ebitdaMargin}%
                    </div>
                )}
            </div>

            {/* Assets and Liabilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Assets */}
                <div className="space-y-2">
                    <label className="input-label flex items-center gap-2">
                        Activos Totales
                        <div className="tooltip">
                            <span className="w-4 h-4 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center cursor-help">i</span>
                            <span className="tooltip-content">Suma de todos los activos del balance</span>
                        </div>
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                        <input
                            type="number"
                            value={data.activos}
                            onChange={(e) => onUpdate('activos', e.target.value)}
                            placeholder="Ej: 2,000,000"
                            className="input-field pl-8"
                        />
                    </div>
                </div>

                {/* Total Liabilities */}
                <div className="space-y-2">
                    <label className="input-label flex items-center gap-2">
                        Pasivos Totales (Deuda)
                        <div className="tooltip">
                            <span className="w-4 h-4 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center cursor-help">i</span>
                            <span className="tooltip-content">Suma de todas las deudas y obligaciones</span>
                        </div>
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                        <input
                            type="number"
                            value={data.pasivos}
                            onChange={(e) => onUpdate('pasivos', e.target.value)}
                            placeholder="Ej: 800,000"
                            className="input-field pl-8"
                        />
                    </div>
                </div>
            </div>

            {/* Equity Display */}
            {data.activos && data.pasivos && (
                <div className="p-4 bg-gradient-to-r from-primary-50 to-success-50 rounded-xl border border-primary-100">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-600 font-medium">Patrimonio Neto (Equity):</span>
                        <span className={`text-xl font-bold ${(parseFloat(data.activos) - parseFloat(data.pasivos)) >= 0
                                ? 'text-success-600'
                                : 'text-red-600'
                            }`}>
                            ${((parseFloat(data.activos) || 0) - (parseFloat(data.pasivos) || 0)).toLocaleString('es-AR')}
                        </span>
                    </div>
                </div>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
                <div className="space-y-2">
                    {warnings.map((warn, index) => (
                        <div
                            key={index}
                            className={`flex items-center gap-3 p-4 rounded-xl 
                ${warn.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                                    'bg-accent-50 text-accent-700 border border-accent-200'}`}
                        >
                            <span className="text-xl">{warn.type === 'error' ? '🚨' : '⚠️'}</span>
                            <span className="font-medium">{warn.message}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
