<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $rooms = Room::where('host_id', $user->id)
            ->orWhereHas('players', fn ($query) => $query->where('user_id', $user->id))
            ->withCount('players')
            ->latest()
            ->get()
            ->map(fn (Room $room) => [
                'code' => $room->code,
                'status' => $room->status,
                'playersCount' => $room->players_count,
                'capacity' => Room::CAPACITY,
                'isHost' => $room->host_id === $user->id,
            ]);

        return Inertia::render('Dashboard', [
            'rooms' => $rooms,
            'hasCompleteProfile' => $user->hasCompleteProfile(),
        ]);
    }
}
