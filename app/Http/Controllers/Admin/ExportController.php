<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bimbingan;
use App\Models\Logbook;
use App\Models\User;
use App\Services\ExportService;
use Illuminate\Http\Request;

class ExportController extends Controller
{
    protected ExportService $exportService;

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

        if ($tab !== 'all') {
            $query->where('role', $tab);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%")
                    ->orWhere('nim', 'like', "%$search%")
                    ->orWhere('nip', 'like', "%$search%");
            });
        }

        $users = $query->get();

        if ($format === 'all') {
            return response()->json(['data' => $users]);
        }

        $fileName = "users-$tab-" . date('Y-m-d-His');

        return $this->exportService->export($users, $format, $fileName);
    }

    public function exportLogbook(Request $request)
    {
        $format = $request->query('format', 'excel');
        $search = $request->query('search');

        $query = Logbook::with('user');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('tanggal', 'like', "%$search%")
                    ->orWhere('catatan', 'like', "%$search%")
                    ->orWhere('keterangan', 'like', "%$search%");
            });
        }

        $logbooks = $query->get();

        if ($format === 'all') {
            return response()->json(['data' => $logbooks]);
        }

        $fileName = 'logbooks-' . date('Y-m-d-His');

        return $this->exportService->exportLogbook($logbooks, $format, $fileName);
    }

    public function exportBimbingan(Request $request)
    {
        $format = $request->query('format', 'excel');
        $search = $request->query('search');

        $query = Bimbingan::with('user');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('tanggal', 'like', "%$search%")
                    ->orWhere('keterangan', 'like', "%$search%");
            });
        }

        $bimbingans = $query->get();

        if ($format === 'all') {
            return response()->json(['data' => $bimbingans]);
        }

        $fileName = 'bimbingans-' . date('Y-m-d-His');

        return $this->exportService->exportBimbingan($bimbingans, $format, $fileName);
    }
}
