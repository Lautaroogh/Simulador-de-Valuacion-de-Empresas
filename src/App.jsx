import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import WizardContainer from './components/WizardContainer';
import ResultsDashboard from './components/ResultsDashboard';
import ValuationHistory from './components/ValuationHistory';
import Glossary from './components/Glossary';
import { calculateValuation } from './utils/calculations';
import { getValuations, saveValuation, getConfig, saveConfig } from './utils/storage';
import { EXAMPLES } from './data/sectorMultiples';

/**
 * Main Application Component
 * ValuaPyME - Professional SME Valuation Simulator
 */
function App() {
    // ============================================
    // STATE MANAGEMENT
    // ============================================

    // Current view: 'wizard' | 'results' | 'history' | 'compare'
    const [currentView, setCurrentView] = useState('wizard');

    // Wizard step (1-3)
    const [wizardStep, setWizardStep] = useState(1);

    // Company data from wizard form
    const [companyData, setCompanyData] = useState({
        nombre: '',
        sector: 'tecnologia',
        tamano: 'pequena',
        antiguedad: 5,
        ingresos: ['', '', ''],
        ebitda: '',
        activos: '',
        pasivos: '',
        empleados: '',
        tasaCrecimiento: 10,
        wacc: null, // null = auto-calculate
        escenario: 'base'
    });

    // Valuation results
    const [results, setResults] = useState(null);

    // AI Analysis
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);

    // Saved valuations history
    const [savedValuations, setSavedValuations] = useState([]);

    // Comparison mode
    const [compareIds, setCompareIds] = useState([]);

    // UI State
    const [showGlossary, setShowGlossary] = useState(false);
    const [notification, setNotification] = useState(null);
    const [config, setConfig] = useState({ unidadMoneda: 'USD' });

    // ============================================
    // EFFECTS
    // ============================================

    // Load saved data on mount
    useEffect(() => {
        const savedConfig = getConfig();
        setConfig(savedConfig);
        loadValuations();
    }, []);

    // Auto-hide notifications
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // ============================================
    // DATA HANDLERS
    // ============================================

    const loadValuations = useCallback(() => {
        const valuations = getValuations();
        setSavedValuations(valuations);
    }, []);

    const updateCompanyData = useCallback((field, value) => {
        setCompanyData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const updateIngreso = useCallback((index, value) => {
        setCompanyData(prev => {
            const newIngresos = [...prev.ingresos];
            newIngresos[index] = value;
            return { ...prev, ingresos: newIngresos };
        });
    }, []);

    // ============================================
    // VALUATION HANDLERS
    // ============================================

    const performValuation = useCallback(() => {
        // Parse numeric values
        const parsedData = {
            ...companyData,
            ingresos: companyData.ingresos.map(v => parseFloat(v) || 0).filter(v => v > 0),
            ebitda: parseFloat(companyData.ebitda) || 0,
            activos: parseFloat(companyData.activos) || 0,
            pasivos: parseFloat(companyData.pasivos) || 0,
            empleados: parseInt(companyData.empleados) || 0,
            antiguedad: parseInt(companyData.antiguedad) || 1,
            tasaCrecimiento: parseFloat(companyData.tasaCrecimiento) || 0
        };

        // Validate minimum requirements
        if (parsedData.ebitda <= 0 || parsedData.ingresos.length === 0) {
            setNotification({
                type: 'error',
                message: 'Por favor complete los campos financieros obligatorios'
            });
            return;
        }

        // Calculate valuation
        const valuationResults = calculateValuation(parsedData);
        setResults({
            ...valuationResults,
            companyData: parsedData
        });

        setCurrentView('results');
        setAiAnalysis(null); // Reset AI analysis
    }, [companyData]);

    const handleSaveValuation = useCallback(() => {
        if (!results) return;

        const valuationToSave = {
            nombre: companyData.nombre || `Valuación ${new Date().toLocaleDateString()}`,
            sector: companyData.sector,
            inputs: companyData,
            resultados: {
                valorFinal: results.enterpriseValue,
                rango: results.range,
                metodologias: {
                    multiples: results.methodologies.multiples.value,
                    dcf: results.methodologies.dcf.value,
                    asset: results.methodologies.asset.value
                },
                score: results.investmentScore.score
            }
        };

        try {
            saveValuation(valuationToSave);
            loadValuations();
            setNotification({
                type: 'success',
                message: '✅ Valuación guardada exitosamente'
            });
        } catch (error) {
            setNotification({
                type: 'error',
                message: 'Error al guardar la valuación'
            });
        }
    }, [results, companyData, loadValuations]);

    // ============================================
    // AI ANALYSIS
    // ============================================

    const generateAIAnalysis = useCallback(async (apiKey) => {
        if (!results || !apiKey) return;

        setAiLoading(true);

        const prompt = `Eres un analista financiero experto en valuación de PyMEs. Analiza esta valuación de empresa:

DATOS DE LA EMPRESA:
- Sector: ${companyData.sector}
- Tamaño: ${companyData.tamano}
- Antigüedad: ${companyData.antiguedad} años
- Ingresos (último año): $${results.companyData.ingresos[results.companyData.ingresos.length - 1]?.toLocaleString()}
- EBITDA: $${results.companyData.ebitda?.toLocaleString()}
- Margen EBITDA: ${((results.companyData.ebitda / results.companyData.ingresos[results.companyData.ingresos.length - 1]) * 100).toFixed(1)}%
- Ratio Deuda/EBITDA: ${(results.companyData.pasivos / results.companyData.ebitda).toFixed(1)}x
- Investment Score: ${results.investmentScore.score}/100

RESULTADO DE VALUACIÓN:
- Enterprise Value: $${results.enterpriseValue?.toLocaleString()}
- Rango: $${results.range.min?.toLocaleString()} - $${results.range.max?.toLocaleString()}

Genera un análisis ejecutivo de 150-200 palabras que incluya:
1. Resumen de la salud financiera
2. Fortalezas y debilidades clave
3. Comparación vs promedio del sector
4. 2-3 recomendaciones para aumentar valor
5. Red flags (si existen)

Usa tono profesional pero accesible. Responde en español.`;

        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'anthropic-dangerous-direct-browser-access': 'true'
                },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 1024,
                    messages: [{ role: 'user', content: prompt }]
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            const analysisText = data.content[0]?.text || 'No se pudo generar el análisis.';
            setAiAnalysis(analysisText);
        } catch (error) {
            console.error('AI Analysis error:', error);
            setAiAnalysis('Error al conectar con la API de Claude. Por favor verifica tu API key e intenta nuevamente.');
        } finally {
            setAiLoading(false);
        }
    }, [results, companyData]);

    // ============================================
    // NAVIGATION HANDLERS
    // ============================================

    const handleNextStep = useCallback(() => {
        if (wizardStep < 3) {
            setWizardStep(prev => prev + 1);
        } else {
            performValuation();
        }
    }, [wizardStep, performValuation]);

    const handlePrevStep = useCallback(() => {
        if (wizardStep > 1) {
            setWizardStep(prev => prev - 1);
        }
    }, [wizardStep]);

    const handleNewValuation = useCallback(() => {
        setCurrentView('wizard');
        setWizardStep(1);
        setResults(null);
        setAiAnalysis(null);
        setCompanyData({
            nombre: '',
            sector: 'tecnologia',
            tamano: 'pequena',
            antiguedad: 5,
            ingresos: ['', '', ''],
            ebitda: '',
            activos: '',
            pasivos: '',
            empleados: '',
            tasaCrecimiento: 10,
            wacc: null,
            escenario: 'base'
        });
    }, []);

    const handleLoadExample = useCallback((exampleKey) => {
        const example = EXAMPLES[exampleKey];
        if (example) {
            setCompanyData({
                nombre: example.name,
                sector: example.sector,
                tamano: example.tamano,
                antiguedad: example.antiguedad,
                ingresos: example.ingresos.map(String),
                ebitda: String(example.ebitda),
                activos: String(example.activos),
                pasivos: String(example.pasivos),
                empleados: String(example.empleados),
                tasaCrecimiento: example.tasaCrecimiento,
                wacc: null,
                escenario: example.escenario
            });
            setNotification({
                type: 'info',
                message: `📋 Ejemplo "${example.name}" cargado`
            });
        }
    }, []);

    const handleLoadValuation = useCallback((valuation) => {
        if (valuation.inputs) {
            setCompanyData(valuation.inputs);
            setCurrentView('wizard');
            setWizardStep(3);
            setNotification({
                type: 'info',
                message: `📂 Valuación "${valuation.nombre}" cargada`
            });
        }
    }, []);

    // ============================================
    // RENDER
    // ============================================

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
            {/* Header */}
            <Header
                currentView={currentView}
                onNavigate={setCurrentView}
                onNewValuation={handleNewValuation}
                savedCount={savedValuations.length}
                onToggleGlossary={() => setShowGlossary(!showGlossary)}
            />

            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-20 right-4 z-50 px-6 py-4 rounded-xl shadow-lg animate-slide-in-right
          ${notification.type === 'success' ? 'bg-success-500 text-white' : ''}
          ${notification.type === 'error' ? 'bg-red-500 text-white' : ''}
          ${notification.type === 'info' ? 'bg-primary-500 text-white' : ''}`}
                >
                    {notification.message}
                </div>
            )}

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Wizard View */}
                {currentView === 'wizard' && (
                    <WizardContainer
                        step={wizardStep}
                        companyData={companyData}
                        onUpdateData={updateCompanyData}
                        onUpdateIngreso={updateIngreso}
                        onNext={handleNextStep}
                        onPrev={handlePrevStep}
                        onLoadExample={handleLoadExample}
                    />
                )}

                {/* Results View */}
                {currentView === 'results' && results && (
                    <ResultsDashboard
                        results={results}
                        companyData={companyData}
                        aiAnalysis={aiAnalysis}
                        aiLoading={aiLoading}
                        onGenerateAI={generateAIAnalysis}
                        onSave={handleSaveValuation}
                        onNewValuation={handleNewValuation}
                    />
                )}

                {/* History View */}
                {currentView === 'history' && (
                    <ValuationHistory
                        valuations={savedValuations}
                        onLoad={handleLoadValuation}
                        onRefresh={loadValuations}
                        onNewValuation={handleNewValuation}
                        compareIds={compareIds}
                        onCompareToggle={(id) => {
                            setCompareIds(prev =>
                                prev.includes(id)
                                    ? prev.filter(i => i !== id)
                                    : prev.length < 3 ? [...prev, id] : prev
                            );
                        }}
                    />
                )}
            </main>

            {/* Glossary Sidebar */}
            {showGlossary && (
                <Glossary onClose={() => setShowGlossary(false)} />
            )}

            {/* Footer */}
            <footer className="mt-auto py-8 text-center text-slate-500 text-sm">
                <div className="container mx-auto px-4">
                    <p className="mb-2">
                        <span className="font-semibold text-primary-600">ValuaPyME</span> - Simulador de Valuación de Empresas
                    </p>
                    <p className="text-xs text-slate-400">
                        Proyecto académico. Los resultados son estimaciones y no constituyen asesoramiento financiero.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;
