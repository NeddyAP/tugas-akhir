<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Import Auth
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::where('role', '!=', 'mahasiswa')
            ->where('role', '!=', 'dosen');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%')
                    ->orWhere('role', 'like', '%' . $search . '%');
            });
        }

        $perPage = $request->input('per_page', 10);

        return Inertia::render('Admin/User/UserPage', [
            'users' => $query->latest()->paginate($perPage)->withQueryString(),
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (Auth::user()->role !== 'superadmin') {
            return redirect()->back()->withErrors(['error' => 'Role kurang tinggi untuk melakukan action.']);
        }

        // ...proceed with validation and storing user...
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        if (Auth::user()->role !== 'superadmin') {
            return redirect()->back()->withErrors(['error' => 'Role kurang tinggi untuk melakukan action.']);
        }

        // ...proceed with validation and updating user...
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        if (Auth::user()->role !== 'superadmin') {
            return redirect()->back()->withErrors(['error' => 'Role kurang tinggi untuk melakukan action.']);
        }

        // ...proceed with deleting user...
    }
}
