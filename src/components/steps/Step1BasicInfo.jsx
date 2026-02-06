import { SECTOR_MULTIPLES, COMPANY_SIZES } from '../../data/sectorMultiples';

/**
 * Step 1: Basic Information
 * Company name, sector, size, and age
 */
export default function Step1BasicInfo({ data, onUpdate }) {
    const sectors = Object.entries(SECTOR_MULTIPLES);
    const sizes = Object.entries(COMPANY_SIZES);

    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <span className="text-2xl">🏢</span>
                Información de la Empresa
            </h3>

            {/* Company Name */}
            <div className="space-y-2">
                <label className="input-label flex items-center gap-2">
                    Nombre de la Empresa
                    <span className="text-slate-400 text-xs font-normal">(opcional)</span>
                </label>
                <input
                    type="text"
                    value={data.nombre}
                    onChange={(e) => onUpdate('nombre', e.target.value)}
                    placeholder="Ej: Mi Empresa S.A."
                    className="input-field"
                />
            </div>

            {/* Sector Selection */}
            <div className="space-y-2">
                <label className="input-label flex items-center gap-2">
                    Sector / Industria
                    <div className="tooltip">
                        <span className="w-4 h-4 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center cursor-help">i</span>
                        <span className="tooltip-content">El sector determina los múltiplos de valuación aplicables</span>
                    </div>
                </label>
                <select
                    value={data.sector}
                    onChange={(e) => onUpdate('sector', e.target.value)}
                    className="select-field"
                >
                    {sectors.map(([key, sector]) => (
                        <option key={key} value={key}>
                            {sector.icon} {sector.name}
                        </option>
                    ))}
                </select>

                {/* Sector Info Card */}
                {data.sector && (
                    <div className="mt-3 p-4 bg-primary-50 rounded-xl border border-primary-100 animate-fade-in">
                        <div className="flex items-center gap-2 text-primary-700 font-medium mb-2">
                            <span className="text-xl">{SECTOR_MULTIPLES[data.sector]?.icon}</span>
                            {SECTOR_MULTIPLES[data.sector]?.name}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-slate-500">EV/EBITDA típico:</span>
                                <span className="ml-2 font-medium text-slate-700">
                                    {SECTOR_MULTIPLES[data.sector]?.evEbitda.typical}x
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-500">EV/Revenue típico:</span>
                                <span className="ml-2 font-medium text-slate-700">
                                    {SECTOR_MULTIPLES[data.sector]?.evRevenue.typical}x
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Company Size */}
            <div className="space-y-2">
                <label className="input-label flex items-center gap-2">
                    Tamaño de la Empresa
                    <div className="tooltip">
                        <span className="w-4 h-4 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center cursor-help">i</span>
                        <span className="tooltip-content">El tamaño afecta el descuento por riesgo</span>
                    </div>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {sizes.map(([key, size]) => (
                        <button
                            key={key}
                            onClick={() => onUpdate('tamano', key)}
                            className={`p-4 rounded-xl border-2 text-left transition-all duration-300
                ${data.tamano === key
                                    ? 'border-primary-500 bg-primary-50 shadow-md'
                                    : 'border-slate-200 bg-white hover:border-primary-200 hover:bg-slate-50'}`}
                        >
                            <div className={`font-semibold ${data.tamano === key ? 'text-primary-700' : 'text-slate-700'}`}>
                                {size.name}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                                {size.description}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Company Age */}
            <div className="space-y-2">
                <label className="input-label flex items-center gap-2">
                    Antigüedad (años)
                    <div className="tooltip">
                        <span className="w-4 h-4 rounded-full bg-primary-100 text-primary-600 text-xs flex items-center justify-center cursor-help">i</span>
                        <span className="tooltip-content">Empresas más antiguas suelen tener mayor goodwill</span>
                    </div>
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="1"
                        max="50"
                        value={data.antiguedad}
                        onChange={(e) => onUpdate('antiguedad', parseInt(e.target.value))}
                        className="flex-1"
                    />
                    <div className="w-20 h-12 rounded-xl bg-primary-100 flex items-center justify-center font-bold text-primary-700 text-lg">
                        {data.antiguedad}
                    </div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 px-1">
                    <span>1 año</span>
                    <span>25 años</span>
                    <span>50 años</span>
                </div>
            </div>

            {/* Employee Count (Optional) */}
            <div className="space-y-2">
                <label className="input-label flex items-center gap-2">
                    Cantidad de Empleados
                    <span className="text-slate-400 text-xs font-normal">(opcional)</span>
                </label>
                <input
                    type="number"
                    value={data.empleados}
                    onChange={(e) => onUpdate('empleados', e.target.value)}
                    placeholder="Ej: 50"
                    min="1"
                    className="input-field"
                />
            </div>
        </div>
    );
}
