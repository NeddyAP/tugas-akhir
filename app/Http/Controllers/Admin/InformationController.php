<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Tutorial;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InformationController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->input('type', 'question');
        $model = $type === 'question' ? Question::class : Tutorial::class;
        $data = $model::latest()->paginate(10);

        return Inertia::render('Admin/Information/InformationPage', [
            'questions' => $type === 'question' ? $data : null,
            'tutorials' => $type === 'tutorial' ? $data : null,
            'type' => $type
        ]);
    }

    public function store(Request $request)
    {
        try {
            if ($request->type === 'question') {
                Question::create($request->validate([
                    'question' => 'required|string|max:255',
                    'answer' => 'required|string'
                ]));
            } else {
                Tutorial::create($request->validate([
                    'title' => 'required|string|max:255',
                    'description' => 'required|string',
                    'link' => 'required|string'
                ]));
            }

            return redirect()->back()->with('flash', [
                'type' => 'success', // atau 'error', 'info', 'warning'
                'message' => ($request->type === 'question' ? 'FAQ' : 'Tutorial') . ' berhasil ditambahkan'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('flash', [
                'type' => 'error', // atau 'error', 'info', 'warning'
                'message' => 'Gagal menambahkan data: ' . $e->getMessage()
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $type = $request->input('type');
            $validated = $request->validate($type === 'question' ? [
                'question' => 'required|string|max:255',
                'answer' => 'required|string',
                'type' => 'required|string'
            ] : [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'link' => 'required|string',
                'type' => 'required|string'
            ]);

            $model = $type === 'question' ? Question::class : Tutorial::class;
            $item = $model::findOrFail($id);

            // Remove type from validated data
            unset($validated['type']);
            $item->update($validated);

            return redirect()->back()->with('flash', [
                'type' => 'success', // atau 'error', 'info', 'warning'
                'message' => ($type === 'question' ? 'FAQ' : 'Tutorial') . ' berhasil diperbarui'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('flash', [
                'type' => 'error', // atau 'error', 'info', 'warning'
                'message' => 'Gagal memperbarui data: ' . $e->getMessage()
            ]);
        }
    }

    public function destroy($id, Request $request)
    {
        try {
            $type = $request->query('type');

            if (!$type) {
                throw new \Exception('Type parameter is required');
            }

            $model = $type === 'question' ? Question::class : Tutorial::class;
            $item = $model::findOrFail($id);
            $item->delete();

            return redirect()->back()->with('flash', [
                'type' => 'success', // atau 'error', 'info', 'warning'
                'message' => ($type === 'question' ? 'FAQ' : 'Tutorial') . ' berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            report($e);
            return redirect()->back()->with('flash', [
                'type' => 'error', // atau 'error', 'info', 'warning'
                'message' => 'Gagal menghapus data: ' . $e->getMessage()
            ]);
        }
    }
}
