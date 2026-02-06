/**
 * Investment Score Gauge Component
 * Visual gauge chart showing the Investment Readiness Score (0-100)
 */
export default function InvestmentScoreGauge({ score, rating, breakdown }) {
    // Calculate the rotation angle for the needle (0-100 maps to -90 to 90 degrees)
    const needleRotation = -90 + (score / 100) * 180;

    // Determine color based on score
    const getScoreColor = () => {
        if (score >= 80) return '#10b981'; // Green
        if (score >= 60) return '#3b82f6'; // Blue
        if (score >= 40) return '#f59e0b'; // Yellow
        return '#ef4444'; // Red
    };

    return (
        <div className="flex flex-col items-center">
            {/* Gauge SVG */}
            <div className="relative w-48 h-24 mb-4">
                <svg viewBox="0 0 200 100" className="w-full h-full">
                    {/* Background arc */}
                    <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="20"
                        strokeLinecap="round"
                    />

                    {/* Colored segments */}
                    <path
                        d="M 20 100 A 80 80 0 0 1 55 35"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="20"
                        strokeLinecap="round"
                        opacity="0.7"
                    />
                    <path
                        d="M 55 35 A 80 80 0 0 1 100 20"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="20"
                        opacity="0.7"
                    />
                    <path
                        d="M 100 20 A 80 80 0 0 1 145 35"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="20"
                        opacity="0.7"
                    />
                    <path
                        d="M 145 35 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="20"
                        strokeLinecap="round"
                        opacity="0.7"
                    />

                    {/* Needle */}
                    <g transform={`rotate(${needleRotation}, 100, 100)`}>
                        <line
                            x1="100"
                            y1="100"
                            x2="100"
                            y2="30"
                            stroke={getScoreColor()}
                            strokeWidth="4"
                            strokeLinecap="round"
                            className="transition-transform duration-1000 ease-out"
                        />
                        <circle
                            cx="100"
                            cy="100"
                            r="8"
                            fill={getScoreColor()}
                        />
                    </g>

                    {/* Center circle */}
                    <circle
                        cx="100"
                        cy="100"
                        r="6"
                        fill="white"
                        stroke={getScoreColor()}
                        strokeWidth="2"
                    />
                </svg>

                {/* Score Display */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
                    <div
                        className="text-3xl font-bold"
                        style={{ color: getScoreColor() }}
                    >
                        {score}
                    </div>
                    <div className="text-xs text-slate-500">de 100</div>
                </div>
            </div>

            {/* Rating Label */}
            <div
                className="px-4 py-1 rounded-full text-sm font-semibold text-white mb-4"
                style={{ backgroundColor: getScoreColor() }}
            >
                {rating}
            </div>

            {/* Breakdown */}
            {breakdown && breakdown.length > 0 && (
                <div className="w-full space-y-2">
                    {breakdown.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="flex-1">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-600">{item.name}</span>
                                    <span className="text-slate-400">{item.points}/{item.maxPoints}</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500
                      ${item.status === 'excellent' ? 'bg-success-500' :
                                                item.status === 'good' ? 'bg-primary-500' :
                                                    item.status === 'fair' ? 'bg-accent-500' :
                                                        'bg-red-500'}`}
                                        style={{ width: `${(item.points / item.maxPoints) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                            <span className="text-xs text-slate-500 w-16 text-right">{item.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
