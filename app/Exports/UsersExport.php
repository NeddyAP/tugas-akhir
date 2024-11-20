<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class UsersExport implements FromCollection, WithHeadings, WithMapping
{
    protected $data;

    protected $tab;

    public function __construct($data, $tab)
    {
        $this->data = $data;
        $this->tab = $tab;
    }

    public function collection()
    {
        return $this->data;
    }

    public function headings(): array
    {
        $headers = ['Nama', 'Email'];

        return match ($this->tab) {
            'mahasiswa' => [...$headers, 'NIM'],
            'dosen' => [...$headers, 'NIP'],
            'admin' => [...$headers, 'Role'],
            default => $headers,
        };
    }

    public function map($row): array
    {
        $data = [$row->name, $row->email];

        return match ($this->tab) {
            'mahasiswa' => [...$data, $row->nim],
            'dosen' => [...$data, $row->nip],
            'admin' => [...$data, $row->role],
            default => $data,
        };
    }
}
