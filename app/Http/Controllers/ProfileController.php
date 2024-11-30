<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user()->load('profilable');

        return Inertia::render('Front/Profile/ProfilePage', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'user' => $user,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        try {
            \DB::transaction(function () use ($user, $validated) {
                // Update user basic info
                $user->update([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                ]);

                // Update profile specific fields
                $profileData = [
                    'phone' => $validated['phone'],
                    'address' => $validated['address'],
                ];

                if ($user->role === 'mahasiswa') {
                    $profileData = array_merge($profileData, [
                        'nim' => $validated['nim'],
                        'angkatan' => $validated['angkatan'],
                        'prodi' => $validated['prodi'],
                        'fakultas' => $validated['fakultas'],
                    ]);
                } elseif ($user->role === 'dosen') {
                    $profileData['nip'] = $validated['nip'];
                }

                $user->profilable->update($profileData);
            });

            return Redirect::route('profile.edit')->with('flash', [
                'type' => 'success',
                'message' => 'Profile berhasil diubah',
            ]);
        } catch (\Exception $e) {
            return Redirect::back()->withErrors('flash', [
                'type' => 'error',
                'message' => 'Profile gagal diubah',
            ]);
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
