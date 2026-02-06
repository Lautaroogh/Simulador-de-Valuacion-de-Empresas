import { useState, useEffect, useRef } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
    PieChart, Pie
} from 'recharts';
import { formatCurrency, formatAbbreviated, formatPercentage } from '../utils/calculations';
import { SECTOR_MULTIPLES } from '../data/sectorMultiples';
import { generatePDFReport } from '../utils/pdfGenerator';
import WhatIfSimulator from './WhatIfSimulator';
import InvestmentScoreGauge from './charts/InvestmentScoreGauge';

/**
 * Results Dashboard Component
 * Displays valuation results with charts and analysis
 */
export default function ResultsDashboard({
    results,
    companyData,
    aiAnalysis,
    aiLoading,
    onGenerateAI,
    onSave,
    onNewValuation
}) {
    const [apiKey, setApiKey] = useState('');
    const [showApiModal, setShowApiModal] = useState(false);
    const [animatedValue, setAnimatedValue] = useState(0);
    const [showConfetti, setShowConfetti] = useState(true);

    // Animate the main value on mount
    useEffect(() => {
        const targetValue = results?.enterpriseValue || 0;
        const duration = 1500;
        const steps = 60;
        const increment = targetValue / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
                setAnimatedValue(targetValue);
                clearInterval(timer);
            } else {
                setAnimatedValue(current);
            }
        }, duration / steps);

        // Hide confetti after 3 seconds
        setTimeout(() => setShowConfetti(false), 3000);

        return () => clearInterval(timer);
    }, [results?.enterpriseValue]);

    const handleAIRequest = () => {
        if (apiKey.trim()) {
            onGenerateAI(apiKey);
            setShowApiModal(false);
        }
    };

    // Prepare chart data
    const methodologyData = [
        {
            name: 'Múltiplos',
            value: results?.methodologies?.multiples?.value || 0,
            color: '#3b82f6'
        },
        {
            name: 'DCF',
            value: results?.methodologies?.dcf?.value || 0,
            color: '#10b981'
        },
        {
            name: 'Patrimonial',
            value: results?.methodologies?.asset?.value || 0,
            color: '#f59e0b'
        }
    ];

    // Benchmark radar data
    const sectorData = SECTOR_MULTIPLES[companyData.sector];
    const latestRevenue = results?.companyData?.ingresos?.[results.companyData.ingresos.length - 1] || 0;
    const ebitdaMargin = latestRevenue > 0 ? (results?.companyData?.ebitda / latestRevenue) * 100 : 0;
    const debtRatio = results?.companyData?.ebitda > 0 ? results?.companyData?.pasivos / results.companyData.ebitda : 0;

    const benchmarkData = [
        {
            subject: 'Margen EBITDA',
            empresa: Math.min(ebitdaMargin, 30),
            sector: sectorData?.benchmarks?.margenEbitda || 10,
            fullMark: 30
        },
        {
            subject: 'Crecimiento',
            empresa: Math.min(companyData.tasaCrecimiento || 0, 30),
            sector: sectorData?.benchmarks?.crecimiento || 5,
            fullMark: 30
        },
        {
            subject: 'Eficiencia',
            empresa: Math.min(100 - (debtRatio * 10), 100),
            sector: 70,
            fullMark: 100
        },
        {
            subject: 'Solidez',
            empresa: Math.min(((results?.companyData?.activos - results?.companyData?.pasivos) / results?.companyData?.activos) * 100, 100),
            sector: 50,
            fullMark: 100
        },
        {
            subject: 'Escala',
            empresa: results?.investmentScore?.breakdown?.find(b => b.name === 'Tamaño/Escala')?.points * 6.67 || 50,
            sector: 50,
            fullMark: 100
        },
        {
            subject: 'Madurez',
            empresa: Math.min(companyData.antiguedad * 4, 100),
            sector: 40,
            fullMark: 100
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Confetti Effect */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-bounce-subtle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-20px`,
                                animation: `confetti ${2 + Math.random() * 2}s ease-out forwards`,
                                animationDelay: `${Math.random() * 0.5}s`
                            }}
                        >
                            <span className="text-2xl">
                                {['🎉', '✨', '💰', '📈', '⭐'][Math.floor(Math.random() * 5)]}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* Main Valuation Header */}
            <div className="glass-card-strong p-8 text-center">
                <h2 className="text-xl text-slate-500 mb-2 flex items-center justify-center gap-2">
                    <span className="text-2xl">{sectorData?.icon}</span>
                    {companyData.nombre || 'Tu Empresa'} - {sectorData?.name}
                </h2>

                <div className="mb-4">
                    <span className="text-sm text-slate-400 uppercase tracking-wider">Enterprise Value Estimado</span>
                </div>

                <div className="stat-value animate-count-up">
                    {formatCurrency(animatedValue)}
                </div>

                {/* Value Range */}
                <div className="mt-6 max-w-md mx-auto">
                    <div className="flex justify-between text-sm text-slate-500 mb-2">
                        <span>Mínimo</span>
                        <span>Máximo</span>
                    </div>
                    <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className="absolute h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full"
                            style={{
                                left: '10%',
                                right: '10%',
                                width: '80%'
                            }}
                        ></div>
                        <div
                            className="absolute w-4 h-4 bg-primary-600 border-2 border-white rounded-full shadow-lg top-0 transform -translate-x-1/2"
                            style={{
                                left: '50%'
                            }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-sm font-medium mt-2">
                        <span className="text-red-600">{formatAbbreviated(results?.range?.min)}</span>
                        <span className="text-green-600">{formatAbbreviated(results?.range?.max)}</span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                    <button onClick={onSave} className="btn-success">
                        💾 Guardar Valuación
                    </button>
                    <button
                        onClick={() => generatePDFReport(results, companyData, aiAnalysis)}
                        className="btn-accent"
                    >
                        📄 Exportar PDF
                    </button>
                    <button onClick={onNewValuation} className="btn-secondary">
                        🔄 Nueva Valuación
                    </button>
                </div>
            </div>

            {/* Methodology Breakdown + Investment Score */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Methodology Chart */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <span>📊</span>
                        Desglose por Metodología
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={methodologyData} layout="vertical">
                                <XAxis type="number" tickFormatter={(v) => formatAbbreviated(v)} />
                                <YAxis type="category" dataKey="name" width={80} />
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{
                                        backgroundColor: 'rgba(255,255,255,0.95)',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                                    {methodologyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                        {methodologyData.map((m, i) => (
                            <div key={i} className="text-center p-2 rounded-lg bg-slate-50">
                                <div className="font-medium" style={{ color: m.color }}>{m.name}</div>
                                <div className="font-bold text-slate-700">{(results?.weights?.[m.name.toLowerCase()] || 0) * 100}%</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Investment Score */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <span>🎯</span>
                        Investment Readiness Score
                    </h3>
                    <InvestmentScoreGauge
                        score={results?.investmentScore?.score || 0}
                        rating={results?.investmentScore?.rating}
                        breakdown={results?.investmentScore?.breakdown}
                    />

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {results?.investmentScore?.badges?.map((badge, i) => (
                            <span
                                key={i}
                                className={`badge ${badge.color === 'success' ? 'badge-success' :
                                    badge.color === 'warning' ? 'badge-warning' :
                                        badge.color === 'danger' ? 'badge-danger' :
                                            'badge-info'
                                    }`}
                            >
                                {badge.icon} {badge.text}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="metric-card text-center">
                    <div className="text-3xl mb-2">📈</div>
                    <div className="text-sm text-slate-500">EV/EBITDA</div>
                    <div className="text-2xl font-bold text-primary-600">
                        {(results?.enterpriseValue / results?.companyData?.ebitda).toFixed(1)}x
                    </div>
                </div>
                <div className="metric-card text-center">
                    <div className="text-3xl mb-2">💹</div>
                    <div className="text-sm text-slate-500">Margen EBITDA</div>
                    <div className="text-2xl font-bold text-success-600">
                        {ebitdaMargin.toFixed(1)}%
                    </div>
                </div>
                <div className="metric-card text-center">
                    <div className="text-3xl mb-2">⚖️</div>
                    <div className="text-sm text-slate-500">Deuda/EBITDA</div>
                    <div className={`text-2xl font-bold ${debtRatio <= 3 ? 'text-success-600' : 'text-red-600'}`}>
                        {debtRatio.toFixed(1)}x
                    </div>
                </div>
                <div className="metric-card text-center">
                    <div className="text-3xl mb-2">📊</div>
                    <div className="text-sm text-slate-500">WACC</div>
                    <div className="text-2xl font-bold text-accent-600">
                        {formatPercentage(results?.wacc, true)}
                    </div>
                </div>
            </div>

            {/* Benchmarking Radar */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <span>🎯</span>
                    Benchmarking vs Sector ({sectorData?.name})
                </h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={benchmarkData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                            <Radar
                                name="Tu Empresa"
                                dataKey="empresa"
                                stroke="#3b82f6"
                                fill="#3b82f6"
                                fillOpacity={0.5}
                            />
                            <Radar
                                name="Promedio Sector"
                                dataKey="sector"
                                stroke="#94a3b8"
                                fill="#94a3b8"
                                fillOpacity={0.2}
                            />
                            <Legend />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* What-If Simulator */}
            <WhatIfSimulator
                companyData={companyData}
                baseValuation={results?.enterpriseValue}
            />

            {/* AI Analysis Section */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <span>🤖</span>
                    Análisis con Inteligencia Artificial
                </h3>

                {!aiAnalysis && !aiLoading && (
                    <div className="text-center py-8">
                        <p className="text-slate-500 mb-4">
                            Genera un análisis ejecutivo personalizado con Claude AI
                        </p>
                        <button
                            onClick={() => setShowApiModal(true)}
                            className="btn-primary"
                        >
                            ✨ Generar Análisis IA
                        </button>
                    </div>
                )}

                {aiLoading && (
                    <div className="text-center py-8">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary-50 rounded-xl">
                            <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-primary-600 font-medium">Generando análisis...</span>
                        </div>
                    </div>
                )}

                {aiAnalysis && (
                    <div className="prose prose-slate max-w-none">
                        <div className="p-6 bg-gradient-to-br from-primary-50 to-success-50 rounded-xl border border-primary-100">
                            <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                                {aiAnalysis}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* API Key Modal */}
            {showApiModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="glass-card-strong max-w-md w-full mx-4 p-6 animate-slide-up">
                        <h4 className="text-lg font-semibold text-slate-800 mb-4">
                            🔐 Ingresar API Key de Claude
                        </h4>
                        <p className="text-sm text-slate-500 mb-4">
                            Tu API key se usa solo para esta sesión y no se almacena permanentemente.
                        </p>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-ant-..."
                            className="input-field mb-4"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowApiModal(false)}
                                className="btn-secondary flex-1"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAIRequest}
                                className="btn-primary flex-1"
                                disabled={!apiKey.trim()}
                            >
                                Generar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Disclaimers */}
            <div className="text-center text-sm text-slate-400 py-4">
                <p>
                    ⚠️ Esta valuación es una estimación basada en métodos estándar de la industria.
                    Los resultados no constituyen asesoramiento financiero profesional.
                </p>
            </div>
        </div>
    );
}
