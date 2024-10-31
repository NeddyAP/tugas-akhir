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
    public function index()
    {
        return Inertia::render('Admin/User/UserPage', [
            'users' => User::where('role', '!=', 'mahasiswa')->where('role', '!=', 'dosen')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
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
