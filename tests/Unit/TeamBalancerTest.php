<?php

namespace Tests\Unit;

use App\Models\User;
use App\Services\TeamBalancer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;
use Tests\TestCase;

class TeamBalancerTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_splits_ten_players_into_two_balanced_teams_of_five(): void
    {
        $scores = [95, 88, 76, 70, 65, 60, 55, 40, 30, 10];

        $players = collect($scores)->map(
            fn (int $score) => User::factory()->create([
                'rank_tier' => 'Radiant',
                'kd' => $score / 50,
                'win_rate' => $score,
                'hs_percentage' => $score,
            ])
        );

        $teams = (new TeamBalancer)->balance($players);

        $this->assertCount(5, $teams['A']);
        $this->assertCount(5, $teams['B']);

        $totalA = $teams['A']->sum(fn (User $u) => $u->balanceScore());
        $totalB = $teams['B']->sum(fn (User $u) => $u->balanceScore());

        $this->assertEqualsWithDelta($totalA, $totalB, 20, 'Team totals should be close to each other.');
    }

    public function test_it_never_exceeds_five_players_per_team(): void
    {
        $players = collect(range(1, 10))->map(
            fn (int $i) => User::factory()->create([
                'rank_tier' => 'Gold',
                'kd' => 1.0,
                'win_rate' => 50,
                'hs_percentage' => 20,
            ])
        );

        $teams = (new TeamBalancer)->balance($players);

        $this->assertSame(5, $teams['A']->count());
        $this->assertSame(5, $teams['B']->count());
    }
}
