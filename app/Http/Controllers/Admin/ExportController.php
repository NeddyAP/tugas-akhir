<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpWord\PhpWord;

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
        $filename = "users-{$tab}-".date('Y-m-d-His');

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
            'title' => 'Data '.ucfirst($tab),
            'headers' => $this->getHeaders($tab),
            'data' => $data->map(fn ($item) => $this->getData($item, $tab)),
        ]);

        return $pdf->setPaper('a4', 'landscape')->download("{$filename}.pdf");
    }

    private function exportWord($data, $tab, $filename)
    {
        $phpWord = new PhpWord;
        $section = $phpWord->addSection();

        // Add title
        $section->addText('Data '.ucfirst($tab), ['bold' => true, 'size' => 16]);
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
}
