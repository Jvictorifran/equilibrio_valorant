<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Support\ValorantRanks;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'rank_tier', 'kd', 'win_rate', 'hs_percentage'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'kd' => 'float',
            'win_rate' => 'float',
            'hs_percentage' => 'float',
        ];
    }

    public function hostedRooms(): HasMany
    {
        return $this->hasMany(Room::class, 'host_id');
    }

    public function roomPlayers(): HasMany
    {
        return $this->hasMany(RoomPlayer::class);
    }

    public function hasCompleteProfile(): bool
    {
        return $this->rank_tier !== null
            && $this->kd !== null
            && $this->win_rate !== null
            && $this->hs_percentage !== null;
    }

    /**
     * Composite skill score (0-100) used to balance teams: rank 40%, KD 25%, win rate 20%, HS% 15%.
     */
    public function balanceScore(): float
    {
        $rankNormalized = ValorantRanks::value($this->rank_tier) / ValorantRanks::MAX_VALUE * 100;
        $kdNormalized = min(100, max(0, ($this->kd ?? 0) / 2 * 100));
        $winRate = min(100, max(0, (float) ($this->win_rate ?? 0)));
        $hs = min(100, max(0, (float) ($this->hs_percentage ?? 0)));

        return $rankNormalized * 0.4 + $kdNormalized * 0.25 + $winRate * 0.2 + $hs * 0.15;
    }
}
