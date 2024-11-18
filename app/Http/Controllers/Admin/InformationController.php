<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InformationController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        $informations = Question::query()
            ->select('id', 'question', 'answer', 'created_at')
            ->when($search, function ($query, $search) {
                $query->where('question', 'like', "%{$search}%")
                    ->orWhere('answer', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Admin/Information/InformationPage', [
            'informations' => $informations,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
        ]);

        try {
            Question::create($validated);

            return redirect()->back()->with('flash', [
                'type' => 'success',
                'message' => 'FAQ berhasil ditambahkan'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'Terjadi kesalahan saat menambahkan FAQ'
            ]);
        }
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
        ]);

        try {
            $question = Question::findOrFail($id);
            $question->update($validated);

            return redirect()->back()->with('flash', [
                'type' => 'success',
                'message' => 'FAQ berhasil diperbarui'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'Terjadi kesalahan saat memperbarui FAQ'
            ]);
        }
    }

    public function destroy(string $id)
    {
        try {
            $question = Question::findOrFail($id);
            $question->delete();
            return redirect()->back()->with('flash', [
                'message' => 'FAQ berhasil dihapus',
                'type' => 'success'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'Terjadi kesalahan saat menghapus FAQ'
            ]);
        }
    }
}
