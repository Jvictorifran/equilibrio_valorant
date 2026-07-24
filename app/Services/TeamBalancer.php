<?php

namespace App\Services;

use App\Models\Room;
use App\Models\User;
use Illuminate\Support\Collection;

class TeamBalancer
{
    /**
     * Splits players into two teams of equal size, keeping the sum of balance
     * scores as close as possible. Greedy longest-processing-time: place the
     * strongest player first, then always drop the next player onto whichever
     * team currently weighs less (skipping a team once it hits capacity).
     *
     * @param  Collection<int, User>  $players
     * @return array{A: Collection<int, User>, B: Collection<int, User>}
     */
    public function balance(Collection $players): array
    {
        $sorted = $players->sortByDesc(fn (User $user) => $user->balanceScore())->values();

        $teams = ['A' => collect(), 'B' => collect()];
        $totals = ['A' => 0.0, 'B' => 0.0];
        $capacity = (int) (Room::CAPACITY / 2);

        foreach ($sorted as $player) {
            $team = $this->pickTeam($teams, $totals, $capacity);
            $teams[$team]->push($player);
            $totals[$team] += $player->balanceScore();
        }

        return $teams;
    }

    /**
     * @param  array{A: Collection, B: Collection}  $teams
     * @param  array{A: float, B: float}  $totals
     */
    private function pickTeam(array $teams, array $totals, int $capacity): string
    {
        if ($teams['A']->count() >= $capacity) {
            return 'B';
        }

        if ($teams['B']->count() >= $capacity) {
            return 'A';
        }

        return $totals['A'] <= $totals['B'] ? 'A' : 'B';
    }
}
