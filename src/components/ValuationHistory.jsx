import { useState } from 'react';
import { deleteValuation } from '../utils/storage';
import { formatCurrency, formatAbbreviated } from '../utils/calculations';
import { SECTOR_MULTIPLES } from '../data/sectorMultiples';

/**
 * Valuation History Component
 * List of saved valuations with comparison feature
 */
export default function ValuationHistory({
    valuations,
    onLoad,
    onRefresh,
    compareIds,
    onCompareToggle,
    onNewValuation
}) {
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'compare'

    const handleDelete = (id) => {
        deleteValuation(id);
        onRefresh();
        setDeleteConfirm(null);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const comparedValuations = valuations.filter(v => compareIds.includes(v.id));

    if (valuations.length === 0) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="glass-card p-12 text-center">
                    <div className="text-6xl mb-4">📂</div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                        Sin Valuaciones Guardadas
                    </h2>
                    <p className="text-slate-500 mb-6">
                        Completa tu primera valuación y guárdala para verla aquí
                    </p>
                    <button onClick={onNewValuation} className="btn-primary">
                        📊 Crear Primera Valuación
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        Historial de Valuaciones
                    </h2>
                    <p className="text-slate-500">
                        {valuations.length} valuación{valuations.length !== 1 ? 'es' : ''} guardada{valuations.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex bg-slate-100 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${viewMode === 'list'
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-800'}`}
                        >
                            📋 Lista
                        </button>
                        <button
                            onClick={() => setViewMode('compare')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${viewMode === 'compare'
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-800'}`}
                            disabled={compareIds.length < 2}
                        >
                            ⚖️ Comparar ({compareIds.length})
                        </button>
                    </div>
                </div>
            </div>

            {/* Compare View */}
            {viewMode === 'compare' && compareIds.length >= 2 && (
                <div className="glass-card p-6 animate-fade-in">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">
                        Comparación de Valuaciones
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Métrica</th>
                                    {comparedValuations.map((v, i) => (
                                        <th key={v.id} className="text-center py-3 px-4 text-sm font-medium text-slate-500">
                                            <div className="flex items-center justify-center gap-2">
                                                <span>{SECTOR_MULTIPLES[v.sector]?.icon}</span>
                                                <span className="truncate max-w-[120px]">{v.nombre}</span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="py-3 px-4 text-sm text-slate-600">Enterprise Value</td>
                                    {comparedValuations.map(v => (
                                        <td key={v.id} className="py-3 px-4 text-center font-bold text-primary-600">
                                            {formatCurrency(v.resultados?.valorFinal)}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 text-sm text-slate-600">Investment Score</td>
                                    {comparedValuations.map(v => (
                                        <td key={v.id} className="py-3 px-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-sm font-medium
                        ${v.resultados?.score >= 80 ? 'bg-success-100 text-success-700' :
                                                    v.resultados?.score >= 60 ? 'bg-primary-100 text-primary-700' :
                                                        v.resultados?.score >= 40 ? 'bg-accent-100 text-accent-700' :
                                                            'bg-red-100 text-red-700'}`}>
                                                {v.resultados?.score}/100
                                            </span>
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 text-sm text-slate-600">Sector</td>
                                    {comparedValuations.map(v => (
                                        <td key={v.id} className="py-3 px-4 text-center text-sm">
                                            {SECTOR_MULTIPLES[v.sector]?.name}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 text-sm text-slate-600">Método Múltiplos</td>
                                    {comparedValuations.map(v => (
                                        <td key={v.id} className="py-3 px-4 text-center text-sm">
                                            {formatAbbreviated(v.resultados?.metodologias?.multiples)}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 text-sm text-slate-600">Método DCF</td>
                                    {comparedValuations.map(v => (
                                        <td key={v.id} className="py-3 px-4 text-center text-sm">
                                            {formatAbbreviated(v.resultados?.metodologias?.dcf)}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 text-sm text-slate-600">Método Patrimonial</td>
                                    {comparedValuations.map(v => (
                                        <td key={v.id} className="py-3 px-4 text-center text-sm">
                                            {formatAbbreviated(v.resultados?.metodologias?.asset)}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 text-sm text-slate-600">Fecha</td>
                                    {comparedValuations.map(v => (
                                        <td key={v.id} className="py-3 px-4 text-center text-sm text-slate-500">
                                            {formatDate(v.fecha)}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {valuations.map((valuation) => {
                        const sectorData = SECTOR_MULTIPLES[valuation.sector];
                        const isSelected = compareIds.includes(valuation.id);

                        return (
                            <div
                                key={valuation.id}
                                className={`glass-card p-5 transition-all duration-300 relative group
                  ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
                            >
                                {/* Compare Checkbox */}
                                <div className="absolute top-4 right-4">
                                    <button
                                        onClick={() => onCompareToggle(valuation.id)}
                                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                      ${isSelected
                                                ? 'bg-primary-500 border-primary-500 text-white'
                                                : 'border-slate-300 hover:border-primary-300'}`}
                                    >
                                        {isSelected && (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {/* Header */}
                                <div className="flex items-start gap-3 mb-4 pr-8">
                                    <span className="text-3xl">{sectorData?.icon || '📊'}</span>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-800 truncate">
                                            {valuation.nombre}
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            {sectorData?.name}
                                        </p>
                                    </div>
                                </div>

                                {/* Value */}
                                <div className="mb-4">
                                    <div className="text-sm text-slate-500">Enterprise Value</div>
                                    <div className="text-2xl font-bold text-primary-600">
                                        {formatCurrency(valuation.resultados?.valorFinal)}
                                    </div>
                                </div>

                                {/* Score & Date */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${valuation.resultados?.score >= 80 ? 'bg-success-100 text-success-700' :
                                            valuation.resultados?.score >= 60 ? 'bg-primary-100 text-primary-700' :
                                                valuation.resultados?.score >= 40 ? 'bg-accent-100 text-accent-700' :
                                                    'bg-red-100 text-red-700'}`}>
                                        Score: {valuation.resultados?.score}/100
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        {formatDate(valuation.fecha)}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-3 border-t border-slate-100">
                                    <button
                                        onClick={() => onLoad(valuation)}
                                        className="flex-1 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 
                             rounded-lg hover:bg-primary-100 transition-colors"
                                    >
                                        📂 Cargar
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(valuation.id)}
                                        className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 
                             rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="glass-card-strong max-w-sm w-full mx-4 p-6 animate-slide-up">
                        <h4 className="text-lg font-semibold text-slate-800 mb-2">
                            ¿Eliminar valuación?
                        </h4>
                        <p className="text-sm text-slate-500 mb-4">
                            Esta acción no se puede deshacer.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="btn-secondary flex-1"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl 
                         hover:bg-red-600 transition-colors flex-1"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
