<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Traits\ResponseTrait;
use Inertia\Inertia;
use App\Models\Setting;

class SettingController extends Controller
{
    use ResponseTrait;

    public function create()
    {
        return Inertia::render('Admin/Settings/SettingsForm', [
            'settings_data' => Setting::get()
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'related_links' => 'nullable|array',
            'related_links.*' => 'nullable|string',
            'contact_info' => 'nullable|array',
            'contact_info.*' => 'nullable|string',
            'sistem_online' => 'nullable|array',
            'sistem_online.*' => 'nullable|string',
            'social_links' => 'nullable|array',
            'social_links.*' => 'nullable|string',
        ]);

        $settings = Setting::get();
        $settings->update($validatedData);

        return redirect()->back()->with('flash', [
            'message' => 'Settings berhasil diubah',
            'type' => 'success'
        ]);
    }
}
