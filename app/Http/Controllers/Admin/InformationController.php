<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Panduan;
use App\Models\Question;
use App\Models\Tutorial;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class InformationController extends Controller
{
    private const TYPE_QUESTION = 'question';

    private const TYPE_TUTORIAL = 'tutorial';

    private const TYPE_PANDUAN = 'panduan';

    private array $modelMap = [
        self::TYPE_QUESTION => Question::class,
        self::TYPE_TUTORIAL => Tutorial::class,
        self::TYPE_PANDUAN => Panduan::class,
    ];

    private array $validationRules = [
        self::TYPE_QUESTION => [
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
        ],
        self::TYPE_TUTORIAL => [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'link' => 'required|string',
        ],
        self::TYPE_PANDUAN => [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'file' => 'required|file|mimes:pdf|max:5120',
        ],
    ];

    public function index(Request $request)
    {
        $type = $request->input('type', self::TYPE_QUESTION);
        $modelClass = $this->getModelClass($type);
        $data = $modelClass::latest()->paginate(10);

        return Inertia::render('Admin/Information/InformationPage', [
            'questions' => $type === self::TYPE_QUESTION ? $data : null,
            'tutorials' => $type === self::TYPE_TUTORIAL ? $data : null,
            'panduans' => $type === self::TYPE_PANDUAN ? $data : null,
            'type' => $type,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $type = $request->input('type', self::TYPE_QUESTION);
            $rules = $this->getValidationRules($type);
            $validated = $request->validate($rules);

            $validated = array_filter($validated, fn($value) => ! is_null($value));

            if ($type === self::TYPE_PANDUAN && isset($validated['file'])) {
                $path = $request->file('file')->store('panduans', 'public');
                $validated['file'] = $path;
            }

            $modelClass = $this->getModelClass($type);
            $modelClass::create($validated);

            return $this->successResponse($type, 'ditambahkan');
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $type = $request->input('type', self::TYPE_QUESTION);
            $rules = $this->getValidationRules($type, true);
            $validated = $request->validate($rules);

            $validated = array_filter($validated, fn($value) => ! is_null($value));

            $model = $this->getModelClass($type);
            $item = $model::findOrFail($id);

            if ($type === self::TYPE_PANDUAN && isset($validated['file'])) {
                Storage::disk('public')->delete($item->file);
                $path = $request->file('file')->store('panduans', 'public');
                $validated['file'] = $path;
            }

            $item->update($validated);

            return $this->successResponse($type, 'diperbarui');
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }

    public function destroy($id, Request $request)
    {
        try {
            $type = $request->query('type', self::TYPE_QUESTION);
            $model = $this->getModelClass($type);
            $item = $model::findOrFail($id);

            if ($type === self::TYPE_PANDUAN) {
                Storage::disk('public')->delete($item->file);
            }

            $item->delete();

            return $this->successResponse($type, 'dihapus');
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }

    private function getModelClass(string $type): string
    {
        return $this->modelMap[$type] ?? Question::class;
    }

    private function getValidationRules(string $type, bool $isUpdate = false): array
    {
        $rules = $this->validationRules[$type] ?? [];

        if ($isUpdate) {
            // Make all fields nullable on update
            $rules = array_map(fn($rule) => 'nullable|' . $rule, $rules);

            // Special handling for panduan file
            if ($type === self::TYPE_PANDUAN) {
                $rules['file'] = 'nullable|file|mimes:pdf|max:5120';
            }
        }

        return $rules;
    }

    private function getTypeLabel(string $type): string
    {
        return match ($type) {
            self::TYPE_QUESTION => 'FAQ',
            self::TYPE_TUTORIAL => 'Tutorial',
            self::TYPE_PANDUAN => 'Panduan',
            default => 'Item'
        };
    }

    private function successResponse(string $type, string $action): RedirectResponse
    {
        $label = $this->getTypeLabel($type);

        return redirect()
            ->route('admin.informations.index', ['type' => $type])
            ->with('flash', [
                'type' => 'success',
                'message' => "{$label} berhasil {$action}",
            ]);
    }

    private function errorResponse(Exception $e): RedirectResponse
    {
        report($e);

        return redirect()
            ->back()
            ->with('flash', [
                'type' => 'error',
                'message' => 'Gagal memproses data: ' . $e->getMessage(),
            ]);
    }
}
