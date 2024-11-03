<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MahasiswaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::where('role', '!=', 'admin')
            ->where('role', '!=', 'dosen')
            ->where('role', '!=', 'superadmin');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('nim', 'like', "%{$search}%");
            });
        }

        $perPage = $request->input('per_page', 10);

        return Inertia::render('Admin/Mahasiswa/MahasiswaPage', [
            'mahasiswas' => $query->latest()->paginate($perPage)->withQueryString(),
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
        $request = $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'nim' => 'required',
            'password' => 'required',
        ]);
        $request['role'] = 'mahasiswa';

        User::create($request);

        return redirect()->route('admin.mahasiswas.index')->with('flash', ['message' => 'Mahasiswa berhasil ditambahkan.', 'type' => 'success']);
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
        $request = $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'nim' => 'required',
        ]);

        User::find($id)->update($request);

        return redirect()->route('admin.mahasiswas.index')->with('flash', ['message' => 'Mahasiswa berhasil diupdate.', 'type' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        User::destroy($id);

        return redirect()->route('admin.mahasiswas.index')->with('flash', ['message' => 'Mahasiswa berhasil dihapus.', 'type' => 'success']);
    }
}
