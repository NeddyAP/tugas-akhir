<?php

namespace App\Services;

use Illuminate\Support\Collection;
use PDF;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpWord\PhpWord;

class ExportService
{
    public function export(Collection $data, string $format, string $fileName)
    {
        return match ($format) {
            'excel' => $this->exportToExcel($data, $fileName),
            'pdf' => $this->exportToPdf($data, $fileName),
            'word' => $this->exportToWord($data, $fileName),
            default => throw new \InvalidArgumentException('Unsupported format'),
        };
    }

    protected function exportToExcel(Collection $data, string $fileName)
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();

        // Set headers
        $headers = ['Name', 'Email', 'Role', 'NIM/NIP', 'Phone', 'Address'];
        foreach ($headers as $index => $header) {
            $sheet->setCellValueByColumnAndRow($index + 1, 1, $header);
        }

        // Set data
        $row = 2;
        foreach ($data as $item) {
            $sheet->setCellValueByColumnAndRow(1, $row, $item->name);
            $sheet->setCellValueByColumnAndRow(2, $row, $item->email);
            $sheet->setCellValueByColumnAndRow(3, $row, $item->role);
            $sheet->setCellValueByColumnAndRow(4, $row, $item->nim ?? $item->nip ?? '');
            $sheet->setCellValueByColumnAndRow(5, $row, $item->phone);
            $sheet->setCellValueByColumnAndRow(6, $row, $item->address);
            $row++;
        }

        $writer = new Xlsx($spreadsheet);
        $path = storage_path("app/public/{$fileName}.xlsx");
        $writer->save($path);

        return response()->download($path)->deleteFileAfterSend();
    }

    protected function exportToPdf(Collection $data, string $fileName)
    {
        $pdf = PDF::loadView('exports.users', ['data' => $data]);

        return $pdf->download("{$fileName}.pdf");
    }

    protected function exportToWord(Collection $data, string $fileName)
    {
        $phpWord = new PhpWord;
        $section = $phpWord->addSection();

        // Add headers
        $section->addText('Users Data Export');
        $section->addTextBreak();

        // Add table
        $table = $section->addTable();
        $table->addRow();
        foreach (['Name', 'Email', 'Role', 'NIM/NIP', 'Phone', 'Address'] as $header) {
            $table->addCell(2000)->addText($header);
        }

        foreach ($data as $item) {
            $table->addRow();
            $table->addCell(2000)->addText($item->name);
            $table->addCell(2000)->addText($item->email);
            $table->addCell(2000)->addText($item->role);
            $table->addCell(2000)->addText($item->nim ?? $item->nip ?? '');
            $table->addCell(2000)->addText($item->phone);
            $table->addCell(2000)->addText($item->address);
        }

        $path = storage_path("app/public/{$fileName}.docx");
        $phpWord->save($path);

        return response()->download($path)->deleteFileAfterSend();
    }

    public function exportLogbook(Collection $data, string $format, string $fileName)
    {
        return match ($format) {
            'excel' => $this->exportLogbookToExcel($data, $fileName),
            'pdf' => $this->exportLogbookToPdf($data, $fileName),
            'word' => $this->exportLogbookToWord($data, $fileName),
            default => throw new \InvalidArgumentException('Unsupported format'),
        };
    }

    protected function exportLogbookToExcel(Collection $data, string $fileName)
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();

        // Set headers
        $headers = ['Tanggal', 'Catatan Kegiatan', 'Keterangan Kegiatan'];
        foreach ($headers as $index => $header) {
            $sheet->setCellValueByColumnAndRow($index + 1, 1, $header);
        }

        // Set data
        $row = 2;
        foreach ($data as $item) {
            $sheet->setCellValueByColumnAndRow(1, $row, $item->tanggal);
            $sheet->setCellValueByColumnAndRow(2, $row, $item->catatan);
            $sheet->setCellValueByColumnAndRow(3, $row, $item->keterangan);
            $row++;
        }

        $writer = new Xlsx($spreadsheet);
        $path = storage_path("app/public/{$fileName}.xlsx");
        $writer->save($path);

        return response()->download($path)->deleteFileAfterSend();
    }

    protected function exportLogbookToPdf(Collection $data, string $fileName)
    {
        $pdf = PDF::loadView('exports.logbooks', ['data' => $data]);

        return $pdf->download("{$fileName}.pdf");
    }

    protected function exportLogbookToWord(Collection $data, string $fileName)
    {
        $phpWord = new PhpWord;
        $section = $phpWord->addSection();

        // Add headers
        $section->addText('Logbook Data Export');
        $section->addTextBreak();

        // Add table
        $table = $section->addTable();
        $table->addRow();
        foreach (['Tanggal', 'Catatan Kegiatan', 'Keterangan Kegiatan'] as $header) {
            $table->addCell(2000)->addText($header);
        }

        foreach ($data as $item) {
            $table->addRow();
            $table->addCell(2000)->addText($item->tanggal);
            $table->addCell(2000)->addText($item->catatan);
            $table->addCell(2000)->addText($item->keterangan);
        }

        $path = storage_path("app/public/{$fileName}.docx");
        $phpWord->save($path);

        return response()->download($path)->deleteFileAfterSend();
    }

    public function exportBimbingan(Collection $data, string $format, string $fileName)
    {
        return match ($format) {
            'excel' => $this->exportBimbinganToExcel($data, $fileName),
            'pdf' => $this->exportBimbinganToPdf($data, $fileName),
            'word' => $this->exportBimbinganToWord($data, $fileName),
            default => throw new \InvalidArgumentException('Unsupported format'),
        };
    }

    protected function exportBimbinganToExcel(Collection $data, string $fileName)
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();

        $headers = ['Tanggal Bimbingan', 'Keterangan Bimbingan', 'Status'];
        foreach ($headers as $index => $header) {
            $sheet->setCellValueByColumnAndRow($index + 1, 1, $header);
        }

        $row = 2;
        foreach ($data as $item) {
            $sheet->setCellValueByColumnAndRow(1, $row, $item->tanggal);
            $sheet->setCellValueByColumnAndRow(2, $row, $item->keterangan);
            $sheet->setCellValueByColumnAndRow(3, $row, $item->status);
            $row++;
        }

        $writer = new Xlsx($spreadsheet);
        $path = storage_path("app/public/{$fileName}.xlsx");
        $writer->save($path);

        return response()->download($path)->deleteFileAfterSend();
    }

    protected function exportBimbinganToPdf(Collection $data, string $fileName)
    {
        $pdf = PDF::loadView('exports.bimbingans', ['data' => $data]);

        return $pdf->download("{$fileName}.pdf");
    }

    protected function exportBimbinganToWord(Collection $data, string $fileName)
    {
        $phpWord = new PhpWord;
        $section = $phpWord->addSection();

        $section->addText('Bimbingan Data Export');
        $section->addTextBreak();

        $table = $section->addTable();
        $table->addRow();
        foreach (['Tanggal Bimbingan', 'Keterangan Bimbingan', 'Status'] as $header) {
            $table->addCell(2000)->addText($header);
        }

        foreach ($data as $item) {
            $table->addRow();
            $table->addCell(2000)->addText($item->tanggal);
            $table->addCell(2000)->addText($item->keterangan);
            $table->addCell(2000)->addText($item->status);
        }

        $path = storage_path("app/public/{$fileName}.docx");
        $phpWord->save($path);

        return response()->download($path)->deleteFileAfterSend();
    }
}
