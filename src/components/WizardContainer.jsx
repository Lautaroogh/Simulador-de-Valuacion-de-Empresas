import Step1BasicInfo from './steps/Step1BasicInfo';
import Step2Financial from './steps/Step2Financial';
import Step3Projections from './steps/Step3Projections';

/**
 * Wizard Container Component
 * Manages the 3-step valuation input form
 */
export default function WizardContainer({
    step,
    companyData,
    onUpdateData,
    onUpdateIngreso,
    onNext,
    onPrev,
    onLoadExample
}) {
    const steps = [
        { number: 1, title: 'Información Básica', subtitle: 'Datos de la empresa' },
        { number: 2, title: 'Datos Financieros', subtitle: 'Métricas clave' },
        { number: 3, title: 'Proyecciones', subtitle: 'Escenarios y ajustes' }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header with title */}
            <div className="text-center mb-8 animate-fade-in">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                    Valua tu Empresa
                </h2>
                <p className="text-slate-500">
                    Completa los datos para obtener una valuación profesional
                </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    {steps.map((s, index) => (
                        <div key={s.number} className="flex items-center flex-1">
                            {/* Step Circle */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500
                    ${step >= s.number
                                            ? 'gradient-primary text-white shadow-lg'
                                            : 'bg-slate-200 text-slate-500'}`}
                                >
                                    {step > s.number ? (
                                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        s.number
                                    )}
                                </div>
                                <div className="hidden md:block text-center mt-2">
                                    <p className={`text-sm font-medium ${step >= s.number ? 'text-primary-600' : 'text-slate-400'}`}>
                                        {s.title}
                                    </p>
                                    <p className="text-xs text-slate-400">{s.subtitle}</p>
                                </div>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-1 mx-2 md:mx-4 rounded-full overflow-hidden bg-slate-200">
                                    <div
                                        className="h-full gradient-primary transition-all duration-500"
                                        style={{ width: step > s.number ? '100%' : '0%' }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Mobile step titles */}
                <div className="md:hidden text-center">
                    <p className="text-sm font-medium text-primary-600">
                        Paso {step}: {steps[step - 1].title}
                    </p>
                </div>
            </div>

            {/* Form Card */}
            <div className="glass-card-strong p-6 md:p-8 animate-slide-up">
                {/* Example Loader - Only on Step 1 */}
                {step === 1 && (
                    <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-sm text-slate-600 mb-3 font-medium">
                            🚀 Cargar ejemplo pre-definido:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => onLoadExample('techStartup')}
                                className="px-3 py-1.5 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                            >
                                💻 Tech Startup
                            </button>
                            <button
                                onClick={() => onLoadExample('retailConsolidado')}
                                className="px-3 py-1.5 text-sm bg-success-100 text-success-700 rounded-lg hover:bg-success-200 transition-colors"
                            >
                                🛒 Retail Consolidado
                            </button>
                            <button
                                onClick={() => onLoadExample('manufacturaTradicional')}
                                className="px-3 py-1.5 text-sm bg-accent-100 text-accent-700 rounded-lg hover:bg-accent-200 transition-colors"
                            >
                                🏭 Manufactura
                            </button>
                        </div>
                    </div>
                )}

                {/* Step Content */}
                <div className="min-h-[350px]">
                    {step === 1 && (
                        <Step1BasicInfo
                            data={companyData}
                            onUpdate={onUpdateData}
                        />
                    )}
                    {step === 2 && (
                        <Step2Financial
                            data={companyData}
                            onUpdate={onUpdateData}
                            onUpdateIngreso={onUpdateIngreso}
                        />
                    )}
                    {step === 3 && (
                        <Step3Projections
                            data={companyData}
                            onUpdate={onUpdateData}
                        />
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
                    <button
                        onClick={onPrev}
                        disabled={step === 1}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2
              ${step === 1
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Anterior
                    </button>

                    <div className="text-sm text-slate-400">
                        Paso {step} de 3
                    </div>

                    <button
                        onClick={onNext}
                        className="btn-primary flex items-center gap-2"
                    >
                        {step === 3 ? (
                            <>
                                Calcular Valuación
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </>
                        ) : (
                            <>
                                Siguiente
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
