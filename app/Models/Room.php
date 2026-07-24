<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['code', 'host_id', 'status'])]
class Room extends Model
{
    public const CAPACITY = 10;

    public function getRouteKeyName(): string
    {
        return 'code';
    }

    public function host(): BelongsTo
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function players(): HasMany
    {
        return $this->hasMany(RoomPlayer::class);
    }

    public function isFull(): bool
    {
        return $this->players()->count() >= self::CAPACITY;
    }

    public function isDrawn(): bool
    {
        return $this->status === 'drawn';
    }

    /**
     * Excludes visually ambiguous characters (0/O, 1/I/L) since this code gets read aloud and typed by hand.
     */
    public static function generateUniqueCode(): string
    {
        $alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

        do {
            $code = collect(range(1, 6))
                ->map(fn () => $alphabet[random_int(0, strlen($alphabet) - 1)])
                ->implode('');
        } while (self::where('code', $code)->exists());

        return $code;
    }
}
