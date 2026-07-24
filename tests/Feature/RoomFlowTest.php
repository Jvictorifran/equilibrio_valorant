<?php

namespace Tests\Feature;

use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoomFlowTest extends TestCase
{
    use RefreshDatabase;

    private function completeProfile(User $user): User
    {
        $user->forceFill([
            'rank_tier' => 'Gold',
            'kd' => 1.15,
            'win_rate' => 50,
            'hs_percentage' => 25,
        ])->save();

        return $user;
    }

    public function test_host_can_create_a_room_and_is_added_as_the_first_player(): void
    {
        $host = $this->completeProfile(User::factory()->create());

        $response = $this->actingAs($host)->post('/rooms');

        $room = Room::first();

        $response->assertRedirect('/rooms/'.$room->code);
        $this->assertSame($host->id, $room->host_id);
        $this->assertSame(1, $room->players()->count());
    }

    public function test_players_can_join_a_room_by_code_until_full_then_it_rejects_more(): void
    {
        $host = $this->completeProfile(User::factory()->create());
        $this->actingAs($host)->post('/rooms');
        $room = Room::first();

        for ($i = 0; $i < 9; $i++) {
            $player = $this->completeProfile(User::factory()->create());
            $this->actingAs($player)->post('/rooms/join', ['code' => $room->code])
                ->assertRedirect('/rooms/'.$room->code);
        }

        $this->assertSame(10, $room->players()->count());

        $overflow = $this->completeProfile(User::factory()->create());
        $this->actingAs($overflow)->post('/rooms/join', ['code' => $room->code])
            ->assertSessionHasErrors('code');
    }

    public function test_only_the_host_can_draw_and_only_once_the_room_is_full(): void
    {
        $host = $this->completeProfile(User::factory()->create());
        $this->actingAs($host)->post('/rooms');
        $room = Room::first();

        $guest = $this->completeProfile(User::factory()->create());
        $this->actingAs($guest)->post('/rooms/join', ['code' => $room->code]);

        // Not full yet: host draw should fail validation.
        $this->actingAs($host)->post("/rooms/{$room->code}/draw")
            ->assertSessionHasErrors('draw');

        for ($i = 0; $i < 8; $i++) {
            $player = $this->completeProfile(User::factory()->create());
            $this->actingAs($player)->post('/rooms/join', ['code' => $room->code]);
        }

        // Non-host cannot draw.
        $this->actingAs($guest)->post("/rooms/{$room->code}/draw")->assertForbidden();

        $this->actingAs($host)->post("/rooms/{$room->code}/draw")
            ->assertRedirect('/rooms/'.$room->code);

        $room->refresh();
        $this->assertTrue($room->isDrawn());
        $this->assertSame(5, $room->players()->where('team', 'A')->count());
        $this->assertSame(5, $room->players()->where('team', 'B')->count());
    }
}
