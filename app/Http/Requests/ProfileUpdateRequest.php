<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'phone' => ['required', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:255'],
        ];

        if ($this->user()->role === 'mahasiswa') {
            $rules = array_merge($rules, [
                'nim' => ['required', 'string', 'max:20'],
                'angkatan' => ['required', 'string', 'max:4'],
                'prodi' => ['nullable', 'string', 'max:255'],
                'fakultas' => ['nullable', 'string', 'max:255'],
            ]);
        }

        if ($this->user()->role === 'dosen') {
            $rules['nip'] = ['required', 'string', 'max:20'];
        }

        return $rules;
    }
}
