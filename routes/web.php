<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoomController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', DashboardController::class)
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/rooms', [RoomController::class, 'store'])->name('rooms.store');
    Route::post('/rooms/join', [RoomController::class, 'join'])->name('rooms.join');
    Route::get('/rooms/{room}', [RoomController::class, 'show'])->name('rooms.show');
    Route::post('/rooms/{room}/draw', [RoomController::class, 'draw'])->name('rooms.draw');
    Route::post('/rooms/{room}/leave', [RoomController::class, 'leave'])->name('rooms.leave');
});

require __DIR__.'/auth.php';
