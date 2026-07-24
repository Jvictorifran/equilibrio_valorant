<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\RoomPlayer;
use App\Services\TeamBalancer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    public function store(): RedirectResponse
    {
        $room = Room::create([
            'code' => Room::generateUniqueCode(),
            'host_id' => Auth::id(),
            'status' => 'waiting',
        ]);

        $room->players()->create(['user_id' => Auth::id()]);

        return to_route('rooms.show', $room->code);
    }

    public function join(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string'],
        ]);

        $room = Room::where('code', strtoupper($validated['code']))->first();

        if (! $room) {
            throw ValidationException::withMessages(['code' => 'Sala não encontrada. Confira o código.']);
        }

        if ($room->isDrawn()) {
            throw ValidationException::withMessages(['code' => 'Essa sala já sorteou os times.']);
        }

        if ($room->players()->where('user_id', Auth::id())->exists()) {
            return to_route('rooms.show', $room->code);
        }

        if ($room->isFull()) {
            throw ValidationException::withMessages(['code' => 'Essa sala já está com 10/10 jogadores.']);
        }

        $room->players()->create(['user_id' => Auth::id()]);

        return to_route('rooms.show', $room->code);
    }

    public function show(Room $room): Response
    {
        $room->load(['players.user', 'host']);

        return Inertia::render('Rooms/Show', [
            'room' => [
                'code' => $room->code,
                'status' => $room->status,
                'isHost' => $room->host_id === Auth::id(),
                'capacity' => Room::CAPACITY,
                'players' => $room->players->map(fn (RoomPlayer $roomPlayer) => [
                    'id' => $roomPlayer->user->id,
                    'name' => $roomPlayer->user->name,
                    'team' => $roomPlayer->team,
                    'rankTier' => $roomPlayer->user->rank_tier,
                    'kd' => $roomPlayer->user->kd,
                    'winRate' => $roomPlayer->user->win_rate,
                    'hsPercentage' => $roomPlayer->user->hs_percentage,
                    'balanceScore' => $roomPlayer->user->hasCompleteProfile() ? $roomPlayer->user->balanceScore() : null,
                    'hasCompleteProfile' => $roomPlayer->user->hasCompleteProfile(),
                ]),
            ],
        ]);
    }

    public function draw(Room $room, TeamBalancer $balancer): RedirectResponse
    {
        abort_unless($room->host_id === Auth::id(), 403);

        if ($room->isDrawn()) {
            return to_route('rooms.show', $room->code);
        }

        $players = $room->players()->with('user')->get()->pluck('user');

        if ($players->count() !== Room::CAPACITY) {
            throw ValidationException::withMessages(['draw' => 'A sala precisa estar com 10/10 jogadores para sortear.']);
        }

        if ($players->contains(fn ($user) => ! $user->hasCompleteProfile())) {
            throw ValidationException::withMessages(['draw' => 'Todo mundo precisa completar o perfil (elo, KD, win rate e HS%) antes do sorteio.']);
        }

        $teams = $balancer->balance($players);

        foreach ($teams as $teamLabel => $teamPlayers) {
            RoomPlayer::where('room_id', $room->id)
                ->whereIn('user_id', $teamPlayers->pluck('id'))
                ->update(['team' => $teamLabel]);
        }

        $room->update(['status' => 'drawn']);

        return to_route('rooms.show', $room->code);
    }

    public function leave(Room $room): RedirectResponse
    {
        if ($room->isDrawn()) {
            throw ValidationException::withMessages(['leave' => 'Não é possível sair depois do sorteio.']);
        }

        $room->players()->where('user_id', Auth::id())->delete();

        if ($room->host_id === Auth::id()) {
            $room->delete();
        }

        return to_route('dashboard');
    }
}
