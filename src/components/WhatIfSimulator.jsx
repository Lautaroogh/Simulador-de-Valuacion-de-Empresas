import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { calculateValuation, formatCurrency, formatAbbreviated } from '../utils/calculations';

/**
 * What-If Simulator Component
 * Interactive sliders showing real-time valuation impact
 */
export default function WhatIfSimulator({ companyData, baseValuation }) {
    // Adjustable parameters
    const [adjustments, setAdjustments] = useState({
        ebitdaChange: 0,      // -30% to +30%
        growthChange: 0,      // -20% to +20%
        multipleChange: 0,    // -3x to +3x
        waccChange: 0         // -3% to +3%
    });

    // Calculate new valuation with adjustments
    const simulatedResults = useMemo(() => {
        const adjustedData = {
            ...companyData,
            ebitda: (parseFloat(companyData.ebitda) || 0) * (1 + adjustments.ebitdaChange / 100),
            tasaCrecimiento: (parseFloat(companyData.tasaCrecimiento) || 0) + adjustments.growthChange,
            // Note: Multiple and WACC changes would need more complex handling
        };

        // Simple approximation for demonstration
        const baseValue = baseValuation || 0;
        const ebitdaImpact = baseValue * (adjustments.ebitdaChange / 100) * 0.8;
        const growthImpact = baseValue * (adjustments.growthChange / 100) * 0.4;
        const multipleImpact = (baseValue / 10) * adjustments.multipleChange;
        const waccImpact = baseValue * (-adjustments.waccChange / 100) * 0.5;

        return {
            newValue: baseValue + ebitdaImpact + growthImpact + multipleImpact + waccImpact,
            ebitdaImpact,
            growthImpact,
            multipleImpact,
            waccImpact
        };
    }, [companyData, baseValuation, adjustments]);

    const valueDelta = simulatedResults.newValue - baseValuation;
    const percentDelta = baseValuation > 0 ? (valueDelta / baseValuation) * 100 : 0;

    // Tornado chart data
    const tornadoData = [
        {
            name: 'Margen EBITDA',
            positive: baseValuation * 0.3 * 0.8,
            negative: -baseValuation * 0.3 * 0.8,
            current: simulatedResults.ebitdaImpact
        },
        {
            name: 'Múltiplo Sector',
            positive: (baseValuation / 10) * 3,
            negative: -(baseValuation / 10) * 3,
            current: simulatedResults.multipleImpact
        },
        {
            name: 'Tasa Crecimiento',
            positive: baseValuation * 0.2 * 0.4,
            negative: -baseValuation * 0.2 * 0.4,
            current: simulatedResults.growthImpact
        },
        {
            name: 'WACC',
            positive: baseValuation * 0.03 * 0.5,
            negative: -baseValuation * 0.03 * 0.5,
            current: simulatedResults.waccImpact
        }
    ];

    const sliders = [
        {
            key: 'ebitdaChange',
            label: 'Cambio en Margen EBITDA',
            min: -30,
            max: 30,
            step: 1,
            unit: '%',
            color: '#3b82f6'
        },
        {
            key: 'growthChange',
            label: 'Cambio en Tasa de Crecimiento',
            min: -20,
            max: 20,
            step: 1,
            unit: 'pp',
            color: '#10b981'
        },
        {
            key: 'multipleChange',
            label: 'Ajuste al Múltiplo EV/EBITDA',
            min: -3,
            max: 3,
            step: 0.5,
            unit: 'x',
            color: '#f59e0b'
        },
        {
            key: 'waccChange',
            label: 'Cambio en WACC',
            min: -3,
            max: 3,
            step: 0.5,
            unit: 'pp',
            color: '#8b5cf6'
        }
    ];

    const resetAdjustments = () => {
        setAdjustments({
            ebitdaChange: 0,
            growthChange: 0,
            multipleChange: 0,
            waccChange: 0
        });
    };

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <span>🎛️</span>
                    Simulador What-If
                </h3>
                <button
                    onClick={resetAdjustments}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                    🔄 Resetear
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sliders */}
                <div className="space-y-6">
                    {sliders.map((slider) => (
                        <div key={slider.key} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-slate-700">
                                    {slider.label}
                                </label>
                                <span
                                    className="text-sm font-bold px-3 py-1 rounded-full"
                                    style={{
                                        backgroundColor: `${slider.color}20`,
                                        color: slider.color
                                    }}
                                >
                                    {adjustments[slider.key] >= 0 ? '+' : ''}{adjustments[slider.key]}{slider.unit}
                                </span>
                            </div>
                            <input
                                type="range"
                                min={slider.min}
                                max={slider.max}
                                step={slider.step}
                                value={adjustments[slider.key]}
                                onChange={(e) => setAdjustments(prev => ({
                                    ...prev,
                                    [slider.key]: parseFloat(e.target.value)
                                }))}
                                className="w-full"
                                style={{
                                    accentColor: slider.color
                                }}
                            />
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>{slider.min}{slider.unit}</span>
                                <span>0</span>
                                <span>+{slider.max}{slider.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Results Display */}
                <div className="space-y-6">
                    {/* New Value Display */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                        <div className="text-sm opacity-80 mb-1">Nuevo Valor Estimado</div>
                        <div className="text-3xl font-bold mb-3">
                            {formatCurrency(simulatedResults.newValue)}
                        </div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
              ${valueDelta >= 0 ? 'bg-success-500/30' : 'bg-red-500/30'}`}>
                            <span>{valueDelta >= 0 ? '📈' : '📉'}</span>
                            <span>
                                {valueDelta >= 0 ? '+' : ''}{formatAbbreviated(valueDelta)}
                                ({percentDelta >= 0 ? '+' : ''}{percentDelta.toFixed(1)}%)
                            </span>
                        </div>
                    </div>

                    {/* Impact Breakdown */}
                    <div className="space-y-3">
                        <div className="text-sm font-medium text-slate-700">Impacto por Variable</div>
                        {[
                            { label: 'EBITDA', value: simulatedResults.ebitdaImpact, color: '#3b82f6' },
                            { label: 'Crecimiento', value: simulatedResults.growthImpact, color: '#10b981' },
                            { label: 'Múltiplo', value: simulatedResults.multipleImpact, color: '#f59e0b' },
                            { label: 'WACC', value: simulatedResults.waccImpact, color: '#8b5cf6' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                ></div>
                                <span className="text-sm text-slate-600 flex-1">{item.label}</span>
                                <span className={`text-sm font-medium ${item.value >= 0 ? 'text-success-600' : 'text-red-600'}`}>
                                    {item.value >= 0 ? '+' : ''}{formatAbbreviated(item.value)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sensitivity Chart (Tornado) */}
            <div className="mt-8">
                <h4 className="text-sm font-medium text-slate-700 mb-4">
                    Análisis de Sensibilidad (Impacto Máximo ±)
                </h4>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={tornadoData} layout="vertical">
                            <XAxis type="number" tickFormatter={(v) => formatAbbreviated(Math.abs(v))} />
                            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                            <Tooltip
                                formatter={(value) => formatCurrency(Math.abs(value))}
                                contentStyle={{
                                    backgroundColor: 'rgba(255,255,255,0.95)',
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                }}
                            />
                            <ReferenceLine x={0} stroke="#94a3b8" />
                            <Bar dataKey="positive" fill="#10b981" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="negative" fill="#ef4444" radius={[4, 0, 0, 4]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
