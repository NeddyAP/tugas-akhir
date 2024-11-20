<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpWord\PhpWord;
use App\Models\Logbook;
use App\Models\Bimbingan;
use Carbon\Carbon;

class ExportController extends Controller
{
    public function export(Request $request)
    {
        $format = $request->format;
        $tab = $request->tab;

        // Get data based on tab without pagination
        $query = match ($tab) {
            'mahasiswa' => User::where('role', 'mahasiswa'),
            'dosen' => User::where('role', 'dosen'),
            'admin' => User::whereIn('role', ['admin', 'superadmin']),
            'semua' => User::query()->selectRaw('*, COALESCE(nim, nip) as identifier'), // Add identifier for all users
            default => User::query(),
        };

        // Apply search if provided
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('nim', 'like', "%{$search}%")
                    ->orWhere('nip', 'like', "%{$search}%");
            });
        }

        // Get all data without pagination
        $data = $query->latest()->get();
        $filename = "users-{$tab}-" . date('Y-m-d-His');

        try {
            return match ($format) {
                'all' => response()->json(['data' => $data]), // Add this case for clipboard copy
                'excel' => $this->exportExcel($data, $tab, $filename),
                'pdf' => $this->exportPdf($data, $tab, $filename),
                'word' => $this->exportWord($data, $tab, $filename),
                default => response()->json(['error' => 'Invalid format'], 400),
            };
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function exportExcel($data, $tab, $filename)
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();

        // Add headers
        $headers = $this->getHeaders($tab);
        foreach ($headers as $col => $header) {
            $sheet->setCellValueByColumnAndRow($col + 1, 1, $header);
        }

        // Add data
        foreach ($data as $row => $item) {
            $rowData = $this->getData($item, $tab);
            foreach ($rowData as $col => $value) {
                $sheet->setCellValueByColumnAndRow($col + 1, $row + 2, $value);
            }
        }

        $writer = new Xlsx($spreadsheet);
        $path = storage_path("app/public/{$filename}.xlsx");
        $writer->save($path);

        return response()->download($path)->deleteFileAfterSend();
    }

    private function exportPdf($data, $tab, $filename)
    {
        $pdf = PDF::loadView('exports.users', [
            'title' => 'Data ' . ucfirst($tab),
            'headers' => $this->getHeaders($tab),
            'data' => $data->map(fn($item) => $this->getData($item, $tab)),
        ]);

        return $pdf->setPaper('a4', 'landscape')->download("{$filename}.pdf");
    }

    private function exportWord($data, $tab, $filename)
    {
        $phpWord = new PhpWord;
        $section = $phpWord->addSection();

        // Add title
        $section->addText('Data ' . ucfirst($tab), ['bold' => true, 'size' => 16]);
        $section->addTextBreak();

        // Create table
        $table = $section->addTable(['borderSize' => 1, 'borderColor' => '000000']);

        // Add headers
        $table->addRow();
        foreach ($this->getHeaders($tab) as $header) {
            $cell = $table->addCell(2000);
            $cell->addText($header, ['bold' => true]);
        }

        // Add data rows
        foreach ($data as $row) {
            $table->addRow();
            foreach ($this->getData($row, $tab) as $value) {
                $cell = $table->addCell(2000);
                $cell->addText($value);
            }
        }

        $path = storage_path("app/public/{$filename}.docx");
        $phpWord->save($path);

        return response()->download($path)->deleteFileAfterSend();
    }

    private function getHeaders($tab)
    {
        $headers = ['Nama', 'Email'];

        return match ($tab) {
            'mahasiswa' => [...$headers, 'NIM'],
            'dosen' => [...$headers, 'NIP'],
            'admin' => [...$headers, 'Role'],
            'all' => [...$headers, 'Role', 'NIM/NIP'],
            default => $headers,
        };
    }

    private function getData($row, $tab)
    {
        $data = [$row->name, $row->email];

        return match ($tab) {
            'mahasiswa' => [...$data, $row->nim],
            'dosen' => [...$data, $row->nip],
            'admin' => [...$data, $row->role],
            'all' => [...$data, $row->role, $row->nim ?: $row->nip],
            default => $data,
        };
    }

    public function exportLogbook(Request $request)
    {
        $format = $request->format;
        $type = $request->type ?? 'logbook';
        $user = auth()->user();

        // Get data based on type with user filtering
        $query = match ($type) {
            'logbook' => Logbook::query()->where('user_id', $user->id),
            'bimbingan' => Bimbingan::query()->where('user_id', $user->id),
            default => Logbook::query()->where('user_id', $user->id),
        };

        // Apply search if provided
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search, $type) {
                if ($type === 'logbook') {
                    $q->where('catatan', 'like', "%{$search}%")
                        ->orWhere('keterangan', 'like', "%{$search}%");
                } else {
                    $q->where('keterangan', 'like', "%{$search}%");
                }
            });
        }

        // Get filtered data
        $data = $query->with('user')->latest()->get();
        $filename = "{$type}-{$user->name}-" . date('Y-m-d-His');

        try {
            return match ($format) {
                'copy' => response()->json(['data' => $data]),
                'excel' => $this->exportLogbookExcel($data, $type, $filename),
                'pdf' => $this->exportLogbookPdf($data, $type, $filename),
                'word' => $this->exportLogbookWord($data, $type, $filename),
                default => response()->json(['error' => 'Format tidak valid'], 400),
            };
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function exportLogbookExcel($data, $type, $filename)
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();

        // Add headers
        $headers = $this->getLogbookHeaders($type);
        foreach ($headers as $col => $header) {
            $sheet->setCellValueByColumnAndRow($col + 1, 1, $header);
        }

        // Add data
        foreach ($data as $row => $item) {
            $rowData = $this->getLogbookData($item, $type);
            foreach ($rowData as $col => $value) {
                $sheet->setCellValueByColumnAndRow($col + 1, $row + 2, $value);
            }
        }

        $writer = new Xlsx($spreadsheet);
        $path = storage_path("app/public/{$filename}.xlsx");
        $writer->save($path);

        return response()->download($path)->deleteFileAfterSend();
    }

    private function exportLogbookPdf($data, $type, $filename)
    {
        $user = auth()->user();
        $pdf = PDF::loadView('exports.logbook', [
            'title' => 'Data ' . ucfirst($type) . ' - ' . $user->name,
            'headers' => $this->getLogbookHeaders($type),
            'data' => $data->map(fn($item) => $this->getLogbookData($item, $type)),
        ]);

        return $pdf->setPaper('a4', 'landscape')->download("{$filename}.pdf");
    }

    private function exportLogbookWord($data, $type, $filename)
    {
        $user = auth()->user();
        $phpWord = new PhpWord;
        $section = $phpWord->addSection();

        // Add title with user name
        $section->addText('Data ' . ucfirst($type) . ' - ' . $user->name, ['bold' => true, 'size' => 16]);
        $section->addTextBreak();

        // Create table
        $table = $section->addTable(['borderSize' => 1, 'borderColor' => '000000']);

        // Add headers
        $table->addRow();
        foreach ($this->getLogbookHeaders($type) as $header) {
            $cell = $table->addCell(2000);
            $cell->addText($header, ['bold' => true]);
        }

        // Add data rows
        foreach ($data as $row) {
            $table->addRow();
            foreach ($this->getLogbookData($row, $type) as $value) {
                $cell = $table->addCell(2000);
                $cell->addText($value);
            }
        }

        $path = storage_path("app/public/{$filename}.docx");
        $phpWord->save($path);

        return response()->download($path)->deleteFileAfterSend();
    }

    private function getLogbookHeaders($type)
    {
        $headers = ['Nama Mahasiswa', 'Tanggal'];

        return match ($type) {
            'logbook' => [...$headers, 'Catatan Kegiatan', 'Keterangan Kegiatan'],
            'bimbingan' => [...$headers, 'Keterangan Bimbingan', 'Status'],
            default => $headers,
        };
    }

    private function getLogbookData($row, $type)
    {
        $date = Carbon::parse($row->tanggal)->format('d F Y');
        $data = [$row->user->name, $date];

        return match ($type) {
            'logbook' => [...$data, $row->catatan, $row->keterangan],
            'bimbingan' => [...$data, $row->keterangan, $row->status ?? 'Belum ditandatangani'],
            default => $data,
        };
    }
}
