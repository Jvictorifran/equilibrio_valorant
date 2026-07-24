import { RANK_COLORS, RANK_LABELS } from '@/ranks';

export default function RankBadge({ tier, className = '' }) {
    if (!tier) {
        return (
            <span
                className={`inline-flex items-center rounded border border-dashed border-steel-line px-2 py-1 font-mono text-xs text-mist ${className}`}
            >
                sem elo
            </span>
        );
    }

    const color = RANK_COLORS[tier] ?? '#7D8A96';
    const label = RANK_LABELS[tier] ?? tier;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded border border-steel-line bg-steel px-2 py-1 ${className}`}
        >
            <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
                aria-hidden="true"
            />
            <span className="font-mono text-xs text-paper">{label}</span>
        </span>
    );
}
