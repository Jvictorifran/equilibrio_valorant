<?php

namespace App\Support;

class ValorantRanks
{
    /**
     * Ordered low to high.
     */
    public const TIERS = [
        'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum',
        'Diamond', 'Ascendant', 'Immortal', 'Radiant',
    ];

    public const MAX_VALUE = 9;

    /**
     * Convert a tier into an ascending scale (1-9).
     */
    public static function value(?string $tier): int
    {
        $index = array_search($tier, self::TIERS, true);

        if ($index === false) {
            return 0;
        }

        return $index + 1;
    }
}
