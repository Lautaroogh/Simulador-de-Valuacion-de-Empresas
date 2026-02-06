import { useMemo } from 'react';
import { calculateWACC } from '../../utils/calculations';
import { SCENARIOS } from '../../data/sectorMultiples';

/**
 * Step 3: Projections and Adjustments
 * Growth rate, WACC, scenario selection
 */
export default function Step3Projections({ data, onUpdate }) {
    // Calculate automatic WACC
    const autoWacc = useMemo(() => {
        const parsedData = {
            activos: parseFloat(data.activos) || 0,
            pasivos: parseFloat(data.pasivos) || 0,
            sector: data.sector
        };
        return calculateWACC(parsedData);
    }, [data.activos, data.pasivos, data.sector]);

    const scenarios = Object.entries(SCENARIOS);

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <span className="text-2xl">📈</span>
                Proyecciones y Escenarios
            </h3>

            {/* Growth Rate */}
            <div className="space-y-4">
                <label className="input-label flex items-center gap-2">
                    Tasa de Crecimiento Esperada (%)
                    <div className="tooltip">
                        <span className="w-4 h-4 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center cursor-help">i</span>
                        <span className="tooltip-content">Crecimiento anual proyectado para los próximos 5 años</span>
                    </div>
                </label>

                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="-10"
                        max="50"
                        value={data.tasaCrecimiento}
                        onChange={(e) => onUpdate('tasaCrecimiento', parseFloat(e.target.value))}
                        className="flex-1"
                    />
                    <div className={`w-24 h-14 rounded-xl flex items-center justify-center font-bold text-xl
            ${data.tasaCrecimiento >= 15 ? 'bg-success-100 text-success-700' :
                            data.tasaCrecimiento >= 5 ? 'bg-primary-100 text-primary-700' :
                                data.tasaCrecimiento >= 0 ? 'bg-accent-100 text-accent-700' :
                                    'bg-red-100 text-red-700'}`}>
                        {data.tasaCrecimiento >= 0 ? '+' : ''}{data.tasaCrecimiento}%
                    </div>
                </div>

                <div className="flex justify-between text-xs text-slate-400 px-1">
                    <span>Decrecimiento</span>
                    <span>Moderado</span>
                    <span>Alto Crecimiento</span>
                </div>

                {/* Growth rate warning */}
                {data.tasaCrecimiento > 30 && (
                    <div className="flex items-center gap-2 p-3 bg-accent-50 text-accent-700 rounded-xl border border-accent-200 text-sm">
                        <span>⚠️</span>
                        <span>Tasas &gt;30% son difíciles de sostener a largo plazo</span>
                    </div>
                )}
            </div>

            {/* WACC */}
            <div className="space-y-4">
                <label className="input-label flex items-center gap-2">
                    WACC (Costo de Capital)
                    <div className="tooltip">
                        <span className="w-4 h-4 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center cursor-help">i</span>
                        <span className="tooltip-content">Weighted Average Cost of Capital - Tasa de descuento para el DCF</span>
                    </div>
                </label>

                {/* Auto vs Manual toggle */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <button
                        onClick={() => onUpdate('wacc', null)}
                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300
              ${data.wacc === null
                                ? 'bg-primary-500 text-white shadow-md'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300'}`}
                    >
                        <div className="text-sm">Automático</div>
                        <div className="text-lg font-bold">{(autoWacc * 100).toFixed(1)}%</div>
                    </button>
                    <button
                        onClick={() => onUpdate('wacc', autoWacc)}
                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300
              ${data.wacc !== null
                                ? 'bg-primary-500 text-white shadow-md'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300'}`}
                    >
                        <div className="text-sm">Manual</div>
                        <div className="text-lg font-bold">
                            {data.wacc !== null ? `${(data.wacc * 100).toFixed(1)}%` : 'Definir'}
                        </div>
                    </button>
                </div>

                {/* Manual WACC slider */}
                {data.wacc !== null && (
                    <div className="space-y-2 animate-fade-in">
                        <input
                            type="range"
                            min="5"
                            max="25"
                            step="0.5"
                            value={data.wacc * 100}
                            onChange={(e) => onUpdate('wacc', parseFloat(e.target.value) / 100)}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>5% (Bajo riesgo)</span>
                            <span>15%</span>
                            <span>25% (Alto riesgo)</span>
                        </div>
                    </div>
                )}

                {/* WACC explanation */}
                <div className="p-3 bg-primary-50 rounded-xl text-sm text-primary-700">
                    <p>
                        <strong>WACC calculado:</strong> Basado en estructura de capital (E/D: {
                            ((parseFloat(data.activos) || 0) - (parseFloat(data.pasivos) || 0)) > 0
                                ? (((parseFloat(data.activos) || 0) - (parseFloat(data.pasivos) || 0)) / (parseFloat(data.pasivos) || 1)).toFixed(1)
                                : '0'
                        }x) y prima de riesgo del sector.
                    </p>
                </div>
            </div>

            {/* Scenario Selection */}
            <div className="space-y-4">
                <label className="input-label flex items-center gap-2">
                    Escenario de Valuación
                    <div className="tooltip">
                        <span className="w-4 h-4 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center cursor-help">i</span>
                        <span className="tooltip-content">Ajusta el valor final según expectativas</span>
                    </div>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {scenarios.map(([key, scenario]) => (
                        <button
                            key={key}
                            onClick={() => onUpdate('escenario', key)}
                            className={`p-4 rounded-xl border-2 text-center transition-all duration-300
                ${data.escenario === key
                                    ? 'shadow-lg transform scale-[1.02]'
                                    : 'border-slate-200 bg-white hover:border-slate-300'}`}
                            style={{
                                borderColor: data.escenario === key ? scenario.color : undefined,
                                backgroundColor: data.escenario === key ? `${scenario.color}10` : undefined
                            }}
                        >
                            <div
                                className="text-3xl mb-2"
                                style={{ color: scenario.color }}
                            >
                                {key === 'optimista' ? '🚀' : key === 'base' ? '⚖️' : '🛡️'}
                            </div>
                            <div
                                className="font-bold text-lg"
                                style={{ color: data.escenario === key ? scenario.color : undefined }}
                            >
                                {scenario.name}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                                {scenario.adjustment > 0 ? `+${scenario.adjustment * 100}%` :
                                    scenario.adjustment < 0 ? `${scenario.adjustment * 100}%` :
                                        'Sin ajuste'}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                                {scenario.description}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Card */}
            <div className="p-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl text-white">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <span>📋</span>
                    Resumen de Parámetros
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-white/20 rounded-xl p-3">
                        <div className="text-white/70">Crecimiento</div>
                        <div className="font-bold text-xl">{data.tasaCrecimiento}%</div>
                    </div>
                    <div className="bg-white/20 rounded-xl p-3">
                        <div className="text-white/70">WACC</div>
                        <div className="font-bold text-xl">
                            {((data.wacc || autoWacc) * 100).toFixed(1)}%
                        </div>
                    </div>
                    <div className="bg-white/20 rounded-xl p-3">
                        <div className="text-white/70">Escenario</div>
                        <div className="font-bold text-xl capitalize">{data.escenario}</div>
                    </div>
                    <div className="bg-white/20 rounded-xl p-3">
                        <div className="text-white/70">Proyección</div>
                        <div className="font-bold text-xl">5 años</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
