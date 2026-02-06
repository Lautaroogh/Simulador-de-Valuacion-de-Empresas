/**
 * Glossary Component
 * Educational sidebar with financial terms and explanations
 */
export default function Glossary({ onClose }) {
    const terms = [
        {
            category: 'Metodologías de Valuación',
            items: [
                {
                    term: 'Múltiplos Comparables',
                    definition: 'Método que valúa una empresa comparándola con transacciones similares en el mismo sector, usando ratios como EV/EBITDA o EV/Revenue.'
                },
                {
                    term: 'DCF (Discounted Cash Flow)',
                    definition: 'Flujo de Caja Descontado. Calcula el valor presente de los flujos de caja futuros proyectados, descontados a una tasa que refleja el riesgo.'
                },
                {
                    term: 'Valor Patrimonial',
                    definition: 'Valor basado en los activos menos pasivos, ajustado por goodwill e intangibles según la antigüedad y tamaño de la empresa.'
                }
            ]
        },
        {
            category: 'Métricas Financieras',
            items: [
                {
                    term: 'EBITDA',
                    definition: 'Earnings Before Interest, Taxes, Depreciation & Amortization. Mide la rentabilidad operativa antes de costos financieros e impuestos.'
                },
                {
                    term: 'Enterprise Value (EV)',
                    definition: 'Valor total de la empresa, incluyendo deuda. EV = Equity Value + Deuda Neta.'
                },
                {
                    term: 'WACC',
                    definition: 'Weighted Average Cost of Capital. Costo promedio ponderado del capital propio y deuda, usado como tasa de descuento.'
                },
                {
                    term: 'CAGR',
                    definition: 'Compound Annual Growth Rate. Tasa de crecimiento anual compuesto, muestra el crecimiento sostenido en el tiempo.'
                }
            ]
        },
        {
            category: 'Ratios Clave',
            items: [
                {
                    term: 'EV/EBITDA',
                    definition: 'Múltiplo que indica cuántas veces el EBITDA está contenido en el valor de la empresa. A menor ratio, más "barata" la empresa.'
                },
                {
                    term: 'Margen EBITDA',
                    definition: 'EBITDA dividido por los ingresos. Mide la eficiencia operativa. Un margen >15% suele considerarse saludable.'
                },
                {
                    term: 'Deuda/EBITDA',
                    definition: 'Indica cuántos años de EBITDA se necesitarían para pagar la deuda. Un ratio <3x suele ser manejable.'
                }
            ]
        },
        {
            category: 'Conceptos M&A',
            items: [
                {
                    term: 'M&A',
                    definition: 'Mergers & Acquisitions. Fusiones y adquisiciones de empresas.'
                },
                {
                    term: 'Due Diligence',
                    definition: 'Proceso de investigación previo a una transacción para verificar información financiera, legal y operativa.'
                },
                {
                    term: 'Terminal Value',
                    definition: 'Valor de la empresa al final del período de proyección, asumiendo crecimiento perpetuo.'
                }
            ]
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div className="relative w-full max-w-md bg-white shadow-2xl overflow-y-auto animate-slide-in-right">
                {/* Header */}
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 p-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span>📚</span>
                        Glosario Financiero
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* How it works */}
                    <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
                        <h3 className="font-semibold text-primary-800 mb-2 flex items-center gap-2">
                            <span>💡</span>
                            ¿Cómo funciona esta herramienta?
                        </h3>
                        <p className="text-sm text-primary-700 leading-relaxed">
                            ValuaPyME calcula una estimación del valor de tu empresa usando tres metodologías
                            reconocidas internacionalmente. El resultado final es un promedio ponderado que
                            considera múltiplos de mercado, flujos de caja futuros y el valor patrimonial.
                        </p>
                    </div>

                    {/* Terms by category */}
                    {terms.map((category, catIndex) => (
                        <div key={catIndex}>
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                {category.category}
                            </h3>
                            <div className="space-y-3">
                                {category.items.map((item, itemIndex) => (
                                    <details
                                        key={itemIndex}
                                        className="group bg-slate-50 rounded-xl overflow-hidden"
                                    >
                                        <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-100 transition-colors">
                                            <span className="font-medium text-slate-800">{item.term}</span>
                                            <svg
                                                className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </summary>
                                        <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
                                            {item.definition}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Disclaimer */}
                    <div className="p-4 bg-accent-50 rounded-xl border border-accent-100">
                        <h4 className="font-semibold text-accent-800 mb-2 flex items-center gap-2">
                            <span>⚠️</span>
                            Limitaciones del Modelo
                        </h4>
                        <ul className="text-sm text-accent-700 space-y-1 list-disc list-inside">
                            <li>Los resultados son estimaciones basadas en promedios sectoriales</li>
                            <li>No reemplaza una valuación profesional con due diligence</li>
                            <li>Los múltiplos pueden variar según condiciones de mercado</li>
                            <li>No considera activos intangibles específicos de la empresa</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
