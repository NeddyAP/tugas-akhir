<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        if (Auth::user()->role !== 'superadmin') {
            return redirect()->back()->withErrors(['error' => 'Unauthorized access']);
        }

        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');

        // Query for admins/superadmins
        $adminQuery = User::where('role', 'admin')
            ->orWhere('role', 'superadmin');

        // Query for dosen
        $dosenQuery = User::where('role', 'dosen');

        // Query for mahasiswa
        $mahasiswaQuery = User::where('role', 'mahasiswa');

        if ($search) {
            $searchWildcard = '%' . $search . '%';
            $searchCallback = function ($query) use ($searchWildcard) {
                $query->where('name', 'like', $searchWildcard)
                    ->orWhere('email', 'like', $searchWildcard)
                    ->orWhere('nim', 'like', $searchWildcard)
                    ->orWhere('nip', 'like', $searchWildcard);
            };

            $adminQuery->where($searchCallback);
            $dosenQuery->where($searchCallback);
            $mahasiswaQuery->where($searchCallback);
        }

        return Inertia::render('Admin/User/UserPage', [
            'users' => $adminQuery->latest()->paginate($perPage)->withQueryString(),
            'dosens' => $dosenQuery->latest()->paginate($perPage)->withQueryString(),
            'mahasiswas' => $mahasiswaQuery->latest()->paginate($perPage)->withQueryString(),
            'filters' => $request->only(['search'])
        ]);
    }

    private function getValidationRules($userType, $id = null)
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', $id ? Rule::unique('users')->ignore($id) : 'unique:users'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string'],
        ];

        // Add password rule only for new users
        if (!$id) {
            $rules['password'] = ['required', 'string', 'min:8'];
        } else {
            $rules['password'] = ['nullable', 'string', 'min:8'];
        }

        // Add role-specific rules
        switch ($userType) {
            case 'admin':
                $rules['role'] = ['required', Rule::in(['admin', 'superadmin'])];
                break;
            case 'dosen':
                $rules['nip'] = ['required', 'string', $id ? Rule::unique('users')->ignore($id) : 'unique:users'];
                break;
            case 'mahasiswa':
                $rules['nim'] = ['required', 'string', $id ? Rule::unique('users')->ignore($id) : 'unique:users'];
                break;
        }

        return $rules;
    }

    public function store(Request $request)
    {
        if (Auth::user()->role !== 'superadmin') {
            return redirect()->back()->with('flash', [
                'message' => 'Unauthorized access',
                'type' => 'error'
            ]);
        }

        $tab = $request->input('tab', 'admin');
        $rules = $this->getValidationRules($tab);

        try {
            $validated = $request->validate($rules);

            // Set role based on tab
            $validated['role'] = match ($tab) {
                'admin' => $validated['role'] ?? 'admin',
                'dosen' => 'dosen',
                'mahasiswa' => 'mahasiswa',
                default => 'admin',
            };

            $validated['password'] = Hash::make($validated['password']);
            User::create($validated);

            return redirect()->back()->with('flash', [
                'message' => ucfirst($tab) . ' berhasil ditambahkan',
                'type' => 'success'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('flash', [
                'message' => 'Gagal menambahkan ' . $tab,
                'type' => 'error'
            ]);
        }
    }

    public function update(Request $request, string $id)
    {
        if (Auth::user()->role !== 'superadmin') {
            return redirect()->back()->with('flash', [
                'message' => 'Unauthorized access',
                'type' => 'error'
            ]);
        }

        try {
            $user = User::findOrFail($id);
            $tab = $request->query('tab', 'admin');
            $rules = $this->getValidationRules($tab, $id);
            $validated = $request->validate($rules);

            // Handle password update
            if (empty($validated['password'])) {
                unset($validated['password']);
            } else {
                $validated['password'] = Hash::make($validated['password']);
            }

            // Set role based on tab
            $validated['role'] = match ($tab) {
                'admin' => $validated['role'] ?? 'admin',
                'dosen' => 'dosen',
                'mahasiswa' => 'mahasiswa',
                default => $user->role,
            };

            $user->update($validated);

            return redirect()->back()->with('flash', [
                'message' => ucfirst($tab) . ' berhasil diperbarui',
                'type' => 'success'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('flash', [
                'message' => 'Gagal memperbarui ' . $tab,
                'type' => 'error'
            ]);
        }
    }

    public function destroy(Request $request, string $id)
    {
        if (Auth::user()->role !== 'superadmin') {
            return redirect()->back()->with('flash', [
                'message' => 'Unauthorized access',
                'type' => 'error'
            ]);
        }

        try {
            $user = User::findOrFail($id);
            $tab = $request->query('tab', 'admin');

            // Check if user's role matches the tab
            $roleMatches = match ($tab) {
                'admin' => in_array($user->role, ['admin', 'superadmin']),
                'dosen' => $user->role === 'dosen',
                'mahasiswa' => $user->role === 'mahasiswa',
                default => false,
            };

            if (!$roleMatches) {
                return redirect()->back()->with('flash', [
                    'message' => 'Invalid user type',
                    'type' => 'error'
                ]);
            }

            $user->delete();

            return redirect()->back()->with('flash', [
                'message' => ucfirst($tab) . ' berhasil dihapus',
                'type' => 'success'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('flash', [
                'message' => 'Gagal menghapus ' . $tab,
                'type' => 'error'
            ]);
        }
    }
}
