/**
 * The signature element: a literal scale. Idle and level while the room fills
 * up, then tips toward whichever team ended up with the higher composite
 * score once the host runs the draw, before settling level again.
 */
export default function BalanceBeam({
    leftTotal = 0,
    rightTotal = 0,
    leftLabel = 'Alfa',
    rightLabel = 'Bravo',
    resolved = false,
}) {
    const diff = leftTotal - rightTotal;
    const maxDiff = 60;
    const maxDeg = 9;
    const angle = resolved
        ? Math.max(-maxDeg, Math.min(maxDeg, (diff / maxDiff) * maxDeg))
        : 0;

    return (
        <div className="mx-auto w-full max-w-md select-none">
            <svg viewBox="0 0 320 150" className="w-full overflow-visible">
                <polygon points="160,120 150,133 170,133" fill="#232E38" />
                <rect x="155" y="116" width="10" height="6" fill="#232E38" />

                <g
                    style={{
                        transform: `rotate(${angle}deg)`,
                        transformOrigin: '160px 118px',
                        transition:
                            'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                >
                    <rect
                        x="20"
                        y="116"
                        width="280"
                        height="4"
                        rx="2"
                        fill="#E7EDF2"
                    />
                    <line
                        x1="30"
                        y1="118"
                        x2="30"
                        y2="128"
                        stroke="#E7EDF2"
                        strokeWidth="2"
                    />
                    <line
                        x1="290"
                        y1="118"
                        x2="290"
                        y2="128"
                        stroke="#E7EDF2"
                        strokeWidth="2"
                    />
                    <polygon points="8,128 52,128 30,145" fill="#34E6C7" />
                    <polygon points="268,128 312,128 290,145" fill="#FF8A4C" />
                </g>
            </svg>
            <div className="mt-1 flex items-center justify-between font-mono text-xs text-mist">
                <span>
                    {leftLabel} · {resolved ? Math.round(leftTotal) : '--'}
                </span>
                <span>
                    {rightLabel} · {resolved ? Math.round(rightTotal) : '--'}
                </span>
            </div>
        </div>
    );
}
