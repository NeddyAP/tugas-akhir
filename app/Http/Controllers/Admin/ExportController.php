<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ExportService;
use Illuminate\Http\Request;

class ExportController extends Controller
{
    protected $exportService;

    public function __construct(ExportService $exportService)
    {
        $this->exportService = $exportService;
    }

    public function export(Request $request)
    {
        $format = $request->query('format', 'excel');
        $tab = $request->query('tab', 'all');
        $search = $request->query('search');

        $query = User::query();

        // Filter based on tab
        if ($tab !== 'all') {
            $query->where('role', $tab);
        }

        // Apply search if provided
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('nim', 'like', "%{$search}%")
                  ->orWhere('nip', 'like', "%{$search}%");
            });
        }

        $users = $query->get();

        if ($format === 'all') {
            return response()->json(['data' => $users]);
        }

        $fileName = "users-{$tab}-" . date('Y-m-d-His');
        return $this->exportService->export($users, $format, $fileName);
    }
}
