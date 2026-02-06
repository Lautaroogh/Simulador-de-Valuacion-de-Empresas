import { useState } from 'react';

/**
 * Header Component
 * Navigation and branding for ValuaPyME
 */
export default function Header({
    currentView,
    onNavigate,
    onNewValuation,
    savedCount,
    onToggleGlossary
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { id: 'wizard', label: 'Nueva Valuación', icon: '📊' },
        { id: 'history', label: 'Historial', icon: '📁', badge: savedCount },
    ];

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('wizard')}>
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                            <span className="text-white text-xl md:text-2xl font-bold">V</span>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="font-display text-xl md:text-2xl font-bold text-slate-800">
                                Valua<span className="text-primary-600">PyME</span>
                            </h1>
                            <p className="text-xs text-slate-500 -mt-1">Valuación de Empresas</p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-2">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2
                  ${currentView === item.id
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                                {item.badge > 0 && (
                                    <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        ))}

                        <div className="w-px h-8 bg-slate-200 mx-2"></div>

                        <button
                            onClick={onToggleGlossary}
                            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-all duration-300 flex items-center gap-2"
                        >
                            <span>❓</span>
                            <span>Ayuda</span>
                        </button>

                        <button
                            onClick={onNewValuation}
                            className="btn-primary ml-2"
                        >
                            + Nueva
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-slate-200 animate-fade-in">
                        <nav className="flex flex-col gap-2">
                            {navItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onNavigate(item.id);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 w-full text-left
                    ${currentView === item.id
                                            ? 'bg-primary-100 text-primary-700'
                                            : 'text-slate-600 hover:bg-slate-100'}`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{item.label}</span>
                                    {item.badge > 0 && (
                                        <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full ml-auto">
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            ))}

                            <button
                                onClick={() => {
                                    onToggleGlossary();
                                    setMobileMenuOpen(false);
                                }}
                                className="px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 transition-all duration-300 flex items-center gap-3 w-full text-left"
                            >
                                <span className="text-xl">❓</span>
                                <span>Ayuda / Glosario</span>
                            </button>

                            <button
                                onClick={() => {
                                    onNewValuation();
                                    setMobileMenuOpen(false);
                                }}
                                className="btn-primary mt-2 justify-center"
                            >
                                + Nueva Valuación
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
