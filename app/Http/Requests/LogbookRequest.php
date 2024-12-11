<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LogbookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => 'required|string',
            'tanggal' => 'required|date',
            'catatan' => 'required|string',
            'keterangan' => 'required|string',
        ];
    }
}
