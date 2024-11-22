<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\MahasiswaProfile;
use App\Models\DosenProfile;
use App\Models\AdminProfile;

class UserController extends Controller
{
    public function index(Request $request)
    {
        if (Auth::user()->role !== 'superadmin') {
            return redirect()->back()->withErrors(['error' => 'Unauthorized access']);
        }

        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');

        // Base query for all users with eager loading
        $baseQuery = User::with('profilable');

        // Query for admins/superadmins
        $adminQuery = clone $baseQuery;
        $adminQuery->where(function($q) {
            $q->where('role', 'admin')
              ->orWhere('role', 'superadmin');
        });

        // Query for dosen
        $dosenQuery = clone $baseQuery;
        $dosenQuery->where('role', 'dosen');

        // Query for mahasiswa
        $mahasiswaQuery = clone $baseQuery;
        $mahasiswaQuery->where('role', 'mahasiswa');

        // Query for all users
        $allUsersQuery = clone $baseQuery;

        if ($search) {
            $searchWildcard = '%'.$search.'%';
            $searchCallback = function ($query) use ($searchWildcard) {
                $query->where('name', 'like', $searchWildcard)
                    ->orWhere('email', 'like', $searchWildcard)
                    ->orWhereHas('profilable', function($q) use ($searchWildcard) {
                        $q->where('nim', 'like', $searchWildcard)
                          ->orWhere('nip', 'like', $searchWildcard);
                    });
            };

            $adminQuery->where($searchCallback);
            $dosenQuery->where($searchCallback);
            $mahasiswaQuery->where($searchCallback);
            $allUsersQuery->where($searchCallback);
        }

        return Inertia::render('Admin/User/UserPage', [
            'users' => $adminQuery->latest()->paginate($perPage)->withQueryString(),
            'dosens' => $dosenQuery->latest()->paginate($perPage)->withQueryString(),
            'mahasiswas' => $mahasiswaQuery->latest()->paginate($perPage)->withQueryString(),
            'allUsers' => $allUsersQuery->latest()->paginate($perPage)->withQueryString(),
            'filters' => $request->only(['search']),
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
        if (! $id) {
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
                'type' => 'error',
            ]);
        }

        $tab = $request->input('tab', 'admin');
        $rules = $this->getValidationRules($tab);

        try {
            $validated = $request->validate($rules);
            
            DB::transaction(function () use ($validated, $tab) {
                // Create profile based on user type
                $profileData = array_filter([
                    'phone' => $validated['phone'] ?? null,
                    'address' => $validated['address'] ?? null,
                ]);

                if (isset($validated['nim'])) {
                    $profileData['nim'] = $validated['nim'];
                }
                if (isset($validated['nip'])) {
                    $profileData['nip'] = $validated['nip'];
                }

                $profile = match ($tab) {
                    'mahasiswa' => MahasiswaProfile::create($profileData),
                    'dosen' => DosenProfile::create($profileData),
                    default => AdminProfile::create($profileData),
                };

                // Create user
                $user = new User([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'password' => Hash::make($validated['password']),
                    'role' => match ($tab) {
                        'admin' => $validated['role'] ?? 'admin',
                        'dosen' => 'dosen',
                        'mahasiswa' => 'mahasiswa',
                        default => 'admin',
                    },
                ]);

                $profile->user()->save($user);
            });

            return redirect()->back()->with('flash', [
                'message' => ucfirst($tab).' berhasil ditambahkan',
                'type' => 'success',
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('flash', [
                'message' => 'Gagal menambahkan '.$tab,
                'type' => 'error',
            ]);
        }
    }

    public function update(Request $request, string $id)
    {
        if (Auth::user()->role !== 'superadmin') {
            return redirect()->back()->with('flash', [
                'message' => 'Unauthorized access',
                'type' => 'error',
            ]);
        }

        try {
            $user = User::with('profilable')->findOrFail($id);
            $tab = $request->query('tab', 'admin');
            $rules = $this->getValidationRules($tab, $id);
            $validated = $request->validate($rules);

            DB::transaction(function () use ($user, $validated, $tab) {
                // Update user data
                if (isset($validated['password'])) {
                    $validated['password'] = Hash::make($validated['password']);
                } else {
                    unset($validated['password']);
                }

                $userFields = array_intersect_key($validated, array_flip(['name', 'email', 'password', 'role']));
                $user->update($userFields);

                // Update profile data
                $profileFields = array_filter([
                    'phone' => $validated['phone'] ?? null,
                    'address' => $validated['address'] ?? null,
                    'nim' => $validated['nim'] ?? null,
                    'nip' => $validated['nip'] ?? null,
                ]);

                if ($user->profilable) {
                    $user->profilable->update($profileFields);
                }
            });

            return redirect()->back()->with('flash', [
                'message' => ucfirst($tab).' berhasil diperbarui',
                'type' => 'success',
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('flash', [
                'message' => 'Gagal memperbarui '.$tab,
                'type' => 'error',
            ]);
        }
    }

    public function destroy(Request $request, string $id)
    {
        if (Auth::user()->role !== 'superadmin') {
            return redirect()->back()->with('flash', [
                'message' => 'Unauthorized access',
                'type' => 'error',
            ]);
        }

        try {
            $user = User::findOrFail($id);
            $tab = $request->query('tab', 'admin');

            // Allow deletion from 'semua' tab or check if role matches specific tab
            $roleMatches = $tab === 'semua' || match ($tab) {
                'admin' => in_array($user->role, ['admin', 'superadmin']),
                'dosen' => $user->role === 'dosen',
                'mahasiswa' => $user->role === 'mahasiswa',
                default => false,
            };

            if (!$roleMatches) {
                return response()->json([
                    'message' => 'Invalid user type',
                ], 400);
            }

            $user->delete();

            return redirect()->back()->with('flash', [
                'message' => $tab === 'semua' ? 'User berhasil dihapus' : ucfirst($tab).' berhasil dihapus',
                'type' => 'success',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $tab === 'semua' ? 'Gagal menghapus user' : 'Gagal menghapus '.$tab,
            ], 500);
        }
    }
}
