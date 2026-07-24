<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Support\ValorantRanks;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'rank_tier' => ['required', Rule::in(ValorantRanks::TIERS)],
            'kd' => ['required', 'numeric', 'between:0,10'],
            'win_rate' => ['required', 'numeric', 'between:0,100'],
            'hs_percentage' => ['required', 'numeric', 'between:0,100'],
        ];
    }
}
