<?php

namespace App\Http\Traits;

use Illuminate\Http\RedirectResponse;

trait ResponseTrait
{
    protected function flashResponse(string $message, string $type = 'success'): RedirectResponse
    {
        return redirect()->back()->with('flash', [
            'message' => $message,
            'type' => $type,
        ]);
    }
}
